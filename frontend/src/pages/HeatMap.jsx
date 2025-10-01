import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVmzdV37TbN_MEIMn1zZKeDQoCKByIVbWrnw&s",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export function HeatMap() {
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

  // Fetch cool spots from backend on mount
  useEffect(() => {
    fetch("/api/coolspots/all")
      .then(res => res.json())
      .then(data => setCoolSpots(data))
      .catch(err => console.error("Failed to fetch cool spots:", err));
  }, []);

  // Component to handle adding a cool spot on map click
  function AddSpotOnClick() {
    useMapEvents({
      click(e) {
        if (addMode) {
          // Prepare new cool spot data
          const newSpot = {
            barangay_id: 1, // You may want to select this dynamically
            name: `Cool Spot`,
            type: "Shaded Area",
            lat: e.latlng.lat,
            lon: e.latlng.lng
          };
          // POST new cool spot to backend
          fetch("/api/coolspots/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSpot)
          })
            .then(res => res.json())
            .then(spot => setCoolSpots(prev => [...prev, spot]))
            .catch(err => alert("Failed to add cool spot"));
          setAddMode(false); // Exit add mode after adding
        }
      }
    });
    return null;
  }

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
                <strong>📍 Your Location</strong>
              </Popup>
            </Marker>
          )}

          {/* Handles adding cool spot on map click */}
          <AddSpotOnClick />

          {/* Map tiles */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />


          {/* Cool spot markers from backend */}
          {coolSpots.map(spot => (
            <Marker key={spot.id} position={[spot.lat, spot.lon]}>
              <Popup>
                <strong>{spot.name}</strong>
                <br />
                Type: {spot.type}
                <br />
                {/* Show reports if available */}
                {spot.reports && spot.reports.length > 0 && (
                  <div>
                    <hr />
                    <strong>Reports:</strong>
                    <ul>
                      {spot.reports.map((r, idx) => (
                        <li key={idx}>
                          {r.note} <br />
                          <small>{r.date} {r.time}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              <button onClick={() => handleViewDetails(spot.id)}>
                View Details
              </button>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Modal for selected cool spot details */}  
      {showModal && selectedSpot && (
      <div className="modal">
        <h2>{selectedSpot.name}</h2>
        <p>Type: {selectedSpot.type}</p>
        <p>Barangay ID: {selectedSpot.barangay_id}</p>
        <p>Latitude: {selectedSpot.lat}</p>
        <p>Longitude: {selectedSpot.lon}</p>
        <h3>Reports:</h3>
        <ul>
          {selectedSpot.reports.map((r, idx) => (
            <li key={idx}>
              {r.note} <br />
              <small>{r.date} {r.time}</small>
            </li>
          ))}
        </ul>
        {/* Form to add a new report */}
        <form
          onSubmit={e => {
            e.preventDefault();
            setReportSubmitting(true);
            fetch(`/api/coolspots/${selectedSpot.id}/report`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: 0, // Replace with actual user id if available
                note: reportNote
                // date and time can be omitted to use backend defaults
              })
            })
              .then(res => res.json())
              .then(() => {
                // Refresh details after adding report
                return fetch(`/api/coolspots/${selectedSpot.id}`);
              })
              .then(res => res.json())
              .then(data => {
                setSelectedSpot(data);
                setReportNote("");
              })
              .catch(() => alert("Failed to add report"))
              .finally(() => setReportSubmitting(false));
          }}
        >
          <input
            type="text"
            value={reportNote}
            onChange={e => setReportNote(e.target.value)}
            placeholder="Add a report..."
            required
            style={{ width: "80%" }}
          />
          <button type="submit" disabled={reportSubmitting}>
            {reportSubmitting ? "Submitting..." : "Add Report"}
          </button>
        </form>
        <button onClick={() => setShowModal(false)}>Close</button>
      </div>
    )}

      {/* Button to enable add mode */}
      <button
        onClick={() => setAddMode(true)}
        style={{
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
    </div>
  );
}