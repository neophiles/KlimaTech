import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function HeatMap() {
  const barangays = [
    { id: 1, name: "Barangay Gulang-Gulang", lat: 13.9417, lon: 121.6233 },
    { id: 2, name: "Barangay Ibabang Dupay", lat: 13.9341, lon: 121.6175 }
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
      </MapContainer>
    </div>
  );
}