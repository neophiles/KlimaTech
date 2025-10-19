import { useState } from "react";
import "./Modal.css";

function OutdoorWorkerModal() {
    const [workType, setWorkType] = useState("");
    const [otherWork, setOtherWork] = useState("");
    const [workHours, setWorkHours] = useState({ start: "", end: "" });
    const [breakPreference, setBreakPreference] = useState("");

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            workType: workType === "Others" ? otherWork : workType,
            workHours,
            breakPreference,
        };
        console.log("Outdoor Worker Data:", formData);
        // You can proceed to save this data or close modal
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="title-group">
                    <h3>Personalize Your Presko Experience</h3>
                    <p className="subtext">
                        Tell us a bit about your daily outdoor work routine
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
                                    onClick={() =>
                                        setWorkType(workType === option ? "" : option)
                                    }
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        {/* If "Others" is selected */}
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
                                        setBreakPreference(
                                            breakPreference === option ? "" : option
                                        )
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

export default OutdoorWorkerModal;
