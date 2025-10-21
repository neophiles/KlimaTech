import L from "leaflet";
import youIcon from "/icons_png/you-icon.png";
import preskoSpotIcon from "/icons_png/preskospot-marker.png";

export const userIcon = new L.Icon({
  iconUrl: youIcon,
  iconSize: [15, 15],
  iconAnchor: [7.5, 15],
  popupAnchor: [1, -10],
});

export const preskoSpotMarker = new L.Icon({
  iconUrl: preskoSpotIcon,
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -25],
  shadowSize: [41, 41]
});