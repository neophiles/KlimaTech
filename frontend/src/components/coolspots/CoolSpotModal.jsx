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
      <form
        onSubmit={e => {
          e.preventDefault();
          setReportSubmitting(true);
          const formData = new FormData();
          formData.append("user_id", 0); // Replace with actual user id if available
          formData.append("note", reportNote);
          if (reportPhoto) formData.append("file", reportPhoto);

          fetch(`/api/coolspots/${selectedSpot.id}/report`, {
            method: "POST",
            body: formData
          })
            .then(res => res.json())
            .then(() => fetch(`/api/coolspots/${selectedSpot.id}`))
            .then(res => res.json())
            .then(data => {
              setSelectedSpot(data);
              setReportNote("");
              setReportPhoto(null);
            })
            .catch(() => alert("Failed to add report"))
            .finally(() => setReportSubmitting(false));
        }}
      >
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
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CoolSpotModal;