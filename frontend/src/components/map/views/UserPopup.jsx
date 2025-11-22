import { 
  Box, Flex,
  Heading, Text, Image,
  Button, Icon,
  useColorModeValue,
} from "@chakra-ui/react";

function UserPopup() {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("black",  "white");

  return (
    <Flex
      w="50px"
      outline="black"
      direction="column"
      borderRadius="10px"
      bg={bgColor}
      boxShadow="md"
      p="10px"
      textAlign="center"
    >
      <Text color={textColor}>You</Text>
    </Flex>
  )
}

export default UserPopup;