import { Box, Flex, Grid, Heading, Text, HStack, Button, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Minimap from "../components/Minimap";
import { useUserLocation } from "../hooks/useUserLocation";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function NearestPresko() {
  const navigate = useNavigate();
  const { userLocation, isLoading: locationLoading } = useUserLocation();
  const [spots, setSpots] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const headingColor = useColorModeValue("brand.600", "brand.400");

  // Fetch nearest PreskoSpots
  useEffect(() => {
    if (!userLocation?.lat || !userLocation?.lon) return;

    const fetchSpots = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/coolspots/preskospots/nearest?lat=${userLocation.lat}&lon=${userLocation.lon}`
        );
        if (!res.ok) throw new Error("Failed to fetch Presko spots");
        const data = await res.json();
        console.log("API Response:", data);
        console.log("First spot:", data.spots?.[0]);
        setSpots(data.spots || []);
        setCurrentIndex(0);
        setError(null);
      } catch (err) {
        console.error("Error fetching Presko spots:", err);
        setError(err.message);
      }
    };

    fetchSpots();
  }, [userLocation]);

  const currentSpot = spots[currentIndex];

  const handleNextSpot = () => {
    if (currentIndex < spots.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleGoToMap = () => {
    if (currentSpot) {
      navigate(`/map?lat=${currentSpot.lat}&lon=${currentSpot.lon}`);
    }
  };

  return (
    <Flex
      w="100%"
      outline="black"
      direction="column"
      borderRadius="10px"
      overflow="hidden"
      bg={bgColor}
      boxShadow="md"
    >
      <Box h="125px" w="100%" bg={bgColor} gap="10px">
        {currentSpot ? (
          <Minimap location={{ lat: currentSpot.lat, lon: currentSpot.lon }} />
        ) : userLocation ? (
          <Minimap location={userLocation} />
        ) : (
          <Minimap location={null} />
        )}
      </Box>

      <Flex direction="column" gap="5px" w="100%" p="10px">
        <Heading size="sm" color={headingColor}>
          Nearest PreskoSpot
        </Heading>
        {error ? (
          <Text fontSize="sm" color="red.500">{error}</Text>
        ) : currentSpot ? (
          <>
            <Text fontSize="sm">
              {currentSpot.name || "PreskoSpot"}
            </Text>
            <Text fontSize="sm">
              {currentSpot.distance ? `${currentSpot.distance.toFixed(2)} km away` : "Distance unknown"}
            </Text>
          </>
        ) : (
          <Text fontSize="sm">Loading spots...</Text>
        )}
      </Flex>

      <HStack w="100%" p="10px">
        <Button
          size={["sm", "md"]}
          w="50%"
          variant="outline"
          colorScheme="brand"
          onClick={handleNextSpot}
          isDisabled={spots.length === 0}
        >
          See Next
        </Button>

        <Button
          size={["sm", "md"]}
          w="50%"
          colorScheme="brand"
          variant="solid"
          onClick={handleGoToMap}
          isDisabled={!currentSpot}
        >
          Go to Map
        </Button>
      </HStack>
    </Flex>
  );
}

export default NearestPresko;