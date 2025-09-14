from fastapi import FastAPI
from app.routers import barangays


app = FastAPI()


app.include_router(barangays.router)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {"message": "Heat Risk API is running"}
