import { useEffect, useState } from "react";
import ErrorWidget from "../components/widgets/ErrorWidget";
import Clock from "../components/Clock/Clock";
import NearestPreskoSpotWidget from "../components/widgets/NearestPreskoSpotWidget/NearestPreskoSpotWidget";
import GreetingWidget from "../components/widgets/GreetingWidget/GreetingWidget";
import InitTipsWidget from "../components/widgets/InitTipsWidget/InitTipsWidget";

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

      <GreetingWidget
        username={userData.username}
        barangay={barangay}
        locality={locality}
        province={province}
      />

      <Clock />

      <NearestPreskoSpotWidget userLocation={userLocation} />


      <InitTipsWidget barangayId={userLocation?.barangay_id} />


    </div>
  );
}

export default Dashboard;
