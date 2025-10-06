import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import CoolSpotMarker from "../components/coolspots/CoolSpotMarker";
import CoolSpotModal from "../components/coolspots/CoolSpotModal";
import AddSpotOnClick from "../components/coolspots/AddSpotOnClick";
import Button from "../components/Button";

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVmzdV37TbN_MEIMn1zZKeDQoCKByIVbWrnw&s",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function HeatMap() {
  // Static barangay data for demo purposes
  const barangays = [
    { id: 1, name: "Barangay Gulang-Gulang", lat: 13.9417, lon: 121.6233 },
    { id: 2, name: "Barangay Ibabang Dupay", lat: 13.9341, lon: 121.6175 }
  ];

  // State for cool spots and add mode
  const [coolSpots, setCoolSpots] = useState([]);
  const [addMode, setAddMode] = useState(false);

  // State for selected spot details modal
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // State for reporting issues
  const [reportNote, setReportNote] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // State for new cool spot type selection
  const [newSpotType, setNewSpotType] = useState("Shaded Area");

  // Fetch cool spots from backend on mount
  useEffect(() => {
    fetch("/api/coolspots/all")
      .then(res => res.json())
      .then(data => setCoolSpots(data))
      .catch(err => console.error("Failed to fetch cool spots:", err));
  }, []);

  // Handler to add a new cool spot (called from AddSpotOnClick)
  function handleAddSpot(newSpot) {
    fetch("/api/coolspots/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSpot)
    })
      .then(res => res.json())
      .then(spot => setCoolSpots(prev => [...prev, spot]))
      .catch(err => alert("Failed to add cool spot"));
    setAddMode(false);
  }

  // Handler to view details of a cool spot
  function handleViewDetails(id) {
    fetch(`/api/coolspots/${id}`)
      .then(res => res.json())
      .then(data => {
        setSelectedSpot(data);
        setShowModal(true);
      })
      .catch(err => alert("Failed to fetch details"));
  }

  // State for user location
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location on mount
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
    
    <div className="map-page">
      
      {/* Centered map container */}
      <div className="map-container">
        <MapContainer
          className="map"
          center={[13.41, 122.56]}
          zoom={6}
          minZoom={5.4}
          maxBounds={[[4, 116], [21, 127]]}
        >
          {/* User location marker with custom icon */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
              <Popup>
                <strong>Your Location</strong>
              </Popup>
            </Marker>
          )}

          {/* Handles adding cool spot on map click */}
          <AddSpotOnClick
            addMode={addMode}
            newSpotType={newSpotType}
            onAddSpot={handleAddSpot}
          />

          {/* Map tiles */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


          {/* Cool spot markers from backend */}
          {coolSpots.map(spot => (
            <CoolSpotMarker key={spot.id} spot={spot} onViewDetails={handleViewDetails} />
          ))}

        </MapContainer>
      </div>

      {/* Modal for selected cool spot details */}  
      {showModal && selectedSpot && (
        <CoolSpotModal
          spot={selectedSpot}
          reportNote={reportNote}
          setReportNote={setReportNote}
          reportSubmitting={reportSubmitting}
          onSubmitReport={e => {
            e.preventDefault();
            setReportSubmitting(true);
            fetch(`/api/coolspots/${selectedSpot.id}/report`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: 0, // Replace with actual user id if available
                note: reportNote
              })
            })
              .then(res => res.json())
              .then(() => fetch(`/api/coolspots/${selectedSpot.id}`))
              .then(res => res.json())
              .then(data => {
                setSelectedSpot(data);
                setReportNote("");
              })
              .catch(() => alert("Failed to add report"))
              .finally(() => setReportSubmitting(false));
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Button to enable add mode */}
      <Button children={addMode ? "Click on the map to add a cool spot..." : "Add Cool Spot"} onClick={setAddMode} />
    </div>
  );
}

export default HeatMap;