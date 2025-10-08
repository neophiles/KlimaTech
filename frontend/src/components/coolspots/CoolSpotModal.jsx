import React from "react";
import Carousel from "./Carousel";

const CoolSpotModal = ({
  spot,
  reportNote,
  setReportNote,
  reportPhoto,
  setReportPhoto,
  reportSubmitting,
  onSubmitReport,
  onClose
}) => {
  if (!spot) return null;

  // Backend base URL (no proxy)
  const API_BASE = "http://127.0.0.1:8000";

  return (
    <div className="modal">
      <h2>{spot.name}</h2>
      <p>Type: {spot.type}</p>
      <p>Barangay ID: {spot.barangay_id}</p>
      <p>Latitude: {spot.lat}</p>
      <p>Longitude: {spot.lon}</p>

      <h3>Reports:</h3>
      <ul>
        {spot.reports.map((r, idx) => (
          <li key={idx}>
            {r.note} <br />
            <small>{r.date} {r.time}</small>
          </li>
        ))}
      </ul>

      {/* Report form */}
      <form onSubmit={onSubmitReport}>
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

        {/* Show uploaded report images */}
        {spot.reports.map((r, idx) =>
          r.photo_url ? (
            <img
              key={idx}
              src={`${API_BASE}${r.photo_url}`} 
              alt="Report"
              style={{
                width: "100%",
                maxWidth: "400px",
                marginTop: "8px",
                borderRadius: "8px"
              }}
            />
          ) : null
        )}

        <button type="submit" disabled={reportSubmitting}>
          {reportSubmitting ? "Submitting..." : "Add Report"}
        </button>
      </form>

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CoolSpotModal;
