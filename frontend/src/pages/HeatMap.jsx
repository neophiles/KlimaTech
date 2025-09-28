import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function HeatMap() {
  const barangays = [
    { id: 1, name: "Barangay Gulang-Gulang", lat: 13.9417, lon: 121.6233 },
    { id: 2, name: "Barangay Ibabang Dupay", lat: 13.9341, lon: 121.6175 }
  ];
  
  // Dummy cool spots data
  const dummyCoolSpots = [
    { id: 1, name: "Cool Spot 1", lat: 13.9425, lon: 121.6200 },
    { id: 2, name: "Cool Spot 2", lat: 13.9380, lon: 121.6250 }
  ];

  return (
    <div className="map-container">
      <MapContainer className="map" center={[13.9417, 121.6233]} zoom={13}>
        
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {barangays.map(b => (
          <Marker key={b.id} position={[b.lat, b.lon]}>
            <Popup>
              <strong>{b.name}</strong>
              <br />
              Example popup content
            </Popup>
          </Marker>
        ))}

        // Cool spots
        {dummyCoolSpots.map(spot => (
          <Marker key={spot.id} position={[spot.lat, spot.lon]}>
            <Popup>
              <strong>{spot.name}</strong>
              <br />
              Example cool spot info
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}