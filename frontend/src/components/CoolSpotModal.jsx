import React from "react";

const CoolSpotModal = ({
  spot,
  reportNote,
  setReportNote,
  reportSubmitting,
  onSubmitReport,
  onClose
}) => {
  if (!spot) return null;

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
      {/* Form to add a new report */}
      <form onSubmit={onSubmitReport}>
        <input
          type="text"
          value={reportNote}
          onChange={e => setReportNote(e.target.value)}
          placeholder="Add a report..."
          required
          style={{ width: "80%" }}
        />
        <button type="submit" disabled={reportSubmitting}>
          {reportSubmitting ? "Submitting..." : "Add Report"}
        </button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CoolSpotModal;