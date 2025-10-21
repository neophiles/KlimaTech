import { useMapEvents } from "react-leaflet";


function AddSpotOnClick({ addMode, pendingSpot, onAddSpot }) {
  useMapEvents({
    click(e) {
      if (addMode && pendingSpot) {
        const formData = new FormData();
        formData.append("barangay_id", pendingSpot.barangay_id); 
        formData.append("name", pendingSpot.name);
        formData.append("description", pendingSpot.description); 
        formData.append("type", pendingSpot.type);
        formData.append("lat", e.latlng.lat);
        formData.append("lon", e.latlng.lng);
        if (pendingSpot.photo) formData.append("file", pendingSpot.photo);

        // Debug: Log FormData entries
        for (let pair of formData.entries()) {
          console.log(pair[0]+ ': ' + pair[1]);
        }

        onAddSpot(formData); // Pass FormData to handler
      }
    }
  });
  return null;
}

export default AddSpotOnClick;