import os
import time
import logging
import asyncio
import httpx
import cohere
from datetime import datetime, timedelta, timezone
from typing import Optional, List

from fastapi import HTTPException, status
from sqlmodel import select, Session

from app.models import Barangay, UserProfile, StudentProfile, OutdoorWorkerProfile, OfficeWorkerProfile, HomeBasedProfile, UserType
from app.schemas.task_suggestions import TaskInput, TaskSuggestion, Tip
from app.utils.heat_index import calculate_heat_index

PH_TZ = timezone(timedelta(hours=8))
OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

COHERE_API_KEY = os.getenv("COHERE_API_KEY")
co = cohere.ClientV2(api_key=COHERE_API_KEY) if COHERE_API_KEY else None

# tips cache
TIPS_CACHE: dict = {}
TIPS_CACHE_LOCK = asyncio.Lock()
TIPS_CACHE_TTL = timedelta(minutes=180)

logger = logging.getLogger("task_suggestions")
if not logger.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    logger.addHandler(handler)
logger.setLevel(logging.INFO)


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


async def generate_task_suggestions(data: TaskInput, session: Session) -> List[TaskSuggestion]:
    barangay = session.get(Barangay, data.barangay_id)
    if not barangay:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barangay not found")

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
            "barangay": getattr(barangay, "barangay", "-"),
            "province": getattr(barangay, "province", "-"),
            "temperature": "-",
            "humidity": "-",
            "uv_index": "-",
            "heat_index": "-",
            "risk_level": "-"
        }

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

    if co is None:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="AI client not configured")

    response = co.chat(
        model="command-r-plus-08-2024",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=600
    )

    ai_output = response.message.content[0].text.strip()

    # retry if truncated
    if ai_output and not ai_output.strip()[-1] in ".!?":
        try:
            response2 = co.chat(
                model="command-r-plus-08-2024",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=800
            )
            ai_output2 = response2.message.content[0].text.strip()
            if ai_output2:
                ai_output = ai_output2
        except Exception:
            pass

    suggestions: List[TaskSuggestion] = []
    for line in ai_output.splitlines():
        line = line.strip()
        if not line:
            continue
        if "->" in line:
            task, suggestion = line.split("->", 1)
            suggestions.append(TaskSuggestion(task=task.strip("- ").strip(), suggestion=suggestion.strip()))
        else:
            text = line.lstrip("- ").strip()
            if " at " in text and "->" not in line:
                suggestions.append(TaskSuggestion(task=text, suggestion=""))

    return suggestions


