import { useState, useEffect } from "react";
import "./Modal.css";

function OfficeWorkerModal({ userId, onClose, existingProfile = null, editMode = false }) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [workHours, setWorkHours] = useState({ start: "", end: "" });
  const [commuteType, setCommuteType] = useState("");
  const [lunchHabit, setLunchHabit] = useState("");
  const [loading, setLoading] = useState(false);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const commuteOptions = [
    "Walk / Bike",
    "Public Transport (Jeepney, Bus, MRT/LRT)",
    "Private Vehicle / Ride-sharing",
  ];
  const lunchOptions = [
    "Yes, I walk/commute out",
    "No, I eat inside the building / bring baon",
  ];

  // Prefill form
  useEffect(() => {
    const prefillProfile = async () => {
      if (existingProfile) {
        setSelectedDays(existingProfile.selectedDays || []);
        setWorkHours(existingProfile.workHours || { start: "", end: "" });
        setCommuteType(existingProfile.commuteType || "");
        setLunchHabit(existingProfile.lunchHabit || "");
      } else if (userId) {
        try {
          const res = await fetch(`api/user/office-worker/${userId}`);
          if (!res.ok) throw new Error("No existing profile");
          const data = await res.json();
          setSelectedDays(data.selectedDays || []);
          setWorkHours(data.workHours || { start: "", end: "" });
          setCommuteType(data.commuteType || "");
          setLunchHabit(data.lunchHabit || "");
        } catch (err) {
          console.log("No profile found:", err);
        }
      }
    };

    prefillProfile();
  }, [userId, existingProfile]);

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { selectedDays, workHours, commuteType, lunchHabit };

    try {
      const method = editMode ? "PUT" : "POST";
      const res = await fetch(`api/user/office-worker/${userId}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`${method} request failed`);
      const data = await res.json();

      alert(editMode ? "Profile updated successfully!" : "Profile created successfully!");
      if (onClose) onClose(data); // pass updated profile back to parent if needed
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
              ? "Update your office worker profile information"
              : "Tell us a bit about your office work routine"}
          </p>
        </div>

        <hr />

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Days in office */}
          <div className="input-group">
            <label>Which days do you usually go to the office?</label>
            <div className="day-options">
              {days.map((day) => (
                <button
                  type="button"
                  key={day}
                  className={`option-btn ${selectedDays.includes(day) ? "selected" : ""}`}
                  onClick={() => toggleDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Working hours */}
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

          {/* Commute type */}
          <div className="input-group">
            <label>How do you usually commute to work?</label>
            <div className="user-type-options">
              {commuteOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`option-btn ${commuteType === option ? "selected" : ""}`}
                  onClick={() => setCommuteType(commuteType === option ? "" : option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Lunch habit */}
          <div className="input-group">
            <label>Do you usually go out for lunch?</label>
            <div className="user-type-options">
              {lunchOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`option-btn ${lunchHabit === option ? "selected" : ""}`}
                  onClick={() => setLunchHabit(lunchHabit === option ? "" : option)}
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

export default OfficeWorkerModal;
