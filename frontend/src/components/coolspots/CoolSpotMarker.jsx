import { Marker, Popup } from "react-leaflet";
import Carousel from "./Carousel";
import "./CoolSpotMarker.css";

function CoolSpotMarker({ spot, onViewDetails, setSelectedSpot, setCoolSpots }) {

  function handleLike(id) {
    fetch(`/api/coolspots/${id}/like`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setSelectedSpot(prev => ({ ...prev, likes: data.likes }));
        setCoolSpots(prev =>
          prev.map(s => s.id === id ? { ...s, likes: data.likes } : s)
        );
      });
  }

  function handleDislike(id) {
    fetch(`/api/coolspots/${id}/dislike`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setSelectedSpot(prev => ({ ...prev, dislikes: data.dislikes }));
        setCoolSpots(prev =>
          prev.map(s => s.id === id ? { ...s, dislikes: data.dislikes } : s)
        );
      });
  }

  return (
    <Marker position={[spot.lat, spot.lon]}>
      <Popup className="coolspot-popup">
        <div className="coolspot-card">
          <div className="coolspot-header">
            <div className="coolspot-title">Cool Spot</div>
            <button className="coolspot-details-btn" onClick={() => onViewDetails(spot.id)}>
              <span role="img" aria-label="details">📝</span>
            </button>
          </div>
          <div className="coolspot-subtitle">{spot.name}</div>
          <div className="coolspot-desc">{spot.description}</div>
          {spot.photo_url && spot.photo_url.trim() !== "" && (
            <Carousel images={[`http://127.0.0.1:8000${spot.photo_url}`]} />
          )}
          <div className="coolspot-votes">
            <button className="vote-btn up" onClick={() => handleLike(spot.id)}>▲</button>
            <div className="vote-count">{spot.likes || 0}</div>
            <button className="vote-btn down" onClick={() => handleDislike(spot.id)}>▼</button>
            <div className="vote-count">{spot.dislikes || 0}</div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default CoolSpotMarker;