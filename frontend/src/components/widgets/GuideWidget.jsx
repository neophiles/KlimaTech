import React, { useState } from "react";

function GuideWidget({ onLogout }) {
    const [message, setMessage] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("userData");
        setMessage("Logged out successfully!");

        // Notify parent (Dashboard) that user logged out
        setTimeout(() => {
            setMessage("");
            if (onLogout) onLogout();
        }, 1000);
    };

    return (
        <div className="base-widget guide-widget">
            <h1>How to Use</h1>

            {message && <p className="logout-message">{message}</p>}

            <button onClick={handleLogout} className="logout-btn">
                Logout
            </button>
        </div>
    );
}

export default GuideWidget;
