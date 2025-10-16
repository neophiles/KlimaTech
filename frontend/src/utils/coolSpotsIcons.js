import L from "leaflet";
import youIcon from "/icons_png/you-icon.png";

export const userIcon = new L.Icon({
  iconUrl: youIcon,
  iconSize: [30, 35],
  iconAnchor: [10, 40],
  popupAnchor: [1, -35],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [40, 40],
});