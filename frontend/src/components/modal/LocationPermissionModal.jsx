import Toggle from "../Toggle";
import "./Modal.css";

function LocationPermissionModal({ isOpen, onClose, allowLocation, onEnable }) {
  if (!isOpen) return null;

  const handleEnable = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
          onEnable?.(coords);
        },
        (err) => {
          console.error("Location permission denied:", err);
          alert("Please enable location to continue using PreskoSpots.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Allow Location Access</h3>
        <p>
          PRESKO needs your location to suggest the nearest cool spots and
          temperature updates around you.
        </p>

        <div className="toggle-container">
          <Toggle checked={allowLocation} />
          <span>Enable Browser's Location Permission</span>
        </div>
        
        <div className="button-group">
          <button className="confirm-btn" onClick={handleEnable}>
            Enable Location
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationPermissionModal;
