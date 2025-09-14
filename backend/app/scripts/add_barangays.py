from app.models import Barangay
from app.db import get_session
from sqlalchemy import text

barangays_data = [
    {"id": 1, "name": "Barangay Dalahican, Lucena", "lat": 13.9317, "lon": 121.6233},
    {"id": 2, "name": "Barangay Ibabang Dupay, Lucena", "lat": 13.9405, "lon": 121.6170},
]

def main():
    # get_session is a generator, so use next() to get the session
    session = next(get_session())
    session.exec(text("DELETE FROM barangay"))
    for b in barangays_data:
        barangay = Barangay(id=b["id"], name=b["name"], lat=b["lat"], lon=b["lon"])
        session.add(barangay)
    session.commit()
    print("Barangays added!")

if __name__ == "__main__":
    main()