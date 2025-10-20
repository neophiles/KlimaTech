import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import CoolSpotMarker from "../components/coolspots/CoolSpotMarker";
import CoolSpotModal from "../components/coolspots/CoolSpotModal";
import AddSpotOnClick from "../components/coolspots/AddSpotOnClick";
import AddCoolSpotModal from "../components/coolspots/AddCoolSpotModal";
import Button from "../components/Button";
import { userIcon } from "../utils/coolSpotsIcons";

function Map({ currentUser }) {
  useEffect(() => {
    console.log("MapPage currentUser:", currentUser);
  }, [currentUser]);

  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [coolSpots, setCoolSpots] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reportNote, setReportNote] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportPhoto, setReportPhoto] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingSpot, setPendingSpot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [barangays, setBarangays] = useState([]);
  const [mapMode, setMapMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [centerMarker, setCenterMarker] = useState(null);

  // Prevent report submission when not logged in
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
    formData.append("user_id", currentUser?.id ?? 0); // use real user id if available
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

  function UserMarker({ userLocation }) {
    const map = useMap();

    return (
      <Marker
        position={[userLocation.lat, userLocation.lon]}
        icon={userIcon}
        eventHandlers={{
          click: () => {
            const point = map.latLngToContainerPoint([userLocation.lat, userLocation.lon]);
            const offsetLatLng = map.containerPointToLatLng(point);
            map.flyTo(offsetLatLng, map.getZoom(), { animate: true });
          },
        }}
      >
        <Popup className="user-popup" closeButton={false}>
          <strong>You</strong>
        </Popup>
      </Marker>
    );
  }

  function ZoomToUserButton({ userLocation }) {
    const map = useMap();

    const zoomToUser = () => {
      if (!userLocation) {
        alert("User location not ready yet!");
        return;
      }
      map.flyTo([userLocation.lat, userLocation.lon], 18, { 
        animate: true,
        duration: 0.75
      });
    };

    return (
      <Button
        otherClass={"map-btn zoom-to-user"}
        onClick={zoomToUser}
        children={
          <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path 
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd" />
          </svg>
        }
      />
    )
  }


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
          zoomControl={false}
          whenCreated={mapInstance => {
            mapRef.current = mapInstance;
            setMapReady(true);
          }}
        >

          {/* Base map layer (can and should be changed) */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />

          <ZoomControl position="topright" />

          {/* User location marker with custom icon */}
          {!mapMode && userLocation && <UserMarker userLocation={userLocation} />}

          {/* Cool spot markers */}
          {!mapMode && (
            <MarkerClusterGroup
              chunkedLoading={true}
              maxClusterRadius={40} // smaller = more clusters
              showCoverageOnHover={false}
            >
              {coolSpots.map(spot =>
                spot.lat !== undefined && spot.lon !== undefined ? (
                  <CoolSpotMarker
                    key={spot.id}
                    spot={spot}
                    onViewDetails={handleViewDetails}
                    setSelectedSpot={setSelectedSpot}
                    setCoolSpots={setCoolSpots}
                    currentUser={currentUser}
                  />
                ) : null
              )}
            </MarkerClusterGroup>
          )}

          {/* Add spot on click */}
          {!mapMode && (
            <AddSpotOnClick
              addMode={addMode}
              pendingSpot={pendingSpot}
              onAddSpot={handleAddSpot}
            />
          )}

          <CenterMarker isAdding={isAdding} setCenterMarker={setCenterMarker} />
          
          {/* Button to zoom in to user's location */}
          <ZoomToUserButton userLocation={userLocation} />

          {/* Button to enable add mode */}
          <Button
            otherClass={"map-btn add"}
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
            currentUser={currentUser}
           />
        </>
      )}

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

export default Map;
