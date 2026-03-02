import os
from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load database credentials from .env.local
load_dotenv(dotenv_path='.env.local')

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

# Construct Database URL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# SQLAlchemy Setup
Base = declarative_base()
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Define Models (Mirroring the SQL Schema)
class User(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True)
    username = Column(String)
    role = Column(String)

class Mission(Base):
    __tablename__ = 'mission'
    mission_id = Column(Integer, primary_key=True)
    name = Column(String)
    status = Column(String)
    commander = Column(String)

class Astronaut(Base):
    __tablename__ = 'astronaut'
    astronaut_id = Column(Integer, primary_key=True)
    name = Column(String)
    rank = Column(String)
    availability = Column(String)

def generate_report():
    print("=" * 50)
    print("SPACE MISSION SYSTEM - EXECUTIVE ANALYTICS (SQLAlchemy)")
    print("=" * 50)

    # 1. Mission Status Overview (Aggregation)
    print("\n[1] Mission Status Distribution:")
    status_counts = session.query(Mission.status, func.count(Mission.mission_id)).group_by(Mission.status).all()
    for status, count in status_counts:
        print(f" - {status}: {count}")

    # 2. Key Personnel (Queries)
    print("\n[2] Top Commanders:")
    commanders = session.query(Mission.commander, func.count(Mission.mission_id)).group_by(Mission.commander).order_by(func.count(Mission.mission_id).desc()).limit(3).all()
    for cmd, count in commanders:
        if cmd:
            print(f" - {cmd}: {count} Missions")

    # 3. Personnel Availability
    print("\n[3] Personnel Readiness:")
    avail_counts = session.query(Astronaut.availability, func.count(Astronaut.astronaut_id)).group_by(Astronaut.availability).all()
    for status, count in avail_counts:
        print(f" - {status}: {count} Personnel")

    print("\n" + "=" * 50)
    print("Report Generated Successfully.")
    print("=" * 50)

if __name__ == "__main__":
    try:
        generate_report()
    except Exception as e:
        print(f"Error connecting to database: {e}")
    finally:
        session.close()
