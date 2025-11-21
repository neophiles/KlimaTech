import { Button, Icon } from "@chakra-ui/react";
import { UserSearch } from "lucide-react";
import { useMap } from "react-leaflet";

function UserZoomButton({ userLocation }) {
  const map = useMap();

  const flyToUser = () => {
    if (userLocation) {
      map.flyTo(userLocation, 16, {
        duration: 0.5,
      })
    }
  };

  return (
    <Button
      colorScheme="brand"
      p="0"
      onClick={flyToUser}
      disabled={!userLocation}
    >
      <Icon as={UserSearch} boxSize={5} />
    </Button>
  );
}

export default UserZoomButton;
