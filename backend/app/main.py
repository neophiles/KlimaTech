from fastapi import FastAPI
from app.routers import (
    barangays,
    coolspots,
    forecast,
    profile,
    task_suggestions
)
from app.db import init_db, get_session, engine
from app.tasks.collector import collect_heat_data
from app.scripts.add_barangays import main as add_barangays
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

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.on_event("startup")
def on_startup():
    # Initialize DB tables
    init_db()

    # Prepopulate barangays table if empty
    with Session(engine) as session:
        result = session.exec(select(Barangay)).first()
        if not result:
            print("Barangays table is empty. Populating now...")
            add_barangays()
            print("Barangays added!")

    # Schedule job: run every 60 minutes
    scheduler.add_job(collect_heat_data, "interval", minutes=60)
    scheduler.start()
    print("APScheduler started. Collecting heat data every hour.")


@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()


@app.get("/")
def root():
    return {"message": "Heat Risk API is running"}
