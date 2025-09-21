import joblib
import pandas as pd
from sklearn.linear_model import LinearRegression
from sqlmodel import Session, select
from db import engine
from models import HeatLog

MODEL_PATH = "ml/heat_model.pkl"

def train_model():
    with Session(engine) as session:
        logs = session.exec(select(HeatLog)).all()

    if not logs:
        print("No data for training")
        return

    df = pd.DataFrame([{
        "temp": log.temperature_c,
        "humidity": log.humidity,
        "wind": log.wind_speed,
        "precip": log.precipitation,
        "heat_index": log.heat_index_c
    } for log in logs])

    X = df[["temp", "humidity", "wind", "precip"]]
    y = df["heat_index"]

    model = LinearRegression()
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    print("✅ Model trained and saved")
