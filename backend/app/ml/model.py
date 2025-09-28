import joblib
import pandas as pd
from sklearn.linear_model import LinearRegression
from sqlmodel import Session, select
from app.db import engine
from app.models import HeatLog
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "hourly_temp_model.pkl")


def predict_hourly_heat_index(hours, temperature, humidity, wind, uv_index):
    model = joblib.load(MODEL_PATH)
    # Broadcast values if needed
    if not isinstance(temperature, list):
        temperature = [temperature] * len(hours)
    if not isinstance(humidity, list):
        humidity = [humidity] * len(hours)
    if not isinstance(wind, list):
        wind = [wind] * len(hours)
    if not isinstance(uv_index, list):
        uv_index = [uv_index] * len(hours)
    X = pd.DataFrame([{
        "hour": h,
        "temperature": t,
        "humidity": hum,
        "wind": w,
        "uv_index": uv
    } for h, t, hum, w, uv in zip(hours, temperature, humidity, wind, uv_index)])
    heat_indices = model.predict(X)
    return [float(h) for h in heat_indices]


def train_model():
    with Session(engine) as session:
        logs = session.exec(select(HeatLog)).all()

    if not logs:
        print("No data for training")
        return

    df = pd.DataFrame([{
        "hour": log.recorded_at.hour,
        "temperature": log.temperature_c,
        "humidity": log.humidity,
        "wind": log.wind_speed,
        "uv_index": log.uv_index,
        "heat_index": log.heat_index_c
    } for log in logs])

    df = df[(df["hour"] >= 8) & (df["hour"] <= 18)]

    X = df[["hour", "temperature", "humidity", "wind", "uv_index"]]
    y = df["heat_index"]

    model = LinearRegression()
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    print("Hourly heat index model trained and saved")


if __name__ == "__main__":
    train_model()