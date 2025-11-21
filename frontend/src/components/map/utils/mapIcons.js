import { Icon } from "leaflet";

import youPNG from "../../../assets/icons/you-icon.png";
import preskoPNG from "../../../assets/icons/presko-icon.png";

delete L.Icon.Default.prototype._getIconUrl;

const userIcon = new Icon({
  iconUrl: youPNG,
  iconSize: [20, 20],
  iconAnchor: [10, 10], // <-- Change this to perfectly center
  popupAnchor: [0, -10]  // <-- Adjust popup anchor to match center
});

const preskoIcon = new Icon({
  iconUrl: preskoPNG,
  iconSize: [25, 40], 
  iconAnchor: [14, 40],
  popupAnchor: [0, -40]
});

export { userIcon, preskoIcon };