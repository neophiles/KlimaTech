import {
  Flex, Spacer,
  Text, Icon,
  useColorModeValue, useToken,
} from "@chakra-ui/react";
import { MapPin } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

function Greetings({ barangay, locality, province }) {
    const { user } = useAuth();
    const currentTime = new Date().getHours();

    const greeting = 
        currentTime >= 5 && currentTime < 12 ? "Good morning" :
        currentTime >= 12 && currentTime < 18 ? "Good afternoon" :
        currentTime >= 18 && currentTime < 22 ? "Good evening" :
        "Good night";

    const displayName =
        user?.username && user.username.trim().length > 0
        ? user.username
        : "User";

    const colorToken = useColorModeValue("brand.500", "brand.200");

    const [brandColor] = useToken("colors", [colorToken]);

    const bgWithOpacity = `${brandColor}80`;

    return (
        <Flex w="100%" align="center">
          <Flex direction="column">
              <Text fontSize={["xs", "sm"]} lineHeight="shorter">{greeting},</Text>
              <Text fontSize={["sm", "md"]} as="b" lineHeight="shorter">{displayName}!</Text>
          </Flex>
          <Spacer />
          <Flex
            align="center"
            gap="5px"
            border="3px solid"
            borderColor={bgWithOpacity}
            borderRadius="lg"
            px="10px"
            py="5px"
          >
            <Icon as={MapPin} boxSize={6} color={colorToken} />
            <Flex direction="column">
                <Text fontSize={["sm", "md"]} as="b" lineHeight="shorter">{barangay}</Text>
                <Text fontSize={["xs", "sm"]} lineHeight="shorter">{locality}, {province}</Text>
            </Flex>
          </Flex>   
        </Flex>
    );
}

export default Greetings;