import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

# Choose environment: "dev" for development, "prod" for production
ENV = os.getenv("ENV", "dev")  # Set ENV=prod in your .env for production

if ENV == "dev":
    # SQLite for development
    DATABASE_URL = "sqlite:///./heat_project.db"
    engine = create_engine(DATABASE_URL, echo=True)
else:
    # PostgreSQL for production
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = os.getenv("DB_PORT")
    DB_NAME = os.getenv("DB_NAME")
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session