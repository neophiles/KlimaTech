import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { preskoIcon } from './map/utils/mapIcons';
import { Flex } from '@chakra-ui/react';

// Component to handle map center updates
function MapCenterUpdater({ location }) {
  const map = useMap();
  
  useEffect(() => {
    if (location?.lat && location?.lon) {
      map.setView([location.lat, location.lon], 13);
    }
  }, [location, map]);

  return null;
}

function Minimap({ location }) {
  const defaultCenter = [14.5995, 120.9842];
  const center = location && location.lat && location.lon ? [location.lat, location.lon] : defaultCenter;

  useEffect(() => {
    console.log("Minimap received location:", location, "calculated center:", center);
  }, [location, center]);

  return (
    <Flex direction="column" h="100%" w="100%">
      <Flex h="100%" w="100%" position="relative">
        <MapContainer
          key={`${center[0]}-${center[1]}`}
          center={center}
          zoom={13}
          dragging={false}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='<a href="https://www.openstreetmap.org/copyright"></a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapCenterUpdater location={location} />

          <Marker
            key={`marker-${center[0]}-${center[1]}`}
            position={center}
            icon={preskoIcon}
          />
        </MapContainer>
      </Flex>
    </Flex>
  );
}

export default Minimap;
