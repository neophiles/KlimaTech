from fastapi import FastAPI
from app.routers import (
    barangays,
    coolspots,
    forecast,
    profile,
    task_suggestions
)
from app.db import init_db
from app.tasks.collector import collect_heat_data
from apscheduler.schedulers.background import BackgroundScheduler
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles



app = FastAPI()
scheduler = BackgroundScheduler()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
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
    init_db()
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
