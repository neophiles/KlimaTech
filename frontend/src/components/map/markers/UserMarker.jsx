import React from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { userIcon } from "../../../utils/coolSpotsIcons";

export default function UserMarker({ userLocation }) {
  const map = useMap();

  if (!userLocation) return null;

  return (
    <Marker
      position={[userLocation.lat, userLocation.lon]}
      icon={userIcon}
      eventHandlers={{
        click: () => {
          const point = map.latLngToContainerPoint([userLocation.lat, userLocation.lon]);
          const offsetLatLng = map.containerPointToLatLng(point);
          map.flyTo(offsetLatLng, map.getZoom(), { animate: true });
        },
      }}
    >
      <Popup className="user-popup" closeButton={false}>
        <strong>You</strong>
      </Popup>
    </Marker>
  );
}