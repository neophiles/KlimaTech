import { useEffect, useState } from "react";
import HeatGauge from "../components/widgets/HeatGauge";
import LocationWidget from "../components/widgets/LocationWidget";
import AdvisoryWidget from "../components/widgets/AdvisoryWidget";
import BriefingsWidget from "../components/widgets/BriefingsWidget/BriefingsWidget";
import HeatClockWidget from "../components/widgets/HeatClockWidget/HeatClockWidget";
import ErrorWidget from "../components/widgets/ErrorWidget";
import LoginModal from "../components/login/LoginModal";

function Dashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [userData, setUserData] = useState(null);


  // Check for existing user data in localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
      setShowLogin(false);
    }
  }, []);

  // Handle login modal confirm
  const handleLoginConfirm = (data) => {
    console.log("User Data:", data);
    setUserData(data);
    setShowLogin(false);

    // Persist user data locally
    localStorage.setItem("userData", JSON.stringify(data));
  };


  // Get user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          };
          setUserLocation(location);
          console.log("User location:", location); 
        },
        (err) => {
          console.warn("Geolocation error:", err);
          setError("Unable to access your location");
        }
      );
    }
  }, []);


  // Find nearest barangay and fetch detailed data
  useEffect(() => {
    async function fetchNearestBarangayData() {
      try {
        if (!userLocation) return;

        // Fetch nearest barangay using user location
        const res = await fetch(
          `/api/barangays/nearest?lat=${userLocation.lat}&lon=${userLocation.lon}`
        );

        if (!res.ok) throw new Error("Failed to fetch nearest barangay");

        const nearestData = await res.json();
        setWeatherData(nearestData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    fetchNearestBarangayData();
  }, [userLocation]);

  if (error) return (
    <div className="dashboard error-dashboard">
      <ErrorWidget
        children={
          <span className="error-text">Error: {error}</span>
        }
      />
    </div>
  );

  if (!userData) {
    return (
      <div className="dashboard error-dashboard">
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onConfirm={handleLoginConfirm}
        />
        <ErrorWidget
          children={<span className="error-text">Please log in to continue</span>}
        />
        
      </div>
    );
  }

  if (!weatherData) return (
    <div className="dashboard error-dashboard">
      <ErrorWidget
        children={
          <span className="error-text">Loading dashboard...</span>} />
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onConfirm={handleLoginConfirm}
        />
    </div>
  );

  const {
    barangay,
    locality,
    province,
    current: { temperature, humidity, wind_speed, uv_index, heat_index, risk_level, updated_at },
    daily_briefing: { advice },
  } = weatherData;

  return (
    <div className="dashboard">
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onConfirm={handleLoginConfirm}
      />
      <HeatGauge heatIndex={heat_index} timestamp={updated_at} />
      <LocationWidget barangay={barangay} locality={locality} province={province} />
      <AdvisoryWidget heatIndex={heat_index} riskLevel={risk_level} advice={advice} />
      <BriefingsWidget
        temperature={temperature}
        humidity={humidity}
        wind_speed={wind_speed}
        uv_index={uv_index}
      />
      <HeatClockWidget />
    </div>
  );
}

export default Dashboard;
