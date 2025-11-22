import { 
  Box, Flex,
  Heading, Text, Image,
  Button, Icon,
  useColorModeValue,
} from "@chakra-ui/react";

import { Maximize } from "lucide-react";
import api from "../../../api/axios";

function PreskoPopup({ spot, onOpen, setSelectedSpot }) {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const headingColor = useColorModeValue("brand.600", "brand.400");
  const textColor = useColorModeValue("black",  "white");

  const handleMaximizeClick = () => {
    setSelectedSpot(spot);
    onOpen();
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    const baseUrl = api.defaults.baseURL;
    return path.startsWith('http') ? path : `${baseUrl}${path}`;
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
      <Box position="relative">
        {spot.photo_url ? (
          <Image src={getImageUrl(spot.photo_url)} h="125px" w="100%" objectFit="cover" />
        ) : (
          <Box h="125px" w="100%" bg="whiteAlpha.500" gap="10px" />
        )}

        <Button
          size="xs"
          position="absolute"
          top="5px"
          right="5px"
          zIndex="1000"
          colorScheme="brand"
          p="0"
          onClick={handleMaximizeClick}
        >
          <Icon as={Maximize} boxSize={5} />
        </Button>
      </Box>

      <Flex direction="column" gap="5px" w="100%" p="10px">
        <Heading size="sm" color={headingColor}>
          {spot?.name || "Presko Spot"}
        </Heading>
        <Text fontSize="xs" color={textColor}>
          {spot?.type || "Location"}
        </Text>
        <Text fontSize="xs" color={textColor}>
          {spot?.description || ""}
        </Text>
      </Flex>
    </Flex>
  )
}

export default PreskoPopup;