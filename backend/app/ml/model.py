import joblib
import pandas as pd
from sklearn.linear_model import LinearRegression
from sqlmodel import Session, select
from app.db import engine
from app.models import HeatLog
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "hourly_temp_model.pkl")

def train_model():
    with Session(engine) as session:
        logs = session.exec(select(HeatLog)).all()

    if not logs:
        print("No data for training")
        return

    df = pd.DataFrame([{
        "hour": log.recorded_at.hour,
        "humidity": log.humidity,
        "wind": log.wind_speed,
        "uv_index": log.uv_index,
        "temperature": log.temperature_c
    } for log in logs])

    # Only keep hours between 8 and 18
    df = df[(df["hour"] >= 8) & (df["hour"] <= 18)]

    X = df[["hour", "humidity", "wind", "uv_index"]]
    y = df["temperature"]

    model = LinearRegression()
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    print("Hourly temperature model trained and saved")

if __name__ == "__main__":
    train_model()