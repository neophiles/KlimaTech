import { useNavigate } from "react-router-dom";
import {
  Flex, VStack, HStack,
  Button,
  Heading, Text,
  Avatar,
  Divider,
  useColorModeValue,
  Alert, AlertIcon,
  Icon,
} from "@chakra-ui/react";
import { 
  GraduationCap,
  CloudSun,
  LampDesk,
  House,
  UserRound,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthProvider";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const cardBg = useColorModeValue("white", "gray.600");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Format user type display
  const formatUserType = (userType) => {
    const types = {
      student: "Student",
      outdoor_worker: "Outdoor Worker",
      office_worker: "Office Worker",
      home_based: "Home-Based",
    };
    return types[userType] || userType;
  };

  // Get user type icon
  const getUserTypeIcon = (userType) => {
    const icons = {
      student: GraduationCap,
      outdoor_worker: CloudSun,
      office_worker: LampDesk,
      home_based: House,
    };
    return icons[userType] || UserRound;
  };

  return (
    <>
      <Flex
        direction="column"
        align="start"
        gap="15px"
        w="100%"
        p="15px"
        bg={bgColor}
        borderRadius="lg"
      >
        <VStack spacing="5px" align="center" w="100%">
          <Avatar
            size="xl"
            name={user?.username || "User"}
            bg="brand.400"
          />
          <Heading size="lg">{user?.username || "User"}</Heading>
          <HStack spacing="5px">
            <Icon as={getUserTypeIcon(user?.user_type)} boxSize={5} />
            <Text fontSize="md" color="gray.600" fontWeight="500">
              {formatUserType(user?.user_type)}
            </Text>
          </HStack>
        </VStack>

        <Divider />

        <VStack spacing="8px" w="100%" align="start" fontSize="sm">
          <Flex justify="space-between" w="100%">
            <Text fontWeight="600" color="gray.600">User ID:</Text>
            <Text>{user?.id || "N/A"}</Text>
          </Flex>
          <Flex justify="space-between" w="100%">
            <Text fontWeight="600" color="gray.600">User Type:</Text>
            <Text>{formatUserType(user?.user_type)}</Text>
          </Flex>
          {user?.lat && user?.lon && (
            <Flex justify="space-between" w="100%">
              <Text fontWeight="600" color="gray.600">Location:</Text>
              <Text fontSize="xs">{user.lat.toFixed(4)}, {user.lon.toFixed(4)}</Text>
            </Flex>
          )}
        </VStack>
      </Flex>

      <Flex
        direction="column"
        align="start"
        gap="15px"
        w="100%"
        p="15px"
        bg={bgColor}
        borderRadius="lg"
      >
        <Heading size="sm" mb="5px">ACCOUNT ACTIONS</Heading>
        <Button
          w="100%"
          colorScheme="red"
          variant="outline"
          leftIcon={<LogOut size={18} />}
          onClick={handleLogout}
          justifyContent="flex-start"
        >
          Logout
        </Button>
      </Flex>

      <Alert
        status="info"
        variant="subtle"
        flexDirection="column"
        alignItems="flex-start"
        borderRadius="lg"
      >
        <Flex alignItems="center" mb="8px">
          <AlertIcon mr="8px" />
          <Heading size="sm">Profile Information</Heading>
        </Flex>
        <Text fontSize="sm">
          Your profile information is based on your registration details. 
          To update your user type or personalization settings, please contact support or create a new account.
        </Text>
      </Alert>
    </>
  );
}

export default Profile;
