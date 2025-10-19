import { useState, useEffect } from "react";
import "./Modal.css";

function OfficeWorkerModal({ userId, initialData = null, onClose = () => {}, onSaved = () => {} }) {
    const [selectedDays, setSelectedDays] = useState([]);
    const [workHours, setWorkHours] = useState({ start: "", end: "" });
    const [commuteType, setCommuteType] = useState("");
    const [lunchHabit, setLunchHabit] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    useEffect(() => {
        if (!initialData) return;

        // Prefill from initialData structure returned by backend
        if (initialData.office_days) {
            setSelectedDays(initialData.office_days.split(",").filter(Boolean));
        }
        if (initialData.work_hours) {
            const [start = "", end = ""] = initialData.work_hours.split("-");
            setWorkHours({ start, end });
        }
        if (initialData.commute_mode) setCommuteType(initialData.commute_mode);

        // convert boolean goes_out_for_lunch to one of our labels
        if (typeof initialData.goes_out_for_lunch === "boolean") {
            setLunchHabit(
                initialData.goes_out_for_lunch ? lunchOptions[0] : lunchOptions[1]
            );
        }
    }, [initialData]);

    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const payload = {
            selectedDays,
            workHours,
            commuteType,
            lunchHabit,
        };

        console.log("OfficeWorkerModal submit payload:", payload);

        try {
            const res = await fetch(`/api/user/office-worker/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to save profile");
            }

            const data = await res.json();
            console.log("OfficeWorkerModal: profile saved:", data);
            alert("Your Presko office worker profile has been saved!");
            onSaved(data); // let parent refresh UI
            onClose();
        } catch (err) {
            console.error("OfficeWorkerModal submit error:", err);
            alert("Something went wrong saving your profile.");
            setError(err.message || "Failed to save profile");
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

                    {error && <div className="form-error">{error}</div>}

                    <hr />

                    {/* Submit */}
                    <div className="button-group">
                        <button className="confirm-btn" type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Let's get you presko!"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default OfficeWorkerModal;