async def get_tips(barangay_id: int, user_id: Optional[int], force: bool, session: Session) -> List[Tip]:
    start_time = time.time()
    cache_key = (barangay_id, user_id)

    if not force:
        async with TIPS_CACHE_LOCK:
            entry = TIPS_CACHE.get(cache_key)
            if entry and (datetime.now(timezone.utc) - entry["ts"]) < TIPS_CACHE_TTL:
                logger.info("Returning cached tips for barangay=%s user=%s (age=%s sec)",
                            barangay_id, user_id, (datetime.now(timezone.utc) - entry["ts"]).total_seconds())
                return entry["tips"]

    barangay = session.get(Barangay, barangay_id)
    if not barangay:
        raise HTTPException(status_code=404, detail="Barangay not found")

    logger.info("Generating tips for barangay=%s user=%s", barangay_id, user_id)

    # build user context if available
    user = None
    user_context = ""
    if user_id is not None:
        user = session.get(UserProfile, user_id)
        if user:
            profile_lines = []
            if user.user_type:
                profile_lines.append(f"Type: {user.user_type}")
            if user.user_type == UserType.student:
                student = session.exec(select(StudentProfile).where(StudentProfile.user_id == user.id)).first()
                if student:
                    if student.days_on_campus: profile_lines.append(f"Days on campus: {student.days_on_campus}")
                    if student.class_hours: profile_lines.append(f"Class hours: {student.class_hours}")
                    if student.has_outdoor_activities is not None:
                        profile_lines.append(f"Has outdoor activities: {student.has_outdoor_activities}")
                    if student.outdoor_hours: profile_lines.append(f"Outdoor hours: {student.outdoor_hours}")
            if user.user_type == UserType.outdoor_worker:
                outdoor = session.exec(select(OutdoorWorkerProfile).where(OutdoorWorkerProfile.user_id == user.id)).first()
                if outdoor:
                    if outdoor.work_type: profile_lines.append(f"Work type: {outdoor.work_type}")
                    if outdoor.work_hours: profile_lines.append(f"Work hours: {outdoor.work_hours}")
                    if outdoor.break_type: profile_lines.append(f"Break type: {outdoor.break_type}")
            if user.user_type == UserType.office_worker:
                office = session.exec(select(OfficeWorkerProfile).where(OfficeWorkerProfile.user_id == user.id)).first()
                if office:
                    if office.office_days: profile_lines.append(f"Office days: {office.office_days}")
                    if office.work_hours: profile_lines.append(f"Work hours: {office.work_hours}")
                    if office.commute_mode: profile_lines.append(f"Commute: {office.commute_mode}")
                    if office.goes_out_for_lunch is not None:
                        profile_lines.append(f"Goes out for lunch: {office.goes_out_for_lunch}")
            if user.user_type == UserType.home_based:
                home = session.exec(select(HomeBasedProfile).where(HomeBasedProfile.user_id == user.id)).first()
                if home:
                    if home.outdoor_activities: profile_lines.append(f"Outdoor activities: {home.outdoor_activities}")
                    if home.preferred_times: profile_lines.append(f"Preferred times: {home.preferred_times}")

            if profile_lines:
                user_context = "User profile: " + "; ".join(profile_lines)

    forecast = await get_today_forecast_for_barangay(barangay)
    if not forecast:
        if user_context:
            tips = [
                Tip(is_do=True, main_text="Magdala ng payong at tubig", sub_text="Kung aalis sa araw"),
                Tip(is_do=True, main_text="Planuhin ang oras ng paglabas", sub_text="Iwasang lumabas sa peak heat hours"),
                Tip(is_do=False, main_text="Mag-PE sa pinakamainit na oras", sub_text="Piliin ang mas malamig na oras ayon sa iyong schedule")
            ]
        else:
            tips = [
                Tip(is_do=True, main_text="Magdala ng payong at tubig", sub_text="Paglabas"),
                Tip(is_do=True, main_text="Manatili sa silid-aralan", sub_text="9AM-5PM"),
                Tip(is_do=False, main_text="Mag-PE sa araw", sub_text="Panganib: Dehydration")
            ]
        async with TIPS_CACHE_LOCK:
            TIPS_CACHE[cache_key] = {"tips": tips, "ts": datetime.now(timezone.utc)}
        return tips

    w = forecast[0]
    weather_summary = f"""
Weather in {barangay.barangay}, {barangay.province}:
Temp: {w['temperature']}°C,
Humidity: {w['humidity']}%,
UV index: {w['uv_index']},
Heat index: {w['heat_index']}°C ({w['risk_level']})
"""

    prompt = f"""
You are an AI that gives 1-sentence practical tips for staying safe and healthy in hot weather.
Generate 3 tips for things people SHOULD do, and 3 tips for things people SHOULD NOT do
based on the following weather data and the person's profile. Tailor tips to the user's situation
so they are realistic and actionable for that person. Also, make sure that the tips are 
hyperspecific, concise, and accurate.
Make the responses Tagalog/Filipino language.

{weather_summary}

{"Personalize for: " + user_context if user_context else ""}

Return tips in this format, one per line:
DO: [main_text] | [sub_text]
DONT: [main_text] | [sub_text]
"""

    tips: List[Tip] = []
    try:
        if co is None:
            raise RuntimeError("AI client not configured")

        response = co.chat(
            model="command-r-plus-08-2024",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1000
        )
        ai_output = response.message.content[0].text.strip()

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
                payload = line.split(":", 1)[1].strip() if ":" in line else line[5:].strip()
                if "|" in payload:
                    main, sub = payload.split("|", 1)
                else:
                    main, sub = payload, ""
                tips.append(Tip(is_do=False, main_text=main.strip(), sub_text=sub.strip()))

        if not tips:
            raise ValueError("AI returned no tips")
    except Exception as e:
        logger.exception("Failed to generate AI tips: %s", e)
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

    async with TIPS_CACHE_LOCK:
        TIPS_CACHE[cache_key] = {"tips": tips, "ts": datetime.now(timezone.utc)}
        logger.info("Cached tips for barangay=%s user=%s", barangay_id, user_id)

    elapsed = time.time() - start_time
    logger.info("Tips generation completed for barangay=%s user=%s in %.2fs (tips=%d)",
                barangay_id, user_id, elapsed, len(tips))
    return tips