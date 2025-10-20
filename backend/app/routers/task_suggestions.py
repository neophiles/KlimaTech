from fastapi import APIRouter, HTTPException, Depends, status, Query
from sqlmodel import Session, select
from app.db import get_session
from app.models import Barangay, HeatLog
from app.schemas.task_suggestions import TaskInput, TaskSuggestion, Tip
from app.utils.heat_index import calculate_heat_index
import cohere
import os
from datetime import datetime, timedelta, timezone
import httpx
from typing import Optional
from sqlmodel import select
from app.models import UserProfile, StudentProfile, OutdoorWorkerProfile, OfficeWorkerProfile, HomeBasedProfile, UserType


router = APIRouter(prefix="/suggestions", tags=["AI Suggestions"])

PH_TZ = timezone(timedelta(hours=8))
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.ClientV2(api_key=COHERE_API_KEY)
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


async def get_today_forecast_for_barangay(barangay: Barangay):
    async with httpx.AsyncClient() as client:
        params = {
            "latitude": barangay.lat,
            "longitude": barangay.lon,
            "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "uv_index"],
            "timezone": "Asia/Manila"
        }
        r = await client.get(OPEN_METEO_URL, params=params)
        r.raise_for_status()
        data = r.json()

    times = data["hourly"]["time"]
    temps = data["hourly"]["temperature_2m"]
    hums = data["hourly"]["relative_humidity_2m"]
    winds = data["hourly"]["wind_speed_10m"]
    uvs = data["hourly"]["uv_index"]

    today = datetime.now(PH_TZ).date()
    forecast = []
    for i in range(len(times)):
        dt = datetime.fromisoformat(times[i])
        if dt.date() == today:
            hi, risk = calculate_heat_index(temps[i], hums[i])
            forecast.append({
                "time": dt,
                "temperature": temps[i],
                "humidity": hums[i],
                "wind_speed": winds[i],
                "uv_index": uvs[i],
                "heat_index": hi,
                "risk_level": risk
            })

    return forecast


@router.post("/", response_model=list[TaskSuggestion])
async def generate_task_suggestions(data: TaskInput, session: Session = Depends(get_session)):
    try:
        barangay = session.get(Barangay, data.barangay_id)
        if not barangay:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barangay not found")

        # Get today's hourly forecast
        forecast = await get_today_forecast_for_barangay(barangay)

        if forecast:
            weather = {
                "barangay": barangay.barangay,
                "province": barangay.province,
                "temperature": forecast[0]["temperature"] if forecast else "-",
                "humidity": forecast[0]["humidity"] if forecast else "-",
                "uv_index": forecast[0]["uv_index"] if forecast else "-",
                "heat_index": forecast[0]["heat_index"] if forecast else "-",
                "risk_level": forecast[0]["risk_level"] if forecast else "-"
            }

        else:
            weather = {
                "barangay": barangay.barangay_name,
                "province": barangay.province_name,
                "temperature": "-",
                "humidity": "-",
                "uv_index": "-",
                "heat_index": "-",
                "risk_level": "-"
            }

        # Match each task to its closest forecast hour
        task_contexts = []
        for t in data.tasks:
            try:
                task_time = datetime.strptime(t.time, "%H:%M").time()
                if forecast:
                    closest = min(forecast, key=lambda f: abs(f["time"].time().hour - task_time.hour))
                    context = (
                        f"{t.task} at {t.time} -> "
                        f"{closest['temperature']}°C, humidity {closest['humidity']}%, "
                        f"UV index {closest['uv_index']}, heat index {closest['heat_index']}°C "
                        f"({closest['risk_level']})"
                    )
                else:
                    context = f"{t.task} at {t.time} → (no forecast data found)"
                task_contexts.append(context)
            except Exception:
                task_contexts.append(f"{t.task} at {t.time} → (no forecast data found)")

        tasks_text = "\n".join(task_contexts)

        # AI prompt
        prompt = f"""
You are an AI that gives short, practical advice about each task 
based on the current weather conditions. You must only reply to 
the provided tasks — do not invent new ones.

Weather in {weather['barangay']}, {weather['province']}: 
{weather['temperature']}°C, humidity {weather['humidity']}%, 
UV index {weather['uv_index']}, heat index {weather['heat_index']}°C ({weather['risk_level']}).

Tasks to evaluate:
{tasks_text}

Respond ONLY with suggestions for these exact tasks.
For each, follow this format exactly:
- [Task name] at [time] -> [one-sentence suggestion]
"""

        # call the AI (increase max_tokens, lower temperature for stability)
        response = co.chat(
            model="command-r-plus-08-2024",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=600
        )

        ai_output = response.message.content[0].text.strip()
        print("AI OUTPUT:", ai_output)

        # if the model response seems cut off (doesn't end with sentence punctuation),
        # retry once with more tokens and lower temperature
        if ai_output and not ai_output.strip()[-1] in ".!?":
            try:
                print("AI output looks truncated, retrying for completion...")
                response2 = co.chat(
                    model="command-r-plus-08-2024",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.2,
                    max_tokens=800
                )
                ai_output2 = response2.message.content[0].text.strip()
                if ai_output2:
                    ai_output = ai_output2
                    print("AI OUTPUT RETRY:", ai_output2)
            except Exception as _:
                # ignore retry failures and continue with original output
                pass

        suggestions = []
        for line in ai_output.splitlines():
            line = line.strip()
            if not line:
                continue
            # support formats like "- Task at 08:00 -> suggestion" or "Task at 08:00 -> suggestion"
            if "->" in line:
                task, suggestion = line.split("->", 1)
                suggestions.append(TaskSuggestion(
                    task=task.strip("- ").strip(),
                    suggestion=suggestion.strip()
                ))
            else:
                # fallback: try to parse lines that start with "- " and contain " at "
                text = line.lstrip("- ").strip()
                if " at " in text and "->" not in line:
                    # put the remainder as suggestion if present on same line after a dash
                    parts = text.split(" at ", 1)
                    # can't reliably split suggestion; skip or add as suggestion-less entry
                    suggestions.append(TaskSuggestion(
                        task=text,
                        suggestion=""
                    ))

        return suggestions

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))



