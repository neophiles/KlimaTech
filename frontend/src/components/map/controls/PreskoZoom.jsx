import { useEffect } from "react";
import { useMap } from "react-leaflet";

function PreskoZoom({ preskoLocation }) {
  const map = useMap();

  useEffect(() => {
    if (preskoLocation) {
      map.flyTo(preskoLocation, 16, {
        duration: 0.5,
      });
    }
  }, [preskoLocation, map]);

  return null;
}

export default PreskoZoom;
