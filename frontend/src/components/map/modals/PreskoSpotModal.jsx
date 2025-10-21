import React, { useState, useEffect } from "react";
import Carousel from "./Carousel";
import "./PreskoSpotModal.css";

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
  const [likes, setLikes] = useState(spot.likes || 0);
  const [dislikes, setDislikes] = useState(spot.dislikes || 0);

  // Fetch votes from backend on mount
  useEffect(() => {
    async function fetchVotes() {
      try {
        const url = `/api/coolspots/${spot.id}/votes${currentUser && currentUser.id ? `?user_id=${currentUser.id}` : ""}`;
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch votes: ${text}`);
        }
        const data = await res.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
        setUserVote(data.user_vote ?? null); // 'like', 'dislike', or null
      } catch (err) {
        console.error(err);
      }
    }

    fetchVotes();
  }, [spot.id]);

  async function vote(type) {
    if (!currentUser || !currentUser.id) {
      alert("Please login to vote.");
      return;
    }

    try {
      const res = await fetch(`/api/coolspots/${spot.id}/${type}?user_id=${currentUser.id}`, { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }

      const data = await res.json();

      // Update local state from authoritative response
      setLikes(data.likes);
      setDislikes(data.dislikes);
      setUserVote(data.user_vote ?? null);

      // Update parent state
      setSelectedSpot(prev => prev && prev.id === data.id ? { ...prev, likes: data.likes, dislikes: data.dislikes, user_vote: data.user_vote ?? null } : prev);

      setCoolSpots(prev =>
        prev.map(s =>
          s.id === spot.id ? { ...s, likes: data.likes, dislikes: data.dislikes, user_vote: data.user_vote ?? null } : s
        )
      );
    } catch (err) {
      console.error(`${type} error:`, err);
      alert("Failed to submit vote: " + (err.message || ""));
    }
  }

  const totalVotes = likes + dislikes || 1;

  const voteIcons = {
    like: {
      outline: (
        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
        </svg>
      ),
      solid: (
        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
        </svg>
      )
    },
    dislike: {
      outline: (
        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
        </svg>
      ),
      solid: (
        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
        </svg>
      )
    }
  };

  return (
    <div className="modal preskospot">
      <button className="modal-back-arrow" onClick={onClose}>
        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M13.883 5.007l.058 -.005h.118l.058 .005l.06 .009l.052 .01l.108 .032l.067 .027l.132 .07l.09 .065l.081 .073l.083 .094l.054 .077l.054 .096l.017 .036l.027 .067l.032 .108l.01 .053l.01 .06l.004 .057l.002 .059v12c0 .852 -.986 1.297 -1.623 .783l-.084 -.076l-6 -6a1 1 0 0 1 -.083 -1.32l.083 -.094l6 -6l.094 -.083l.077 -.054l.096 -.054l.036 -.017l.067 -.027l.108 -.032l.053 -.01l.06 -.01z" />
        </svg>
      </button>

      {spot.photo_url && <Carousel otherClass={"modal-img"} images={[`${API_BASE}${spot.photo_url}`]} />}

      <div className="container">
        <div className="modal-section">
          <div className="modal-heading">
              <h2 className="modal-title">{spot.name}</h2>
              <div className="modal-desc">{spot.type}</div>
          </div>

          <div className="modal-votes">
            <button
              className={`vote-btn up ${userVote === "like" ? "active" : ""}`}
              onClick={(e) => { e.stopPropagation(); vote("like"); }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              title={currentUser ? (userVote === "like" ? "Undo like" : "Like") : "Login to vote"}
            >
              {userVote === "like" ? voteIcons.like.solid : voteIcons.like.outline}
            </button>
            <span className="vote-count">{likes}</span>

            <button
              className={`vote-btn down ${userVote === "dislike" ? "active" : ""}`}
              onClick={(e) => { e.stopPropagation(); vote("dislike"); }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              title={currentUser ? (userVote === "dislike" ? "Undo dislike" : "Dislike") : "Login to vote"}
            >
              {userVote === "dislike" ? voteIcons.dislike.solid : voteIcons.dislike.outline}
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

        <hr />

        <form className="modal-section report-form" onSubmit={onSubmitReport}>
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

        <hr />

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
      </div>
    </div>
  );
};

export default CoolSpotModal;
