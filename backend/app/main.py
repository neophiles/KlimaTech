from fastapi import FastAPI
from app.routers import barangays

app = FastAPI(title="Heat Risk API", version="0.1.0")


app.include_router(barangays.router)


@app.get("/")
def root():
    return {"message": "Heat Risk API is running"}
