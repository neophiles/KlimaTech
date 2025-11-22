import { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import { preskoIcon } from "../utils/mapIcons";

function LocationPicker({ isPicking, pickedLocation, onLocationPicked }) {
  const map = useMap();
  const [mapCenter, setMapCenter] = useState(null);
  const callbackRef = useRef(onLocationPicked);

  // Update callback ref whenever onLocationPicked changes
  useEffect(() => {
    callbackRef.current = onLocationPicked;
  }, [onLocationPicked]);

  useEffect(() => {
    if (!isPicking || !map) return;

    // Set initial center when picking starts
    const initialCenter = map.getCenter();
    const initialLocation = { lat: initialCenter.lat, lon: initialCenter.lng };
    setMapCenter({ lat: initialCenter.lat, lng: initialCenter.lng });
    callbackRef.current(initialLocation);

    // Update marker position when map is moved
    const handleMove = () => {
      const center = map.getCenter();
      setMapCenter({ lat: center.lat, lng: center.lng });
      callbackRef.current({ lat: center.lat, lon: center.lng });
    };

    map.on("move", handleMove);

    return () => {
      map.off("move", handleMove);
    };
  }, [isPicking, map]);

  if (!isPicking || !mapCenter) return null;

  return (
    <Marker position={[mapCenter.lat, mapCenter.lng]} icon={preskoIcon}>
      <Popup>
        <strong>Pinned Location</strong>
        <br />
        Lat: {mapCenter.lat.toFixed(6)}
        <br />
        Lng: {mapCenter.lng.toFixed(6)}
      </Popup>
    </Marker>
  );
}

export default LocationPicker;
