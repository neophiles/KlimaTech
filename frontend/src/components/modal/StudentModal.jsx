import { useState } from "react";
import "./Modal.css";

function StudentModal() {
    const [selectedDays, setSelectedDays] = useState([]);
    const [commuteType, setCommuteType] = useState("");
    const [classHours, setClassHours] = useState({ start: "", end: "" });
    const [hasOutdoorActivities, setHasOutdoorActivities] = useState(null);
    const [activityHours, setActivityHours] = useState({ start: "", end: "" });

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const commuteOptions = ["Walk / Bike", "Public Transport", "Private Vehicle"];

    // Toggle day selection
    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            selectedDays,
            commuteType,
            classHours,
            hasOutdoorActivities,
            activityHours: hasOutdoorActivities ? activityHours : null,
        };
        console.log("Student Data:", formData);
        // You can proceed to save this data or close modal
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="title-group">
                    <h3>Personalize Your Presko Experience</h3>
                    <p className="subtext">Tell us a bit about your weekly student life</p>
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
                                    className={`option-btn ${
                                        selectedDays.includes(day) ? "selected" : ""
                                    }`}
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
                                    className={`option-btn ${
                                        commuteType === option ? "selected" : ""
                                    }`}
                                    onClick={() => setCommuteType (
                                        commuteType === option ? null : option
                                    )}
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
                                onChange={(e) =>
                                    setClassHours({ ...classHours, start: e.target.value })
                                }
                                required
                            />
                            <span>to</span>
                            <input
                                type="time"
                                value={classHours.end}
                                onChange={(e) =>
                                    setClassHours({ ...classHours, end: e.target.value })
                                }
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
                                    className={`option-btn ${
                                        hasOutdoorActivities === option ? "selected" : ""
                                    }`}
                                    onClick={() => setHasOutdoorActivities(
                                        hasOutdoorActivities === option ? null : option
                                    )}
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
                                    onChange={(e) =>
                                        setActivityHours({
                                            ...activityHours,
                                            start: e.target.value,
                                        })
                                    }
                                />
                                <span>to</span>
                                <input
                                    type="time"
                                    value={activityHours.end}
                                    onChange={(e) =>
                                        setActivityHours({
                                            ...activityHours,
                                            end: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    )}

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

export default StudentModal;
