import { useState, useEffect } from "react";

const DEFAULT_LOCATION = { lat: 13.41, lon: 122.56 };
const FALLBACK_LOCATION = { lat: 14.3421, lon: 121.2774 }; // Lucena, Philippines

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setUserLocation(FALLBACK_LOCATION);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lon: longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        console.error("Error getting user location:", err);
        setError(err.message);
        setUserLocation(FALLBACK_LOCATION);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, []);

  return { userLocation, isLoading, error };
}
