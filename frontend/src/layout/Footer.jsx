import { 
  Flex,
  Text, Icon,
  useColorModeValue,
  Button,
} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
import { House, Map, Settings, } from "lucide-react"

function Footer({ bgColor }) {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <Flex 
        as="footer"
        bg={bgColor}
        h={["50px", "60px", "70px"]}
        px={["20px", "30px"]}
        py="10px"
        justify="center"
    >
      <Flex 
        align="center"
        justify="center"
        gap="10px"
        w="min(600px, 95%)"
      >
        <Button
          flex="1"
          variant="ghost"
          flexDirection="column"
          p="0"
          colorScheme="brand"
          _hover={{ bg: "transparent" }}
          onClick={() => navigate("/")}
        >

            <Icon as={House} boxSize={5} />
            <Text fontSize="xs">Home</Text>

        </Button>
        <Button
          flex="1"
          variant="ghost"
          flexDirection="column"
          p="0"
          colorScheme="brand"
          _hover={{ bg: "transparent" }}
          onClick={() => navigate("/map")}
        >

            <Icon as={Map} boxSize={5} />
            <Text fontSize="xs">PreskoSpots</Text>

        </Button>
        <Button
          flex="1"
          variant="ghost"
          flexDirection="column"
          p="0"
          colorScheme="brand"
          _hover={{ bg: "transparent" }}
          onClick={() => navigate("/settings")}
        >

            <Icon as={Settings} boxSize={5} />
            <Text fontSize="xs">Settings</Text>

        </Button>
      </Flex>
    </Flex>
  )
}

export default Footer;
