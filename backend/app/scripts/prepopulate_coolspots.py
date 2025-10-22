import csv
from pathlib import Path
from sqlmodel import Session
from app.db import engine
from app.models import CoolSpot


def main():
    csv_path = Path(__file__).parent / "data" / "coolspots.csv"

    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        # Normalize headers (strip spaces)
        reader.fieldnames = [name.strip() for name in reader.fieldnames]

        with Session(engine) as session:
            added = 0
            skipped = 0

            for row in reader:
                # Clean up data
                row = {k.strip(): (v.strip() if v else None) for k, v in row.items()}

                if not row.get("lat") or not row.get("long"):
                    skipped += 1
                    continue

                try:
                    coolspot = CoolSpot(
                        barangay_id=int(row.get("barangay_id", 1)),
                        name=row.get("name"),
                        description=row.get("description") or "",
                        type=row.get("type"),
                        lat=float(row["lat"]),
                        lon=float(row["long"]),
                    )
                    session.add(coolspot)
                    added += 1
                except Exception as e:
                    print(f"❌ Error adding '{row.get('name', 'Unknown')}': {e}")
                    skipped += 1

            session.commit()
            print(f"✅ Added {added} CoolSpots successfully.")
            if skipped:
                print(f"⚠️ Skipped {skipped} rows due to missing or invalid data.")


if __name__ == "__main__":
    main()
