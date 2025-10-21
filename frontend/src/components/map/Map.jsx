import { useState, useRef, useMemo, useCallback } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "./Map.css";

import PreskoSpotMarker from "./markers/PreskoSpotMarker";
import PreskoSpotModal from "./modals/PreskoSpotModal";
import AddPreskoSpotModal from "./modals/AddPreskoSpotModal";
import AddSpotOnClick from "./controls/AddSpotOnClick";
import Button from "../Button";

import usePreskoSpots from "./hooks/usePreskoSpots";
import useUserLocation from "./hooks/useUserLocation";
import UserMarker from "./markers/UserMarker";
import CenterMarker from "./markers/CenterMarker";
import ZoomToUserButton from "./controls/ZoomToUserButton";
import ConfirmLocationPanel from "./controls/ConfirmLocationPanel";

function Map({ currentUser }) {
  const mapRef = useRef(null);
  const { coolSpots, setCoolSpots, loading: spotsLoading, refresh, getSpotById, addSpot, submitReport } = usePreskoSpots();
  const { userLocation } = useUserLocation();

  // UI local state
  const [isAdding, setIsAdding] = useState(false);
  const [centerMarker, setCenterMarker] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingSpot, setPendingSpot] = useState(null);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reportNote, setReportNote] = useState("");
  const [reportPhoto, setReportPhoto] = useState(null);
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // stable callbacks
  const onViewDetails = useCallback(async (id) => {
    try {
      const data = await getSpotById(id);
      setSelectedSpot(data);
      setShowModal(true);
    } catch (err) {
      alert("Failed to fetch details");
    }
  }, [getSpotById]);

  const handleCenterChange = useCallback((coords) => setCenterMarker(coords), []);

  const handleAddSpotFromModal = useCallback((spotInfo) => {
    setPendingSpot(spotInfo);
    setShowAddModal(false);
    setIsAdding(true);
  }, []);

  const confirmLocation = useCallback(async (coords) => {
    if (!pendingSpot) return;
    const formData = new FormData();
    formData.append("barangay_id", pendingSpot.barangay_id);
    formData.append("name", pendingSpot.name);
    formData.append("description", pendingSpot.description || "");
    formData.append("type", pendingSpot.type);
    formData.append("lat", coords[0]);
    formData.append("lon", coords[1]);
    if (pendingSpot.photo) formData.append("file", pendingSpot.photo);

    try {
      const newSpot = await addSpot(formData);
      // keep local state consistent
      setPendingSpot(null);
      setIsAdding(false);
      setCenterMarker(null);
    } catch (err) {
      alert("Failed to add cool spot: " + (err.message || err));
    }
  }, [addSpot, pendingSpot]);

  const onSubmitReport = useCallback(async (e) => {
    e.preventDefault();
    if (!currentUser?.id) { alert("Please login to submit a report."); return; }
    if (!selectedSpot) return;
    setReportSubmitting(true);
    const fd = new FormData();
    fd.append("user_id", currentUser.id);
    fd.append("note", reportNote || "");
    if (reportPhoto) fd.append("file", reportPhoto);
    try {
      await submitReport(selectedSpot.id, fd);
      const updated = await getSpotById(selectedSpot.id);
      setSelectedSpot(updated);
      setReportNote("");
      setReportPhoto(null);
    } catch (err) {
      alert("Failed to add report: " + (err.message || err));
    } finally {
      setReportSubmitting(false);
    }
  }, [currentUser, selectedSpot, reportNote, reportPhoto, submitReport, getSpotById]);

  const markers = useMemo(() => {
    return coolSpots.map(spot => spot.lat !== undefined && spot.lon !== undefined ? (
      <PreskoSpotMarker
        key={spot.id}
        spot={spot}
        onViewDetails={onViewDetails}
        setSelectedSpot={setSelectedSpot}
        setCoolSpots={setCoolSpots}
        currentUser={currentUser}
      />
    ) : null);
  }, [coolSpots, onViewDetails, setCoolSpots, currentUser]);

  return (
    <div className="map-page">
      <div className="map-container">
        <MapContainer
          className="map"
          center={[13.41, 122.56]}
          zoom={6}
          minZoom={5.4}
          maxBounds={[[4, 116], [21, 127]]}
          zoomControl={false}
          whenCreated={mapInstance => { mapRef.current = mapInstance; }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
          <ZoomControl position="topright" />
          {userLocation && <UserMarker userLocation={userLocation} />}
          <MarkerClusterGroup chunkedLoading={true} maxClusterRadius={40} showCoverageOnHover={false}>
            {markers}
          </MarkerClusterGroup>

          <AddSpotOnClick addMode={false} pendingSpot={pendingSpot} onAddSpot={() => {}} />
          <CenterMarker isAdding={isAdding} onCenterChange={handleCenterChange} />
          <ZoomToUserButton userLocation={userLocation} />

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

      {isAdding && (
        <ConfirmLocationPanel
          pendingSpot={pendingSpot}
          centerCoords={centerMarker}
          onConfirm={confirmLocation}
          onCancel={() => { setIsAdding(false); setPendingSpot(null); setCenterMarker(null); }}
        />
      )}

      {showModal && selectedSpot && (
        <>
          <div className="modal-overlay" />
          <PreskoSpotModal
            key={`${selectedSpot.id}-${selectedSpot.likes}-${selectedSpot.dislikes}`}
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

      {showAddModal && (
        <>
          <div className="modal-overlay" />
          <AddPreskoSpotModal
            show={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddSpotFromModal}
            barangays={[]}
            currentUser={currentUser}
          />
        </>
      )}
    </div>
  );
}

export default Map;