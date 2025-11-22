import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

# "dev" for development, "prod" for production
ENV = os.getenv("ENV", "prod") 

if ENV == "dev":
    # SQLite for development
    DATABASE_URL = "sqlite:///./heat_project.db"
    engine = create_engine(DATABASE_URL, echo=True)
else:
    # # PostgreSQL for production
    # DB_USER = os.getenv("DB_USER")
    # DB_PASSWORD = os.getenv("DB_PASSWORD")
    # DB_HOST = os.getenv("DB_HOST")
    # DB_PORT = os.getenv("DB_PORT")
    # DB_NAME = os.getenv("DB_NAME")
    # DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


    # PostgreSQL for production - use the complete DATABASE_URL from Render
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set!")
    
    # Fix malformed URLs
    if ":None" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace(":None/", ":5432/")
        
    engine = create_engine(DATABASE_URL, echo=True)


def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

