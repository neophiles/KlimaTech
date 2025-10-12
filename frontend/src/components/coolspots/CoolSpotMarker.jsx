import { Marker, Popup } from "react-leaflet";
import Carousel from "./Carousel";
import "./CoolSpotMarker.css";
import { useState, useEffect } from "react";

function CoolSpotMarker({ spot, onViewDetails, setSelectedSpot, setCoolSpots, currentUser }) {
  const [userVote, setUserVote] = useState(null); // 'like', 'dislike', or null

  // Initialize user's vote on mount
  useEffect(() => {
    if (currentUser && spot.votes) {
      const vote = spot.votes.find(v => v.user_id === currentUser.id);
      setUserVote(vote ? vote.vote_type : null);
    }
  }, [currentUser, spot.votes]);

  // Handle like/dislike with optimistic UI update
  async function vote(type) {
    const userId = currentUser?.id || 1;
    if (!userId) {
      console.error("Missing user ID. Please ensure user is logged in or selected.");
      return;
    }

    try {
      const res = await fetch(`/api/coolspots/${spot.id}/${type}?user_id=${userId}`, { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }

      const data = await res.json();

      // Update the selected spot's likes/dislikes
      setSelectedSpot(prev => ({
        ...prev,
        likes: data.likes,
        dislikes: data.dislikes
      }));

      // Update the spot in the list
      setCoolSpots(prev =>
        prev.map(s =>
          s.id === spot.id ? { ...s, likes: data.likes, dislikes: data.dislikes } : s
        )
      );

      // Update local user vote
      setUserVote(prev => (prev === type ? null : type));
    } catch (err) {
      console.error(`${type} error:`, err);
    }
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
            <button
              className={`vote-btn up ${userVote === "like" ? "active" : ""}`}
              onClick={() => vote("like")}
            >
              ▲
            </button>
            <div className="vote-count">{spot.likes || 0}</div>
            <button
              className={`vote-btn down ${userVote === "dislike" ? "active" : ""}`}
              onClick={() => vote("dislike")}
            >
              ▼
            </button>
            <div className="vote-count">{spot.dislikes || 0}</div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default CoolSpotMarker;
