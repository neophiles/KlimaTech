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
  setCoolSpots
}) => {
  if (!spot) return null;

  const [userVote, setUserVote] = useState(null); // 'like', 'dislike', or null
  const [likes, setLikes] = useState(spot.likes || 0);
  const [dislikes, setDislikes] = useState(spot.dislikes || 0);

  // Fetch votes from backend on mount
  useEffect(() => {
    async function fetchVotes() {
      try {
        const res = await fetch(`/api/coolspots/${spot.id}/votes?user_id=1`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch votes: ${text}`);
        }
        const data = await res.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setUserVote(data.user_vote); // 'like', 'dislike', or null
      } catch (err) {
        console.error(err);
      }
    }

    fetchVotes();
  }, [spot.id]);

  async function vote(type) {
    try {
      const res = await fetch(`/api/coolspots/${spot.id}/${type}?user_id=1`, { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }

      const data = await res.json();

      // Update local state
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserVote(prev => (prev === type ? null : type));

      // Update parent state
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
    } catch (err) {
      console.error(`${type} error:`, err);
    }
  }

  const totalVotes = likes + dislikes || 1;

  return (
    <div className="coolspot-modal-fullscreen">
      <button className="modal-back-arrow" onClick={onClose}>
        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
      </button>

      {spot.photo_url && <Carousel images={[`${API_BASE}${spot.photo_url}`]} />}

      <div className="modal-section">
        <h2 className="modal-title">{spot.name}</h2>
        <div className="modal-desc">{spot.type}</div>

        <div className="modal-votes">
          <button
            className={`vote-btn up ${userVote === "like" ? "active" : ""}`}
            onClick={() => vote("like")}
          >
            ▲
          </button>
          <span className="vote-count">{likes}</span>

          <button
            className={`vote-btn down ${userVote === "dislike" ? "active" : ""}`}
            onClick={() => vote("dislike")}
          >
            ▼
          </button>
          <span className="vote-count">{dislikes}</span>

          <div className="vote-bar">
            <div
              className="vote-bar-up"
              style={{ width: `${(likes / totalVotes) * 100}%` }}
            />
            <div
              className="vote-bar-down"
              style={{ width: `${(dislikes / totalVotes) * 100}%` }}
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
