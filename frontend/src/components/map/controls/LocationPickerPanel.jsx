import {
  Box, VStack, HStack, 
  Heading, Text, Button, Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { MapPin } from "lucide-react";

function LocationPickerPanel({ isPicking, onConfirm, onCancel }) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (!isPicking) return null;

  return (
    <Box
      position="absolute"
      bottom="30px"
      left="50%"
      transform="translateX(-50%)"
      bg={bgColor}
      borderWidth={1}
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="lg"
      p={4}
      zIndex="9999"
      minW="300px"
      maxW="400px"
    >
      <VStack spacing={3} align="stretch">
        <HStack spacing={2}>
          <Icon as={MapPin} color="brand.500" boxSize={5} />
          <Heading size="sm">Pick Location</Heading>
        </HStack>

        <Text fontSize="sm" color="gray.600" textAlign="center">
          Drag the map to center the marker on your desired location
        </Text>

        {/* Action Buttons */}
        <HStack spacing={2} w="100%">
          <Button
            variant="outline"
            onClick={onCancel}
            w="50%"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={onConfirm}
            w="50%"
            size="sm"
          >
            Confirm Location
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

export default LocationPickerPanel;
