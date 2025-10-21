import React, { useEffect, useState } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import { preskoSpotMarker } from "../../../utils/coolSpotsIcons";

export default function CenterMarker({ isAdding, onCenterChange }) {
  const [center, setCenter] = useState(null);
  useMapEvents({
    move() {
      if (isAdding) {
        const m = this; // map instance
        const c = m.getCenter();
        const coords = [c.lat, c.lng];
        setCenter(coords);
        onCenterChange && onCenterChange(coords);
      }
    }
  });

  if (!isAdding || !center) return null;
  return <Marker position={center} icon={preskoSpotMarker} />;
}