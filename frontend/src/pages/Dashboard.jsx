import { useEffect, useState } from "react";
import HeatGauge from "../components/HeatGauge";
import LocationWidget from "../components/LocationWidget";
import AdvisoryWidget from "../components/AdvisoryWidget";
import BriefingsWidget from "../components/BriefingsWidget";
import HeatClockWidget from "../components/HeatClockWidget";

// computes distance between two lat/lon points (in km)
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function Dashboard() {
  const [weatherData, setWeatherData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);

  // Get user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
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

        // Fetch all barangays first
        const res = await fetch("/api/barangays/all");
        const barangays = await res.json();

        // Find the nearest one
        let nearest = barangays[0];
        let minDist = getDistance(
          userLocation.lat,
          userLocation.lon,
          nearest.lat,
          nearest.lon
        );

        for (let b of barangays) {
          const dist = getDistance(
            userLocation.lat,
            userLocation.lon,
            b.lat,
            b.lon
          );
          if (dist < minDist) {
            minDist = dist;
            nearest = b;
          }
        }

        console.log("Nearest barangay:", nearest.barangay, `${minDist.toFixed(2)} km`);

        // Fetch the full detail for that barangay
        const detailRes = await fetch(`/api/barangays/${nearest.id}`);
        const detailData = await detailRes.json();
        setWeatherData(detailData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    }

    fetchNearestBarangayData();
  }, [userLocation]);

  if (error) return <div>Error: {error}</div>;
  if (!weatherData) return <div>Loading dashboard...</div>;

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
