import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function HeatMap() {
  const barangays = [
    { id: 1, name: "Barangay Gulang-Gulang", lat: 13.9417, lon: 121.6233 },
    { id: 2, name: "Barangay Ibabang Dupay", lat: 13.9341, lon: 121.6175 }
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        width: "100vw"
      }}
    >
      <MapContainer
        center={[13.9417, 121.6233]}
        zoom={13}
        style={{
          height: "500px",
          width: "90vw",
          maxWidth: "400px",
          borderRadius: "0px",
        }}
      >
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