import {
  Container,
  Flex,
  VStack,
  Button,
  Heading,
  Image,
  SimpleGrid,
  Box,
  Text,
  Icon,
} from "@chakra-ui/react";
import { 
  GraduationCap,
  CloudSun,
  LampDesk,
  House,
} from "lucide-react";

function UserTypeSelection({ onSelect, onBack }) {
  const userTypes = [
    {
      id: "student",
      label: "Student",
      description: "I attend school or university",
      icon: GraduationCap,
    },
    {
      id: "outdoor_worker",
      label: "Outdoor Worker",
      description: "I work primarily outdoors",
      icon: CloudSun,
    },
    {
      id: "office_worker",
      label: "Office Worker",
      description: "I work in an office setting",
      icon: LampDesk,
    },
    {
      id: "home_based",
      label: "Home-Based",
      description: "I work or stay mostly at home",
      icon: House,
    },
  ];

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container maxW="min(90%, 600px)" pt="50px" pb="200px">
        <VStack spacing="20px">
          <VStack spacing="10px" align="center">
            <Image src="/logo/PRESKO-name-logo.png" alt="PRESKO Logo" w="100px" />
            <Heading size="lg" textAlign="center">
              Who are you?
            </Heading>
            <Text textAlign="center" color="gray.600">
              Select the option that best describes your daily routine
            </Text>
          </VStack>

          <SimpleGrid columns={[1, 2]} spacing="15px" w="100%">
            {userTypes.map((type) => (
              <Button
                key={type.id}
                onClick={() => onSelect(type.id)}
                h="auto"
                p="10px"
                variant="outline"
                borderWidth="2px"
                borderColor="brand.200"
                _hover={{
                  borderColor: "brand.500",
                  bg: "brand.50",
                }}
                _active={{
                  borderColor: "brand.500",
                  bg: "brand.100",
                }}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap="10px"
              >
                <Icon as={type.icon} boxSize={7} />
                <Text fontWeight="600" fontSize="md">
                  {type.label}
                </Text>
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  {type.description}
                </Text>
              </Button>
            ))}
          </SimpleGrid>

          <Button
            variant="outline"
            borderColor="gray.500"
            w="100%"
            mt="10px"
            onClick={onBack}
            
          >
            Back
          </Button>
        </VStack>
      </Container>
    </Flex>
  );
}

export default UserTypeSelection;
