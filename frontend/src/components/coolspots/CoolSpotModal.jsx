import React from "react";
import Carousel from "./Carousel";
import "./CoolSpotModal.css";

const API_BASE = "http://127.0.0.1:8000";

const CoolSpotModal = ({
  spot,
  reportNote,
  setReportNote,
  reportPhoto,
  setReportPhoto,
  reportSubmitting,
  onSubmitReport,
  onClose,
  setSelectedSpot,
  setCoolSpots
}) => {
  if (!spot) return null;

  // Like handler (same as CoolSpotMarker)
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

  // Dislike handler (same as CoolSpotMarker)
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
    <div className="coolspot-modal-fullscreen">
      <button className="modal-back-arrow" onClick={onClose}>
        &#8592;
      </button>
      {spot.photo_url && (
        <Carousel images={[`${API_BASE}${spot.photo_url}`]} />
      )}

      <div className="modal-section">
        <h2 className="modal-title">{spot.name}</h2>
        <div className="modal-desc">{spot.description}</div>
        <div className="modal-votes">
          <button className="vote-btn up" onClick={() => handleLike(spot.id)}>▲</button>
          <span className="vote-count">{spot.likes || 0}</span>
          <button className="vote-btn down" onClick={() => handleDislike(spot.id)}>▼</button>
          <span className="vote-count">{spot.dislikes || 0}</span>
          <div className="vote-bar">
            <div
              className="vote-bar-up"
              style={{
                width: `${(spot.likes / ((spot.likes || 0) + (spot.dislikes || 0) || 1)) * 100}%`
              }}
            />
            <div
              className="vote-bar-down"
              style={{
                width: `${(spot.dislikes / ((spot.likes || 0) + (spot.dislikes || 0) || 1)) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      <div className="modal-section">
        <h3>Ratings</h3>
        {spot.reports.map((r, idx) => (
          <div className="report-card" key={idx}>
            <div className="report-header">
              <span className="report-user">User{r.user_id}</span>
              <span className="report-date">{r.date} {r.time}</span>
            </div>
            {r.photo_url && (
              <img
                src={`${API_BASE}${r.photo_url}`}
                alt="Report"
                className="report-thumb"
              />
            )}
            <div className="report-note">{r.note}</div>
          </div>
        ))}
      </div>

      <form className="report-form" onSubmit={onSubmitReport}>
        <input
          type="text"
          value={reportNote}
          onChange={e => setReportNote(e.target.value)}
          placeholder="Add a report..."
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setReportPhoto(e.target.files[0])}
        />
        <button type="submit" disabled={reportSubmitting}>
          {reportSubmitting ? "Submitting..." : "Add Report"}
        </button>
      </form>
    </div>
  );
};

export default CoolSpotModal;
