import { useState, useEffect } from "react";

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => console.warn("Geolocation error:", err)
    );
  }, []);

  return userLocation;
}