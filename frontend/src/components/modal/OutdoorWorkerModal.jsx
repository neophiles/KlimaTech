import { useState, useEffect } from "react";
import "./Modal.css";

function OutdoorWorkerModal({ userId, onClose, existingProfile = null, editMode = false }) {
  const [workType, setWorkType] = useState("");
  const [otherWork, setOtherWork] = useState("");
  const [workHours, setWorkHours] = useState({ start: "", end: "" });
  const [breakPreference, setBreakPreference] = useState(null);
  const [loading, setLoading] = useState(false);

  const workOptions = [
    "Construction / Maintenance",
    "Delivery / Transport",
    "Vendor / Street Food",
    "Field Agent / Technician",
    "Agriculture / Fishing",
    "Others",
  ];

  const breakOptions = [
    "Mostly outdoors / In a shaded area",
    "Mostly indoors (with fan or AC)",
  ];

  // Pre-fill fields if in edit mode
  useEffect(() => {
    if (existingProfile) {
      setWorkType(existingProfile.workType || "");
      setWorkHours(existingProfile.workHours || { start: "", end: "" });
      setBreakPreference(existingProfile.breakPreference || "");
    } else {
      fetch(`/api/user/outdoor-worker/${userId}`)
        .then(res => {
          if (!res.ok) throw new Error("No existing outdoor profile");
          return res.json();
        })
        .then(data => {
          setWorkType(data.workType || "");
          setWorkHours(data.workHours || { start: "", end: "" });
          setBreakPreference(data.breakPreference || "");
        })
        .catch(() => {});
    }
  }, [userId, existingProfile]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      workType: workType === "Others" ? otherWork : workType,
      workHours: { start: workHours.start, end: workHours.end },
      breakPreference,
    };

    try {
      const method = editMode ? "PUT" : "POST";
      const url = `/api/user/outdoor-worker/${userId}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`${method} request failed`);

      const data = await res.json();
      alert(editMode ? "Profile updated successfully!" : "Profile created successfully!");
      if (onClose) onClose();
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong while saving your profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="title-group">
          <h3>Personalize Your Presko Experience</h3>
          <p className="subtext">
            {editMode
              ? "Update your outdoor worker profile information"
              : "Tell us a bit about your daily outdoor work routine"}
          </p>
        </div>

        <hr />

        <form className="register-form" onSubmit={handleSubmit}>
          {/* a. Type of work */}
          <div className="input-group">
            <label>What type of work do you usually do outdoors?</label>
            <div className="user-type-options">
              {workOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`option-btn ${workType === option ? "selected" : ""}`}
                  onClick={() => setWorkType(workType === option ? "" : option)}
                >
                  {option}
                </button>
              ))}
            </div>

            {workType === "Others" && (
              <input
                type="text"
                placeholder="Please specify"
                value={otherWork}
                onChange={(e) => setOtherWork(e.target.value)}
                required
              />
            )}
          </div>

          {/* b. Working hours */}
          <div className="input-group time-range">
            <label>What are your usual working hours?</label>
            <div className="time-inputs">
              <input
                type="time"
                value={workHours.start}
                onChange={(e) => setWorkHours({ ...workHours, start: e.target.value })}
                required
              />
              <span>to</span>
              <input
                type="time"
                value={workHours.end}
                onChange={(e) => setWorkHours({ ...workHours, end: e.target.value })}
                required
              />
            </div>
          </div>

          {/* c. Break location */}
          <div className="input-group">
            <label>Do you take breaks outdoors or indoors?</label>
            <div className="user-type-options">
              {breakOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`option-btn ${breakPreference === option ? "selected" : ""}`}
                  onClick={() =>
                    setBreakPreference(breakPreference === option ? null : option)
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <hr />

          <div className="button-group">
            <button className="confirm-btn" type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editMode
                ? "Update Profile"
                : "Let's get you presko!"}
            </button>

            {editMode && (
              <button
                type="button"
                className="cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default OutdoorWorkerModal;
