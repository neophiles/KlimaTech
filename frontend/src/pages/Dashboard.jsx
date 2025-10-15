import { useEffect, useState } from "react";
import HeatGauge from "../components/widgets/HeatGauge";
import LocationWidget from "../components/widgets/LocationWidget";
import AdvisoryWidget from "../components/widgets/AdvisoryWidget";
import BriefingsWidget from "../components/widgets/BriefingsWidget/BriefingsWidget";
import HeatClockWidget from "../components/widgets/HeatClockWidget/HeatClockWidget";
import ErrorWidget from "../components/widgets/ErrorWidget";

function Dashboard({ userData }) {
  const [weatherData, setWeatherData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  // Set userLocation when userData is available
  useEffect(() => {
    if (userData?.lat && userData?.lon) {
      setUserLocation({ lat: userData.lat, lon: userData.lon });
    }
  }, [userData]);

  // Fetch nearest barangay data
  useEffect(() => {
    async function fetchNearestBarangayData() {
      try {
        if (!userLocation) return;

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

  if (error)
    return (
      <div className="dashboard error-dashboard">
        <ErrorWidget children={<span className="error-text">Error: {error}</span>} />
      </div>
    );

  if (!userData)
    return (
      <div className="dashboard error-dashboard">
        <ErrorWidget
          children={<span className="error-text">Please log in to continue</span>}
        />
      </div>
    );

  if (!weatherData)
    return (
      <div className="dashboard error-dashboard">
        <ErrorWidget children={<span className="error-text">Loading dashboard...</span>} />
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
