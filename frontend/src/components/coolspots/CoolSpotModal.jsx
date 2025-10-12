import React, { useState, useEffect } from "react";
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
  setCoolSpots,
  currentUser
}) => {
  if (!spot) return null;

  const [userVote, setUserVote] = useState(null); // 'like', 'dislike', or null

  // Initialize user's vote on mount
  useEffect(() => {
    if (currentUser && spot.votes) {
      const vote = spot.votes.find(v => v.user_id === currentUser.id);
      setUserVote(vote ? vote.vote_type : null);
    }
  }, [currentUser, spot.votes]);

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

      setSelectedSpot(prev => ({
        ...prev,
        likes: data.likes,
        dislikes: data.dislikes
      }));

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

  const totalVotes = (spot.likes || 0) + (spot.dislikes || 0) || 1;

  return (
    <div className="coolspot-modal-fullscreen">
      <button className="modal-back-arrow" onClick={onClose}>
        &#8592;
      </button>

      {spot.photo_url && <Carousel images={[`${API_BASE}${spot.photo_url}`]} />}

      <div className="modal-section">
        <h2 className="modal-title">{spot.name}</h2>
        <div className="modal-desc">{spot.description}</div>

        <div className="modal-votes">
          <button
            className={`vote-btn up ${userVote === "like" ? "active" : ""}`}
            onClick={() => vote("like")}
          >
            ▲
          </button>
          <span className="vote-count">{spot.likes || 0}</span>

          <button
            className={`vote-btn down ${userVote === "dislike" ? "active" : ""}`}
            onClick={() => vote("dislike")}
          >
            ▼
          </button>
          <span className="vote-count">{spot.dislikes || 0}</span>

          <div className="vote-bar">
            <div
              className="vote-bar-up"
              style={{ width: `${((spot.likes || 0) / totalVotes) * 100}%` }}
            />
            <div
              className="vote-bar-down"
              style={{ width: `${((spot.dislikes || 0) / totalVotes) * 100}%` }}
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
              <img src={`${API_BASE}${r.photo_url}`} alt="Report" className="report-thumb" />
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
        <div
          className="report-upload-box"
          onClick={() => document.getElementById("report-photo-input").click()}
        >
          <input
            id="report-photo-input"
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: "none" }}
            onChange={e => setReportPhoto(e.target.files[0])}
          />
          {!reportPhoto ? (
            <>
              <img src="/camera-icon.png" alt="Camera Icon" className="report-upload-icon" />
              <div className="report-upload-text">📸 Take or Upload a Photo</div>
              <div className="report-upload-subtext">
                Tap to open camera or choose from gallery
              </div>
            </>
          ) : (
            <div className="report-preview-wrapper">
              <img src={URL.createObjectURL(reportPhoto)} alt="Preview" className="report-preview" />
              <div className="report-filename">{reportPhoto.name}</div>
            </div>
          )}
        </div>

        <button type="submit" disabled={reportSubmitting}>
          {reportSubmitting ? "Submitting..." : "Add Report"}
        </button>
      </form>
    </div>
  );
};

export default CoolSpotModal;
