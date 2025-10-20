import InfoSubPage from "./InfoSubPage";
import AboutSubPage from "./AboutSubPage";
import ProfileSubPage from "./ProfileSubPage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";

function Settings() {
  const [message, setMessage] = useState("");
  const [subPage, setSubPage] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setMessage("Logged out successfully!");

    // 1. Remove user data
    localStorage.removeItem("userData");

    // 2. Notify user
    alert("Logged out successfully!");

    // 3. Navigate to home page
    navigate("/");

    // 4. Wait briefly to ensure navigation finishes, then reload
    setTimeout(() => {
      setMessage("");
      window.location.reload();
    }, 100);
  };

  const backButton = (
    <div className="base-widget back-btn-widget">
      <button
        className="settings-btn back"
        onClick={() => setSubPage("")}
      >
        <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M11 7l-5 5l5 5" />
          <path d="M17 7l-5 5l5 5" />
        </svg>
        Back to Settings
      </button>
    </div>
  )

  return (
    <div className="dashboard">
      {subPage !== "" && backButton}

      {subPage === "profile" ? <ProfileSubPage /> :
        subPage === "info" ? <InfoSubPage /> :
        subPage === "about" ? <AboutSubPage /> :
        
        <>
          <div className="base-widget raised-widget settings-widget">
            <span className="widget-title">ACCOUNT</span>
            <a href="#" onClick={(e) => { e.preventDefault(); setSubPage("profile"); }}>
              Profile
            </a>
            <a href="#" onClick={(e) => { }}>
              Notifications
            </a>
          </div>
          <div className="base-widget raised-widget settings-widget">
            <span className="widget-title">RESOURCES</span>
            <a href="#" onClick={(e) => { e.preventDefault(); setSubPage("info"); }}>
              Heat Info
            </a>
          </div>
          <div className="base-widget raised-widget settings-widget">
            <span className="widget-title">ABOUT</span>
            <a href="#" onClick={(e) => { e.preventDefault(); setSubPage("about"); }}>
              About PRESKO
            </a>
            <a href="#" onClick={(e) => { }}>
              Share the App
            </a>
            <button onClick={handleLogout} className="settings-btn logout">
              Logout
            </button>
          </div>
        </>
      }
      
    </div>
  );
}

export default Settings;
