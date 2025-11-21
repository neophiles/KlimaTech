import { useState, useEffect } from "react";
import {
  Flex,
  Spinner,
} from "@chakra-ui/react";
import Clock from "../components/clock/Clock";
import NearestPresko from "../widgets/NearestPresko";
import Greetings from "../widgets/Greetings";
import InitTips from "../components/InitTips/InitTips";
import { useUserLocation } from "../hooks/useUserLocation";
import { fetchnNearestBranch } from "../api/heat";

function Dashboard() {
  const { userLocation, isLoading } = useUserLocation();
  const [barangayId, setBarangayId] = useState(null);
  const [barangayInfo, setBarangayInfo] = useState(null);

  useEffect(() => {
    if (userLocation) {
      fetchnNearestBranch(userLocation.lat, userLocation.lon)
        .then((data) => {
          setBarangayInfo(data);
          setBarangayId(data.id);
        })
        .catch((err) => console.error("Failed to fetch nearest barangay:", err));
    }
  }, [userLocation]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Flex
      justify="center"
      p={["20px", "30px"]}
      h="100%"
    >
      <Flex
        direction="column"
        align="center"
        gap="20px"
        w="min(600px, 95%)"
        h="auto"
      >
        <Greetings 
          barangay={barangayInfo?.barangay || "Mayao Crossing"} 
          locality={barangayInfo?.locality || "Lucena"} 
          province={barangayInfo?.province || "Quezon"} 
        />
        <Clock barangayId={barangayId} />
        <NearestPresko />
        {barangayId && <InitTips barangayId={barangayId} userId={1} />}
      </Flex>
    </Flex>
  );
}

export default Dashboard;