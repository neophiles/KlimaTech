import { useState, useEffect } from "react";
import "./Modal.css";

function StudentModal({ userId, onClose, existingProfile = null, editMode = false }) {
    const [selectedDays, setSelectedDays] = useState([]);
    const [commuteType, setCommuteType] = useState("");
    const [classHours, setClassHours] = useState({ start: "", end: "" });
    const [hasOutdoorActivities, setHasOutdoorActivities] = useState(null);
    const [activityHours, setActivityHours] = useState({ start: "", end: "" });
    const [loading, setLoading] = useState(false);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const commuteOptions = ["Walk / Bike", "Public Transport", "Private Vehicle"];

    // Prefill data if edit mode
    useEffect(() => {
        if (!existingProfile && userId) {
            fetch(`/api/user/student/${userId}`)
                .then(res => {
                    if (!res.ok) throw new Error("No existing profile");
                    return res.json();
                })
                .then(data => {
                    setSelectedDays(data.selectedDays || []);
                    setCommuteType(data.commuteType || "");
                    setClassHours(data.classHours || { start: "", end: "" });
                    setHasOutdoorActivities(data.hasOutdoorActivities || null);
                    setActivityHours(data.activityHours || { start: "", end: "" });
                })
                .catch(err => console.log("No profile found:", err));
        } else if (existingProfile) {
            // Prefill from props
            setSelectedDays(existingProfile.selectedDays || []);
            setCommuteType(existingProfile.commuteType || "");
            setClassHours(existingProfile.classHours || { start: "", end: "" });
            setHasOutdoorActivities(existingProfile.hasOutdoorActivities || null);
            setActivityHours(existingProfile.activityHours || { start: "", end: "" });
        }
    }, [userId, existingProfile]);


    // Toggle day selection
    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = {
            selectedDays,
            commuteType,
            classHours,
            hasOutdoorActivities,
            activityHours: hasOutdoorActivities === "Yes" ? activityHours : null,
        };

        try {
            const method = editMode ? "PUT" : "POST";
            const url = `/api/user/student/${userId}`;

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error(`${method} request failed`);
            await res.json();

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
                            ? "Update your student profile information"
                            : "Tell us a bit about your weekly student life"}
                    </p>
                </div>

                <hr />

                <form className="register-form" onSubmit={handleSubmit}>
                    {/* a. Days on campus */}
                    <div className="input-group">
                        <label>Which days are you usually on campus?</label>
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

                    {/* b. Commute type */}
                    <div className="input-group">
                        <label>How do you usually get to campus?</label>
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

                    {/* c. Class hours */}
                    <div className="input-group time-range">
                        <label>What are your usual class hours?</label>
                        <div className="time-inputs">
                            <input
                                type="time"
                                value={classHours.start}
                                onChange={(e) => setClassHours({ ...classHours, start: e.target.value })}
                                required
                            />
                            <span>to</span>
                            <input
                                type="time"
                                value={classHours.end}
                                onChange={(e) => setClassHours({ ...classHours, end: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* d. PE or club activities */}
                    <div className="input-group">
                        <label>Do you have outdoor PE or club activities?</label>
                        <div className="user-type-options">
                            {["Yes", "No"].map((option) => (
                                <button
                                    type="button"
                                    key={option}
                                    className={`option-btn ${hasOutdoorActivities === option ? "selected" : ""}`}
                                    onClick={() => setHasOutdoorActivities(hasOutdoorActivities === option ? null : option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* e. Activity hours (conditional) */}
                    {hasOutdoorActivities === "Yes" && (
                        <div className="input-group time-range">
                            <label>What time are your outdoor activities?</label>
                            <div className="time-inputs">
                                <input
                                    type="time"
                                    value={activityHours.start}
                                    onChange={(e) => setActivityHours({ ...activityHours, start: e.target.value })}
                                />
                                <span>to</span>
                                <input
                                    type="time"
                                    value={activityHours.end}
                                    onChange={(e) => setActivityHours({ ...activityHours, end: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <hr />

                    <div className="button-group">
                        <button className="confirm-btn" type="submit" disabled={loading}>
                            {loading ? "Saving..." : editMode ? "Update Profile" : "Let's get you presko!"}
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

export default StudentModal;
