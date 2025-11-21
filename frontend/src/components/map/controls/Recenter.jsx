import { useEffect } from "react";
import { useMap } from "react-leaflet";

function Recenter({ position }) {
  const map = useMap();

  useEffect(() => {
    console.log("Recentering map to:", position);
    
    setTimeout(() => {
      map.setView(position, 16);
    }, 1000);
    
  }, [position]);

  return null;
}

export default Recenter;