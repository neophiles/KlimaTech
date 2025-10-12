import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import CoolSpotMarker from "../components/coolspots/CoolSpotMarker";
import CoolSpotModal from "../components/coolspots/CoolSpotModal";
import AddSpotOnClick from "../components/coolspots/AddSpotOnClick";
import AddCoolSpotModal from "../components/coolspots/AddCoolSpotModal";
import Button from "../components/Button";

// HeatLayer component to add heatmap layer to the map
function HeatLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !points.length) return;
    const heatLayer = window.L.heatLayer(points, { radius: 25 }).addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);
  return null;
}

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
  const [coolSpots, setCoolSpots] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reportNote, setReportNote] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [newSpotType, setNewSpotType] = useState("Shaded Area");
  const [reportPhoto, setReportPhoto] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingSpot, setPendingSpot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [barangays, setBarangays] = useState([]);
  const [heatmapMode, setHeatmapMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [centerMarker, setCenterMarker] = useState(null);


  // Prepare heatmap points from cool spots
  const heatPoints = coolSpots
    .filter(spot =>
      spot.lat !== undefined &&
      spot.lon !== undefined &&
      spot.heat_index != null
    )
    .map(spot => [spot.lat, spot.lon, spot.heat_index]); // heat_index: 0-1

  // Fetch cool spots from backend on mount
  useEffect(() => {
    async function fetchCoolSpots() {
      try {
        const res = await fetch("/api/coolspots/all");
        const data = await res.json();
        setCoolSpots(data);
      } catch (err) {
        console.error("Failed to fetch cool spots:", err);
      }
    }
    fetchCoolSpots();
  }, []);

  // Fetch barangays when userLocation is available
  useEffect(() => {
    if (!userLocation) return;
    const { lat, lon } = userLocation;
    fetch(`/api/barangays/all?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => setBarangays(data))
      .catch(err => console.error("Failed to fetch barangays:", err));
  }, [userLocation]);

  // Get user's current location on mount, fallback to center if denied
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
          // Fallback to center
          setUserLocation({ lat: 13.41, lon: 122.56 });
        }
      );
    } else {
      setUserLocation({ lat: 13.41, lon: 122.56 });
    }
  }, []);

  // Handler to add a new cool spot (called from AddSpotOnClick)
  function handleAddSpot(formData) {
    fetch("/api/coolspots/add", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(spot => setCoolSpots(prev => [...prev, spot]))
      .catch(err => alert("Failed to add cool spot"));
    setAddMode(false);
    setPendingSpot(null);
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

  // Submit report handler
  function onSubmitReport(e) {
    e.preventDefault();
    setReportSubmitting(true);
    const formData = new FormData();
    formData.append("user_id", 0); // Replace with actual user id if available
    formData.append("note", reportNote);
    if (reportPhoto) formData.append("file", reportPhoto);

    fetch(`/api/coolspots/${selectedSpot.id}/report`, {
      method: "POST",
      body: formData
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then(() => fetch(`/api/coolspots/${selectedSpot.id}`))
      .then(res => res.json())
      .then(data => {
        setSelectedSpot(data);
        setReportNote("");
        setReportPhoto(null);
        setCoolSpots(prev =>
          prev.map(spot =>
            spot.id === data.id ? data : spot
          )
        );
      })
      .catch(err => {
        alert("Failed to add report: " + err.message);
      })
      .finally(() => setReportSubmitting(false));
  }

  // Component to show a marker at the center when adding a new spot  
  function CenterMarker({ isAdding, setCenterMarker }) {
    const map = useMapEvents({
      move() {
        if (isAdding) {
          const center = map.getCenter();
          setCenterMarker([center.lat, center.lng]);
        }
      },
    });

    return isAdding && centerMarker ? (
      <Marker position={centerMarker} />
    ) : null;
  }


  return (
    <div className="map-page">
      {/* Toggle button for heatmap mode */}
      {/* <button onClick={() => setHeatmapMode(m => !m)}>
        {heatmapMode ? "Show Markers" : "Show Heatmap"}
      </button> */}

      {/* Centered map container */}
      <div className="map-container">
        <MapContainer
          className="map"
          center={[13.41, 122.56]}
          zoom={6}
          minZoom={5.4}
          maxBounds={[[4, 116], [21, 127]]}
        >

        {/* Base map layer (can and should be changed) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />


          {/* Show heat index overlay when toggled */}
          {heatmapMode && (
            <TileLayer
              url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=b6dc76044f7d0c20d49fb8dcc00c03d7"
              attribution='Weather data © OpenWeatherMap'
              opacity={0.5}
            />
          )}

          {/* User location marker with custom icon */}
          {!heatmapMode && userLocation && (
            <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
              <Popup>
                <strong>Your Location</strong>
              </Popup>
            </Marker>
          )}

          {/* Cool spot markers */}
          {!heatmapMode && coolSpots.map(spot =>
            spot.lat !== undefined && spot.lon !== undefined ? (
              <CoolSpotMarker
                key={spot.id}
                spot={spot}
                onViewDetails={handleViewDetails}
                setSelectedSpot={setSelectedSpot}
                setCoolSpots={setCoolSpots}
              />
            ) : null
          )}

          {/* Add spot on click */}
          {!heatmapMode && (
            <AddSpotOnClick
              addMode={addMode}
              pendingSpot={pendingSpot}
              onAddSpot={handleAddSpot}
            />
          )}

          <CenterMarker isAdding={isAdding} setCenterMarker={setCenterMarker} />

        </MapContainer>
      </div>

      {/*  Confirmation overlay when adding */}
      {isAdding && (
        <div
          style={{
            position: "absolute",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: "white",
            padding: "10px 16px",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        >
          <button
            onClick={() => {
              if (!pendingSpot || !centerMarker) {
                alert("Please wait until the map is ready.");
                return;
              }

              const formData = new FormData();
              formData.append("barangay_id", pendingSpot.barangay_id);
              formData.append("name", pendingSpot.name);
              formData.append("description", pendingSpot.description);
              formData.append("type", pendingSpot.type);
              formData.append("lat", centerMarker[0]);
              formData.append("lon", centerMarker[1]);
              if (pendingSpot.photo) formData.append("file", pendingSpot.photo);

              handleAddSpot(formData);
              setIsAdding(false);
              setCenterMarker(null);
            }}
          >
            Confirm Location
          </button>
        </div>
      )}


      {/* Modal for selected cool spot details */}
      {showModal && selectedSpot && (
        <>
          <div className="modal-overlay" />
          <CoolSpotModal
           key={selectedSpot.id + '-' + selectedSpot.likes + '-' + selectedSpot.dislikes}
            spot={selectedSpot}
            setSelectedSpot={setSelectedSpot}
            reportNote={reportNote}
            setReportNote={setReportNote}
            reportPhoto={reportPhoto}
            setReportPhoto={setReportPhoto}
            reportSubmitting={reportSubmitting}
            setReportSubmitting={setReportSubmitting}
            onSubmitReport={onSubmitReport}
            onClose={() => setShowModal(false)}  
            setCoolSpots={setCoolSpots} 
          />
        </>
      )}

      {/* Button to enable add mode */}
      <Button
        otherClass={"add"}
        onClick={() => setShowAddModal(true)}
        children={
          <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        }
      />



      {/* Modal for adding new cool spot */}
      {showAddModal && (
        <>
          <div className="modal-overlay" />
          <AddCoolSpotModal
            show={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={spotInfo => {
              // Save form data from modal
              setPendingSpot(spotInfo);

              // Hide modal, start pinning mode
              setShowAddModal(false);
              setIsAdding(true);
            }}
            barangays={barangays}
          />
        </>
      )}
    </div>
  );
}

export default HeatMap;
