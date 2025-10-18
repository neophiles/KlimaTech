import { useState } from "react";
import "./Modal.css";

function HomeBasedModal() {
    const [activities, setActivities] = useState([]);
    const [preferredTimes, setPreferredTimes] = useState([]);

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

    const toggleOption = (option, stateSetter, currentState) => {
        if (currentState.includes(option)) {
            stateSetter(currentState.filter((o) => o !== option));
        } else {
            stateSetter([...currentState, option]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            activities,
            preferredTimes,
        };
        console.log("Home-Based Data:", formData);
        // You can POST this to backend
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="title-group">
                    <h3>Personalize Your Presko Experience</h3>
                    <p className="subtext">
                        Tell us a bit about your daily home-based routine
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
                        <label>
                            On days you go out, what time do you usually prefer?
                        </label>
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

                    <hr />

                    {/* Submit */}
                    <div className="button-group">
                        <button className="confirm-btn" type="submit">
                            Let's get you presko!
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default HomeBasedModal;
