import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";


// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVmzdV37TbN_MEIMn1zZKeDQoCKByIVbWrnw&s",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});


export default function HeatMap() {
  const barangays = [
    { id: 1, name: "Barangay Gulang-Gulang", lat: 13.9417, lon: 121.6233 },
    { id: 2, name: "Barangay Ibabang Dupay", lat: 13.9341, lon: 121.6175 }
  ];

  const dummyCoolSpots = [
    { id: 1, name: "Cool Spot 1", lat: 13.9425, lon: 121.6200 },
    { id: 2, name: "Cool Spot 2", lat: 13.9380, lon: 121.6250 }
  ];
  const [coolSpots, setCoolSpots] = useState(dummyCoolSpots);
  const [addMode, setAddMode] = useState(false);

  function AddSpotOnClick() {
    useMapEvents({
      click(e) {
        if (addMode) {
          const newSpot = {
            id: coolSpots.length + 1,
            name: `Cool Spot ${coolSpots.length + 1}`,
            lat: e.latlng.lat,
            lon: e.latlng.lng
          };
          setCoolSpots([...coolSpots, newSpot]);
          setAddMode(false);
        }
      }
    });
    return null;
  }


  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Geolocation error:", error);
        }
      );
    }
  }, []);


  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8f8f8"
      }}
    >

      {/* Button to enable add mode */}
      <button
        onClick={() => setAddMode(true)}
        style={{
          margin: "10px",
          padding: "8px 16px",
          background: addMode ? "#4caf50" : "#2196f3",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        {addMode ? "Click on the map to add a cool spot..." : "Add Cool Spot"}
      </button>

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw"
      }}>
        <MapContainer
          center={[13.9417, 121.6233]}
          zoom={13}
          style={{
            height: "500px",
            width: "90vw",
            maxWidth: "400px",
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
        >
          {/* User location marker with custom icon */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
              <Popup>
                <strong>📍 Your Location</strong>
              </Popup>
            </Marker>
          )}
          
          <AddSpotOnClick />
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

          {coolSpots.map(spot => (
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
    </div>
  );
}