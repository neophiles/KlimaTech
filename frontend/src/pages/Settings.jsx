import React from "react";
import { useNavigate } from "react-router-dom";
import GuideWidget from "../components/widgets/GuideWidget";

function Settings({ onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("userData");
        if (onLogout) onLogout();           
        alert("Logged out successfully!");
        navigate("/");             
    };

    return (
        <div>
            <GuideWidget onLogout={handleLogout} />
        </div>
    );
}

export default Settings;
