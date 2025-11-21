import json
from pathlib import Path
from sqlmodel import Session
from app.db import engine
from app.models import CoolSpot


def main():
    # Path to the JSON file from frontend
    json_path = Path(__file__).parent.parent.parent.parent / "frontend" / "src" / "components" / "map" / "data" / "preskospots.json"

    if not json_path.exists():
        print(f"JSON file not found at {json_path}")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        spots_data = json.load(f)

    with Session(engine) as session:
        added = 0
        skipped = 0

        for row in spots_data:
            # Validate required fields
            if not row.get("lat") or not row.get("lon"):
                skipped += 1
                print(f"Skipping '{row.get('name', 'Unknown')}': Missing lat/lon")
                continue

            try:
                coolspot = CoolSpot(
                    barangay_id=int(row.get("barangay_id", 1)),
                    name=row.get("name", ""),
                    address=row.get("address"),
                    description=row.get("description", ""),
                    type=row.get("type", ""),
                    lat=float(row["lat"]),
                    lon=float(row["lon"]),
                    photo_url=row.get("photo_url"),
                )
                session.add(coolspot)
                added += 1
                print(f"✓ Added: {row.get('name')}")
            except Exception as e:
                print(f"Error adding '{row.get('name', 'Unknown')}': {e}")
                skipped += 1

        session.commit()
        print(f"\nAdded {added} CoolSpots successfully.")
        if skipped:
            print(f"Skipped {skipped} rows due to missing or invalid data.")


if __name__ == "__main__":
    main()