@router.get("/tips/{barangay_id}", response_model=list[Tip])
async def get_tips(
    barangay_id: int,
    user_id: Optional[int] = Query(None, description="Optional user id for personalization"),                    
    session: Session = Depends(get_session),
):
    barangay = session.get(Barangay, barangay_id)
    if not barangay:
        raise HTTPException(status_code=404, detail="Barangay not found")

    # fetch user and profile details if provided
    user = None
    user_context = ""
    if user_id is not None:
        user = session.get(UserProfile, user_id)
        if user:
            # prefer explicit profile queries so fields are available regardless of lazy loading
            profile_lines = []
            if user.user_type:
                profile_lines.append(f"Type: {user.user_type}")
            # student
            if user.user_type == UserType.student:
                student = session.exec(select(StudentProfile).where(StudentProfile.user_id == user.id)).first()
                if student:
                    if student.days_on_campus: profile_lines.append(f"Days on campus: {student.days_on_campus}")
                    if student.class_hours: profile_lines.append(f"Class hours: {student.class_hours}")
                    if student.has_outdoor_activities is not None:
                        profile_lines.append(f"Has outdoor activities: {student.has_outdoor_activities}")
                    if student.outdoor_hours: profile_lines.append(f"Outdoor hours: {student.outdoor_hours}")
            # outdoor worker
            if user.user_type == UserType.outdoor_worker:
                outdoor = session.exec(select(OutdoorWorkerProfile).where(OutdoorWorkerProfile.user_id == user.id)).first()
                if outdoor:
                    if outdoor.work_type: profile_lines.append(f"Work type: {outdoor.work_type}")
                    if outdoor.work_hours: profile_lines.append(f"Work hours: {outdoor.work_hours}")
                    if outdoor.break_type: profile_lines.append(f"Break type: {outdoor.break_type}")
            # office worker
            if user.user_type == UserType.office_worker:
                office = session.exec(select(OfficeWorkerProfile).where(OfficeWorkerProfile.user_id == user.id)).first()
                if office:
                    if office.office_days: profile_lines.append(f"Office days: {office.office_days}")
                    if office.work_hours: profile_lines.append(f"Work hours: {office.work_hours}")
                    if office.commute_mode: profile_lines.append(f"Commute: {office.commute_mode}")
                    if office.goes_out_for_lunch is not None:
                        profile_lines.append(f"Goes out for lunch: {office.goes_out_for_lunch}")
            # home based
            if user.user_type == UserType.home_based:
                home = session.exec(select(HomeBasedProfile).where(HomeBasedProfile.user_id == user.id)).first()
                if home:
                    if home.outdoor_activities: profile_lines.append(f"Outdoor activities: {home.outdoor_activities}")
                    if home.preferred_times: profile_lines.append(f"Preferred times: {home.preferred_times}")

            if profile_lines:
                user_context = "User profile: " + "; ".join(profile_lines)

    forecast = await get_today_forecast_for_barangay(barangay)
    if not forecast:
        # fallback tips (non-AI) — personalize slightly if we have user info
        if user_context:
            return [
                Tip(is_do=True, main_text="Magdala ng payong at tubig", sub_text="Kung aalis sa araw"),
                Tip(is_do=True, main_text="Planuhin ang oras ng paglabas", sub_text="Iwasang lumabas sa peak heat hours"),
                Tip(is_do=False, main_text="Mag-PE sa pinakamainit na oras", sub_text="Piliin ang mas malamig na oras ayon sa iyong schedule")
            ]
        return [
            Tip(is_do=True, main_text="Magdala ng payong at tubig", sub_text="Paglabas"),
            Tip(is_do=True, main_text="Manatili sa silid-aralan", sub_text="9AM-5PM"),
            Tip(is_do=False, main_text="Mag-PE sa araw", sub_text="Panganib: Dehydration")
        ]

    # Prepare weather summary for AI
    w = forecast[0]
    weather_summary = f"""
Weather in {barangay.barangay}, {barangay.province}:
Temp: {w['temperature']}°C,
Humidity: {w['humidity']}%,
UV index: {w['uv_index']},
Heat index: {w['heat_index']}°C ({w['risk_level']})
"""

    # Build prompt including user context if available
    prompt = f"""
You are an AI that gives 1-sentence practical tips for staying safe and healthy in hot weather.
Generate 3 tips for things people SHOULD do, and 3 tips for things people SHOULD NOT do
based on the following weather and the person's profile (if any). Tailor tips to the user's situation
so they are actionable for that person.
Make the responses Tagalog/Filipino language.

{weather_summary}

{"Personalize for: " + user_context if user_context else ""}

Return tips in this format, one per line:
DO: [main_text] | [sub_text]
DONT: [main_text] | [sub_text]
"""

    try:
        response = co.chat(
            model="command-r-plus-08-2024",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=300
        )
        ai_output = response.message.content[0].text.strip()

        tips = []
        for line in ai_output.splitlines():
            line = line.strip()
            if not line:
                continue
            if line.upper().startswith("DO:"):
                payload = line[3:].strip()
                if "|" in payload:
                    main, sub = payload.split("|", 1)
                else:
                    main, sub = payload, ""
                tips.append(Tip(is_do=True, main_text=main.strip(), sub_text=sub.strip()))
            elif line.upper().startswith("DONT:") or line.upper().startswith("DON'T:"):
                # handle variations like DON'T:
                payload = line.split(":", 1)[1].strip() if ":" in line else line[5:].strip()
                if "|" in payload:
                    main, sub = payload.split("|", 1)
                else:
                    main, sub = payload, ""
                tips.append(Tip(is_do=False, main_text=main.strip(), sub_text=sub.strip()))

        # fallback if AI output is empty or malformed
        if not tips:
            raise ValueError("AI returned no tips")
    except Exception as e:
        print("Failed to generate AI tips:", e)
        # personalized simple fallback when user info exists
        if user_context:
            tips = [
                Tip(is_do=True, main_text="Uminom ng tubig bago lumabas", sub_text="Bawasan ang panganib ng dehydration"),
                Tip(is_do=True, main_text="Maghanap ng shaded o indoor na lugar", sub_text="Kung pupunta sa labas sa oras ng trabaho/klase"),
                Tip(is_do=False, main_text="Huwag mag-ehersisyo sa peak heat", sub_text="I-reschedule ayon sa iyong schedule")
            ]
        else:
            tips = [
                Tip(is_do=True, main_text="Magdala ng payong at tubig", sub_text="Paglabas"),
                Tip(is_do=True, main_text="Manatili sa silid-aralan", sub_text="9AM-5PM"),
                Tip(is_do=False, main_text="Mag-PE sa araw", sub_text="Panganib: Dehydration")
            ]

    return tips