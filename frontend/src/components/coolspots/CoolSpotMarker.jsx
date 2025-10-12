import { Marker, Popup } from "react-leaflet";
import Carousel from "./Carousel";
import "./CoolSpotMarker.css";

function CoolSpotMarker({ spot, onViewDetails, setSelectedSpot, setCoolSpots, currentUser }) {

  function handleLike(id) {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser?.id || 1; 

    if (!userId) {
      console.error("Missing user ID. Please ensure user is logged in or selected.");
      return;
    }

    fetch(`/api/coolspots/${id}/like?user_id=${userId}`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setSelectedSpot(prev => ({ ...prev, likes: data.likes }));
        setCoolSpots(prev =>
          prev.map(s => s.id === id ? { ...s, likes: data.likes } : s)
        );
      });
  }

  function handleDislike(id) {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const userId = currentUser?.id || 1; 

    if (!userId) {
      console.error("Missing user ID. Please ensure user is logged in or selected.");
      return;
    }

    fetch(`/api/coolspots/${id}/dislike?user_id=${userId}`, { method: "POST" })
      .then(async res => {
        const text = await res.text();
        console.log("Dislike response:", res.status, text);
        return JSON.parse(text);
      })
      .then(data => {
        setSelectedSpot(prev => ({ ...prev, dislikes: data.dislikes }));
        setCoolSpots(prev =>
          prev.map(s => (s.id === id ? { ...s, dislikes: data.dislikes } : s))
        );
      })
      .catch(err => console.error("Dislike error:", err));
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