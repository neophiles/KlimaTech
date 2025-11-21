import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../components/map/styles/map.css";

import MarkerClusterGroup from 'react-leaflet-markercluster';
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import Recenter from "../components/map/controls/Recenter";
import AddPreskoButton from "../components/map/buttons/AddPreskoButton";
import UserZoomButton from "../components/map/buttons/UserZoomButton";
import PreskoPopup from "../components/map/views/PreskoPopup";
import PreskoModal from "../components/map/views/PreskoModal";
import PreskoZoom from "../components/map/controls/PreskoZoom";

import {
  Box, VStack,
  useDisclosure,
} from "@chakra-ui/react";

import preskospots from "../components/map/data/preskospots.json";
import { userIcon, preskoIcon } from "../components/map/utils/mapIcons";
import { useUserLocation } from "../hooks/useUserLocation";

function Map() {
  const { userLocation } = useUserLocation();

  // For PreskoModal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSpot, setSelectedSpot] = useState(null);

  // For PreskoZoom
  const [preskoZoomLocation, setPreskoZoomLocation] = useState(null);
  const [searchParams] = useSearchParams();

  // Get preskoLocation from URL params if available
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    if (lat && lon) {
      setPreskoZoomLocation([parseFloat(lat), parseFloat(lon)]);
    }
  }, [searchParams]);

  const mapCenter = userLocation ? 
    [userLocation.lat, userLocation.lon] : 
    [13.9414, 121.6235];

  return (
    <Box w="100%" h="100%">
      <MapContainer
        center={mapCenter}
        zoom={13}
        minZoom={5}
        zoomControl={false}
        maxBounds={[[4, 116], [21, 127]]}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* User's location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lon]}
            icon={userIcon}
          >
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {/* PreskoSpot markers */}
        <MarkerClusterGroup>
          {preskospots.map((spot) => (
            <Marker
              key={`${spot.lat}-${spot.long}`}
              position={[spot.lat, spot.long]}
              icon={preskoIcon}
            >
              <Popup>
                <PreskoPopup spot={spot} onOpen={onOpen} setSelectedSpot={setSelectedSpot} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <ZoomControl position="topright" />

        {/* Zoom to PreskoSpot if location passed via URL params */}
        {preskoZoomLocation && <PreskoZoom preskoLocation={preskoZoomLocation} />}

        {/* {userLocation && <Recenter position={userLocation} />} */}
        
        {/* Map Buttons */}
        <VStack
          position="absolute"
          bottom="30px"
          right="10px"
          zIndex="1000"
        >
          {userLocation && <UserZoomButton userLocation={[userLocation.lat, userLocation.lon]} />}
          <AddPreskoButton />
        </VStack>
      </MapContainer>

      {/* PreskoModal */}
      <PreskoModal isOpen={isOpen} onClose={onClose} spot={selectedSpot} />
    </Box>
  );
}

export default Map;
