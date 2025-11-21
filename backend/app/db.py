import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

# "dev" for development, "prod" for production
ENV = os.getenv("ENVIRONMENT", "prod")

if ENV == "dev":
    # SQLite for development
    DATABASE_URL = "sqlite:///./heat_project.db"
else:
    # PostgreSQL for production - use the complete DATABASE_URL from Render
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    if not DATABASE_URL:
        raise ValueError("DATABASE_URL environment variable is not set!")
    
    # Fix malformed URLs
    if ":None" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace(":None/", ":5432/")

print(f"Using DATABASE_URL: {DATABASE_URL[:60]}...")

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session