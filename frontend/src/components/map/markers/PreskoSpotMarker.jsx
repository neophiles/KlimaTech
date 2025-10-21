import { Marker, Popup, useMap } from "react-leaflet";
import { useRef, useState, memo } from "react";
import "./markers.css";
import { preskoSpotMarker } from "../../../utils/coolSpotsIcons";
import PreskoSpotPopupContent from "./PreskoSpotPopupContent";

function PreskoSpotMarker({ spot, onViewDetails, setSelectedSpot, setCoolSpots, currentUser }) {
  const map = useMap();
  const markerRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleMarkerClick = () => {
    if (markerRef.current) {
      markerRef.current.openPopup();
      setIsPopupOpen(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
      <Marker 
        ref={markerRef}
        position={[spot.lat, spot.lon]}
        icon={preskoSpotMarker}
        eventHandlers={{
          click: handleMarkerClick,
          popupclose: handleClosePopup,
        }}
      >
        <Popup
          className="coolspot-popup"
          closeButton={false}
          eventHandlers={{
            click: (e) => e.originalEvent.stopPropagation(),
          }}
        >
          <PreskoSpotPopupContent
            spot={spot}
            currentUser={currentUser}
            onViewDetails={onViewDetails}
            setCoolSpots={setCoolSpots}
            setSelectedSpot={setSelectedSpot}
            isPopupOpen={isPopupOpen}
          />
        </Popup>
      </Marker>      
  );
}

const areMarkersEqual = (prevProps, nextProps) => (
  prevProps.spot.id === nextProps.spot.id &&
  prevProps.spot.lat === nextProps.spot.lat &&
  prevProps.spot.lon === nextProps.spot.lon &&
  prevProps.currentUser?.id === nextProps.currentUser?.id
);

export default memo(PreskoSpotMarker, areMarkersEqual);