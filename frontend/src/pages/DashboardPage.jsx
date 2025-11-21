import {
  Flex,
} from "@chakra-ui/react";
import Clock from "../components/clock/Clock";
import NearestPresko from "../widgets/NearestPresko";
import Greetings from "../widgets/Greetings";
import InitTips from "../components/InitTips/InitTips";

function Dashboard() {
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
        <Greetings barangay="Mayao Crossing" locality="Lucena" province="Quezon" />
        <Clock />
        <NearestPresko />
        <InitTips barangayId={1} userId={1} />
      </Flex>
    </Flex>
  );
}

export default Dashboard;