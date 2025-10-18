import { useState } from "react";
import "./Modal.css";

function OfficeWorkerModal() {
    const [selectedDays, setSelectedDays] = useState([]);
    const [workHours, setWorkHours] = useState({ start: "", end: "" });
    const [commuteType, setCommuteType] = useState("");
    const [lunchHabit, setLunchHabit] = useState("");

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

    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            selectedDays,
            workHours,
            commuteType,
            lunchHabit,
        };
        console.log("Office Worker Data:", formData);
        // You can POST this to backend or close modal
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="title-group">
                    <h3>Personalize Your Presko Experience</h3>
                    <p className="subtext">
                        Tell us a bit about your office work routine
                    </p>
                </div>

                <hr />

                <form className="register-form" onSubmit={handleSubmit}>
                    {/* a. Days in office */}
                    <div className="input-group">
                        <label>Which days do you usually go to the office?</label>
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

                    {/* b. Working hours */}
                    <div className="input-group time-range">
                        <label>What are your usual working hours?</label>
                        <div className="time-inputs">
                            <input
                                type="time"
                                value={workHours.start}
                                onChange={(e) =>
                                    setWorkHours({ ...workHours, start: e.target.value })
                                }
                                required
                            />
                            <span>to</span>
                            <input
                                type="time"
                                value={workHours.end}
                                onChange={(e) =>
                                    setWorkHours({ ...workHours, end: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>

                    {/* c. Commute type */}
                    <div className="input-group">
                        <label>How do you usually commute to work?</label>
                        <div className="user-type-options">
                            {commuteOptions.map((option) => (
                                <button
                                    type="button"
                                    key={option}
                                    className={`option-btn ${
                                        commuteType === option ? "selected" : ""
                                    }`}
                                    onClick={() =>
                                        setCommuteType(
                                            commuteType === option ? "" : option
                                        )
                                    }
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* d. Lunch habit */}
                    <div className="input-group">
                        <label>Do you usually go out for lunch?</label>
                        <div className="user-type-options">
                            {lunchOptions.map((option) => (
                                <button
                                    type="button"
                                    key={option}
                                    className={`option-btn ${
                                        lunchHabit === option ? "selected" : ""
                                    }`}
                                    onClick={() =>
                                        setLunchHabit(lunchHabit === option ? "" : option)
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

export default OfficeWorkerModal;
