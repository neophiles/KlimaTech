import { useState, useEffect } from "react";
import "./Modal.css";

function HomeBasedModal({ userId, onClose, existingProfile = null, editMode = false }) {
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

    // Prefill data when editing
    useEffect(() => {
        if (existingProfile) {
            setActivities(existingProfile.activities || []);
            setPreferredTimes(existingProfile.preferredTimes || []);
            return;
        }

        // If no existingProfile, attempt to fetch
        fetch(`/api/user/home-based/${userId}`)
            .then((res) => {
                if (!res.ok) throw new Error("No existing profile");
                return res.json();
            })
            .then((data) => {
                setActivities(data.activities || []);
                setPreferredTimes(data.preferredTimes || []);
            })
            .catch(() => {});
    
    }, [editMode, existingProfile]);

    // Reusable toggle function
    const toggleOption = (option, setter, current) => {
        setter(
            current.includes(option)
                ? current.filter((o) => o !== option)
                : [...current, option]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = {
            activities,
            preferredTimes,
        };

        try {
            const method = editMode ? "PUT" : "POST";
            const url = `/api/user/home-based/${userId}`;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error(`${method} request failed`);

            const data = await res.json();
            alert(editMode ? "Profile updated successfully!" : "Profile created successfully!");
            if (onClose) onClose();
        } catch (err) {
            console.error("HomeBasedModal submit error:", err);
            setError(err.message || "Failed to save profile");
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
                            ? "Update your home-based profile information"
                            : "Tell us a bit about your daily home-based routine"}
                    </p>
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
                                    className={`option-btn ${
                                        activities.includes(option) ? "selected" : ""
                                    }`}
                                    onClick={() =>
                                        toggleOption(option, setActivities, activities)
                                    }
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
                                    className={`option-btn ${
                                        preferredTimes.includes(option) ? "selected" : ""
                                    }`}
                                    onClick={() =>
                                        toggleOption(option, setPreferredTimes, preferredTimes)
                                    }
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

export default HomeBasedModal;
