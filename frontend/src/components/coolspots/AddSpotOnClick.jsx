import { useMapEvents } from "react-leaflet";

function AddSpotOnClick({ addMode, newSpotType, onAddSpot }) {
  useMapEvents({
    click(e) {
      if (addMode) {
        const newSpot = {
          barangay_id: 1,
          name: "Cool Spot",
          type: newSpotType,
          lat: e.latlng.lat,
          lon: e.latlng.lng
        };
        onAddSpot(newSpot);
      }
    }
  });
  return null;
}

export default AddSpotOnClick;