import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from '../pages/DashboardPage';
import Map from "../pages/MapPage";
import Planner from "../pages/InitTipsPage";
import Settings from '../pages/SettingsPage';
import AuthModal from "./modal/AuthModal";
import LocationPermissionModal from "./modal/LocationPermissionModal";
import StudentModal from "./modal/StudentModal";
import OutdoorWorkerModal from "./modal/OutdoorWorkerModal";
import OfficeWorkerModal from "./modal/OfficeWorkerModal";
import HomeBasedModal from "./modal/HomeBasedModal";

function Main() {
  const [userData, setUserData] = useState(null);
  const [showAuth, setShowAuth] = useState(true);

  const [allowLocation, setAllowLocation] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const [personalizeType, setPersonalizeType] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setShowAuth(false);
    }
  }, []);

  useEffect(() => {
    if (!navigator.permissions) return;
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      setAllowLocation(result.state === "granted");
      result.onchange = () => setAllowLocation(result.state === "granted");
    });
  }, []);

  useEffect(() => {
    if (userData && (!userData.lat || !userData.lon)) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
          handleLocationEnabled(coords);
        },
        (err) => {
          console.warn("User denied location:", err);
          setShowLocationModal(true);
        }
      );
    }
  }, [userData]);

  const handleAuthConfirm = (data) => {
    setUserData(data);
    setShowAuth(false);
    localStorage.setItem("userData", JSON.stringify(data));

    // Show the personalization modal based on user_type
    setPersonalizeType(data.user_type.toLowerCase().replace(" ", "_"));
    setShowPersonalizeModal(true);
  };

  const handleLocationEnabled = (coords) => {
    console.log("User granted location:", coords);
    const updatedUser = { ...userData, lat: coords.lat, lon: coords.lon };
    setUserData(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    setAllowLocation(true);
    setShowLocationModal(false);
  };

  const modalMap = {
    "student": StudentModal,
    "outdoor_worker": OutdoorWorkerModal,
    "office_worker": OfficeWorkerModal,
    "home-based": HomeBasedModal
  };

  const PersonalizeModal = modalMap[personalizeType];

  return (
    <>
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onConfirm={handleAuthConfirm}
      />

      <LocationPermissionModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onEnable={handleLocationEnabled}
        allowLocation={allowLocation}
      />

      {showPersonalizeModal && PersonalizeModal && (
        <PersonalizeModal onClose={() => setShowPersonalizeModal(false)} />
      )}

      <main>
        <Routes>
          <Route path="/" element={<Dashboard userData={userData} />} />
          <Route path="/map" element={<Map />} />
          <Route path="/tips" element={<Planner />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </>
  );
}

export default Main;
