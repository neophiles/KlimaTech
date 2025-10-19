import { useState, useEffect } from "react";
import "./Modal.css";

function HomeBasedModal({ userId, initialData = null, onClose = () => {}, onSaved = () => {} }) {
    const [activities, setActivities] = useState([]);
    const [preferredTimes, setPreferredTimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const activityOptions = [
        "Exercise / Sports",
        "Errands / Groceries / Palengke",
        "Walking kids/pets",
        "I rarely go out",
    ];

    const timeOptions = [
        "Early Morning (5 AM – 8 AM)",
        "Mid-Morning (9 AM – 11 AM)",
        "Lunchtime (11 AM – 2 PM)",
        "Afternoon (2 PM – 5 PM)",
        "Evening (5 PM onwards)",
    ];

    useEffect(() => {
        if (!initialData) return;
        if (initialData.outdoor_activities) {
            setActivities(
                initialData.outdoor_activities.split(",").map((s) => s.trim()).filter(Boolean)
            );
        }
        if (initialData.preferred_times) {
            setPreferredTimes(
                initialData.preferred_times.split(",").map((s) => s.trim()).filter(Boolean)
            );
        }
    }, [initialData]);

    const toggleOption = (option, stateSetter, currentState) => {
        if (currentState.includes(option)) {
            stateSetter(currentState.filter((o) => o !== option));
        } else {
            stateSetter([...currentState, option]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const payload = {
            activities,
            preferredTimes,
        };

        console.log("HomeBasedModal submit payload:", payload);

        try {
            const res = await fetch(`/api/user/home-based/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to save profile");
            }

            const data = await res.json();
            console.log("HomeBasedModal: profile saved:", data);
            alert("Your Home-based profile has been saved!");
            onSaved(data);
            onClose();
        } catch (err) {
            console.error("HomeBasedModal submit error:", err);
            setError(err.message || "Failed to save profile");
            alert("Something went wrong saving your profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="title-group">
                    <h3>Personalize Your Presko Experience</h3>
                    <p className="subtext">Tell us a bit about your daily home-based routine</p>
                </div>

                <hr />

                <form className="register-form" onSubmit={handleSubmit}>
                    {/* a. Outdoor activities */}
                    <div className="input-group">
                        <label>Do you have regular outdoor activities?</label>
                        <div className="user-type-options">
                            {activityOptions.map((option) => (
                                <button
                                    type="button"
                                    key={option}
                                    className={`option-btn ${activities.includes(option) ? "selected" : ""}`}
                                    onClick={() => toggleOption(option, setActivities, activities)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* b. Preferred times */}
                    <div className="input-group">
                        <label>On days you go out, what time do you usually prefer?</label>
                        <div className="user-type-options">
                            {timeOptions.map((option) => (
                                <button
                                    type="button"
                                    key={option}
                                    className={`option-btn ${preferredTimes.includes(option) ? "selected" : ""}`}
                                    onClick={() => toggleOption(option, setPreferredTimes, preferredTimes)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <hr />

                    <div className="button-group">
                        <button className="confirm-btn" type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Let's get you presko!"}
                        </button>
                        <button type="button" className="cancel-btn" onClick={() => onClose()} disabled={loading}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default HomeBasedModal;
