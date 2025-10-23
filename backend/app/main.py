from fastapi import FastAPI
from app.routers import (
    barangays,
    coolspots,
    forecast,
    profile,
    task_suggestions
)
from app.db import init_db, engine
from app.tasks.collector import collect_heat_data
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from app.models import Barangay

app = FastAPI()
scheduler = BackgroundScheduler()

# Allow frontend origins
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://presko-frontend.onrender.com",
    "https://presko.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(barangays.router)
app.include_router(forecast.router)
app.include_router(coolspots.router)
app.include_router(profile.router)
app.include_router(task_suggestions.router)

app.mount("/static", StaticFiles(directory="static" ), name="static")

# Barangays data to prepopulate DB
barangays_data = [
    {
        "id": 1,
        "barangay": "Ibabang Dupay",
        "locality": "Lucena",
        "province": "Quezon",
        "lat": 13.9405,
        "lon": 121.617
    },
    {
        "id": 2,
        "barangay": "Ikirin",
        "locality": "Pagbilao",
        "province": "Quezon",
        "lat": 13.9968,
        "lon": 121.7309
    },
]


@app.on_event("startup")
def on_startup():
    init_db()

    # --- Barangays prepopulation (existing code) ---
    with Session(engine) as session:
        result = session.exec(select(Barangay)).first()
        if not result:
            print("Barangays table is empty. Populating now...")
            for b in barangays_data:
                barangay = Barangay(**b)
                session.add(barangay)
            session.commit()
            print("Barangays added!")


    # Scheduler (existing)
    scheduler.add_job(collect_heat_data, "interval", minutes=60)
    scheduler.start()
    print("APScheduler started. Collecting heat data every hour.")


@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()

@app.get("/")
def root():
    return {"message": "Heat Risk API is running"}
