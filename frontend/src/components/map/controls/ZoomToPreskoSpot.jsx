import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function ZoomToPreskoSpot() {
  const location = useLocation();
  const map = useMap();

  useEffect(() => {
    if (location.state?.focusSpot) {
      const { lat, lon } = location.state.focusSpot;
      console.log("Received: ", lat, lon);
      map.flyTo([lat, lon], 18, { duration: 1.2 });
    }
  }, [location.state, map]);

  return null;
}

export default ZoomToPreskoSpot;
