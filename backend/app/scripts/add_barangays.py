from app.models import Barangay
from app.db import get_session
from sqlalchemy import text

barangays_data = [
    {
        "id": 1,
        "barangay": "Ibabang Dupay",
        "locality": "Lucena",
        "province": "Quezon",
        "lat": 13.9405,
        "lon": 121.617
    },
    {
        "id": 2,
        "barangay": "Ikirin",
        "locality": "Pagbilao",
        "province": "Quezon",
        "lat": 13.9968,
        "lon": 121.7309
    },
]

def main():
    session = next(get_session())
    session.exec(text("DELETE FROM barangay"))
    for b in barangays_data:
        barangay = Barangay(
            id=b["id"],
            barangay=b["barangay"],
            locality=b["locality"],
            province=b["province"],
            lat=b["lat"],
            lon=b["lon"]
        )
        session.add(barangay)
    session.commit()
    print("Barangays added!")

if __name__ == "__main__":
    main()