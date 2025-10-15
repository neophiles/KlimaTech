import React from "react";
import GuideWidget from "../components/widgets/GuideWidget";

function Settings({ onLogout }) {
    return (
        <div>
            <GuideWidget onLogout={onLogout} />
        </div>
    );
}

export default Settings;
