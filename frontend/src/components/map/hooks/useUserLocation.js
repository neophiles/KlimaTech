import { useState, useEffect, useCallback } from "react";

/**
 * Provides user location with fallback and retry.
 */
export default function useUserLocation({ fallback = { lat: 13.41, lon: 122.56 } } = {}) {
  const [userLocation, setUserLocation] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const ask = useCallback(() => {
    setReady(false);
    setError(null);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude });
          setReady(true);
        },
        (err) => {
          console.warn("geolocation error", err);
          setError(err.message || "Geolocation failed");
          setUserLocation(fallback);
          setReady(true);
        },
        { timeout: 10000 }
      );
    } else {
      setError("Geolocation not available");
      setUserLocation(fallback);
      setReady(true);
    }
  }, [fallback]);

  useEffect(() => {
    ask();
  }, [ask]);

  return { userLocation, ready, error, retry: ask };
}