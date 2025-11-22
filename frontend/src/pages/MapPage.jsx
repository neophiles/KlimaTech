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
import AddPreskoModal from "../components/map/views/AddPreskoModal";
import LocationPicker from "../components/map/controls/LocationPicker";
import LocationPickerPanel from "../components/map/controls/LocationPickerPanel";
import PreskoZoom from "../components/map/controls/PreskoZoom";

import {
  Box, VStack,
  useDisclosure,
} from "@chakra-ui/react";

import { userIcon, preskoIcon } from "../components/map/utils/mapIcons";
import { useUserLocation } from "../hooks/useUserLocation";
import api from "../api/axios";
import UserPopup from "../components/map/views/UserPopup";

function Map() {
  const { userLocation } = useUserLocation();

  // For PreskoModal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedSpot, setSelectedSpot] = useState(null);

  // For AddPreskoModal
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  // For Location Picker
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(null);

  // For PreskoZoom
  const [preskoZoomLocation, setPreskoZoomLocation] = useState(null);
  const [searchParams] = useSearchParams();

  // For preskospots data
  const [preskospots, setPreskospots] = useState([]);

  // Get preskoLocation from URL params if available
  useEffect(() => {
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    if (lat && lon) {
      setPreskoZoomLocation([parseFloat(lat), parseFloat(lon)]);
    }
  }, [searchParams]);

  // Fetch coolspots from backend
  useEffect(() => {
    const fetchCoolspots = async () => {
      try {
        const response = await api.get("/coolspots/all");
        setPreskospots(response.data);
      } catch (error) {
        console.error("Error fetching coolspots:", error);
        // Fall back to empty array if API fails
        setPreskospots([]);
      }
    };

    fetchCoolspots();
  }, []);

  const handleStartPicking = () => {
    setIsPickingLocation(true);
    setPickedLocation(null);
  };

  const handleLocationPicked = (location) => {
    setPickedLocation(location);
  };

  const handleConfirmLocation = () => {
    if (pickedLocation) {
      setIsPickingLocation(false);
      onAddOpen();
    }
  };

  const handleCancelPicking = () => {
    setIsPickingLocation(false);
    setPickedLocation(null);
  };

  const handlePreskoAdded = async (newSpot) => {
    // Refresh the list of preskospots
    try {
      const response = await api.get("/coolspots/all");
      setPreskospots(response.data);
    } catch (error) {
      console.error("Error refreshing coolspots:", error);
    }
  };

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
              <UserPopup />
            </Popup>
          </Marker>
        )}

        {/* PreskoSpot markers */}
        <MarkerClusterGroup>
          {preskospots.map((spot, index) => (
            <Marker
              key={spot.id || `${spot.lat}-${spot.lon}-${index}`}
              position={[spot.lat, spot.lon]}
              icon={preskoIcon}
            >
              <Popup>
                <PreskoPopup spot={spot} onOpen={onOpen} setSelectedSpot={setSelectedSpot} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {/* Location Picker - shows marker when picking */}
        <LocationPicker
          isPicking={isPickingLocation}
          pickedLocation={pickedLocation}
          onLocationPicked={handleLocationPicked}
        />

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
          <AddPreskoButton onStartPicking={handleStartPicking} />
        </VStack>

        {/* Location Picker Panel */}
        <LocationPickerPanel
          isPicking={isPickingLocation}
          onConfirm={handleConfirmLocation}
          onCancel={handleCancelPicking}
        />

      </MapContainer>

      {/* PreskoModal */}
      <PreskoModal isOpen={isOpen} onClose={onClose} spot={selectedSpot} />

      {/* AddPreskoModal */}
      <AddPreskoModal 
        isOpen={isAddOpen} 
        onClose={onAddClose} 
        userLocation={pickedLocation}
        onPreskoAdded={handlePreskoAdded}
      />
    </Box>
  );
}

export default Map;
