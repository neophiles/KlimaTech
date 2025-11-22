import { Icon } from "leaflet";

import youPNG from "../../../assets/icons/you-icon.png";
import preskoPNG from "../../../assets/icons/presko-icon.png";

delete L.Icon.Default.prototype._getIconUrl;

const userIcon = new Icon({
  iconUrl: youPNG,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});

const preskoIcon = new Icon({
  iconUrl: preskoPNG,
  iconSize: [25, 40], 
  iconAnchor: [14, 40],
  popupAnchor: [0, -40]
});

export { userIcon, preskoIcon };