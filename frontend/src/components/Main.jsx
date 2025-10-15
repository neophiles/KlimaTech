import Dashboard from '../pages/Dashboard';
import HeatMap from "../pages/HeatMap";
import Planner from "../pages/Planner";
import { Routes, Route } from "react-router-dom";
import Settings from '../pages/Settings';
import { useState, useEffect } from "react";
import LoginModal from "../components/login/LoginModal";

function Main() {
  const [userData, setUserData] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setShowLogin(false);
    }
  }, []);

  const handleLoginConfirm = (data) => {
    setUserData(data);
    setShowLogin(false);
    localStorage.setItem("userData", JSON.stringify(data));
  };

  return (
    <>
        <LoginModal
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
            onConfirm={handleLoginConfirm}
        />
        <main>
            <Routes>
                <Route path="/" element={<Dashboard userData={userData} />} />
                <Route path="/heatmap" element={<HeatMap />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </main>
    </>
  );
}

export default Main;
