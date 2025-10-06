import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { userIcon } from "../utils/coolSpotsIcons";
import { useCoolSpots } from "../hooks/useCoolSpots";
import { useUserLocation } from "../hooks/useUserLocation";
import CoolSpotMarker from "../components/coolspots/CoolSpotMarker";
import CoolSpotModal from "../components/coolspots/CoolSpotModal";
import AddSpotOnClick from "../components/coolspots/AddSpotOnClick";
import Button from "../components/Button";
import { useState } from "react";

function HeatMap() {
  const [addMode, setAddMode] = useState(false);
  const [newSpotType, setNewSpotType] = useState("Shaded Area");

  const userLocation = useUserLocation();
  const {
    coolSpots,
    selectedSpot,
    showModal,
    reportNote,
    reportSubmitting,
    setReportNote,
    setShowModal,
    handleAddSpot,
    handleViewDetails,
    handleSubmitReport,
  } = useCoolSpots();

  return (
    <div className="map-page">
      <div className="map-container">
        <MapContainer
          className="map"
          center={[13.41, 122.56]}
          zoom={6}
          minZoom={5.4}
          maxBounds={[[4, 116], [21, 127]]}
        >
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
              <Popup>
                <strong>Your Location</strong>
              </Popup>
            </Marker>
          )}

          <AddSpotOnClick
            addMode={addMode}
            newSpotType={newSpotType}
            onAddSpot={handleAddSpot}
          />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {coolSpots.map((spot) => (
            <CoolSpotMarker
              key={spot.id}
              spot={spot}
              onViewDetails={handleViewDetails}
            />
          ))}
        </MapContainer>
      </div>

      {showModal && selectedSpot && (
        <CoolSpotModal
          spot={selectedSpot}
          reportNote={reportNote}
          setReportNote={setReportNote}
          reportSubmitting={reportSubmitting}
          onSubmitReport={handleSubmitReport}
          onClose={() => setShowModal(false)}
        />
      )}

      <Button
        onClick={setAddMode}
        children={
          <svg
            className="nav-btn-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        }
      />
    </div>
  );
}

export default HeatMap;
