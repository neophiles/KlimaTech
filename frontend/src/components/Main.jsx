import Dashboard from '../pages/Dashboard';
import HeatMap from "../pages/HeatMap";
import Planner from "../pages/Planner";
import { Routes, Route } from "react-router-dom";
import Settings from '../pages/Settings';
import { useState, useEffect } from "react";
import RegisterModal from "../components/AuthModal/RegisterModal";

function Main() {
  const [userData, setUserData] = useState(null);
  const [showRegister, setShowRegister] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setShowRegister(false);
    }
  }, []);

  const handleRegisterConfirm = (data) => {
    setUserData(data);
    setShowRegister(false);
    localStorage.setItem("userData", JSON.stringify(data));
  };

  return (
    <>
        <RegisterModal
            isOpen={showRegister}
            onClose={() => setShowRegister(false)}
            onConfirm={handleRegisterConfirm}
        />
        <main>
            <Routes>
                <Route path="/" element={<Dashboard userData={userData} />} />
                <Route path="/map" element={<HeatMap />} />
                <Route path="/tips" element={<Planner />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </main>
    </>
  );
}

export default Main;
