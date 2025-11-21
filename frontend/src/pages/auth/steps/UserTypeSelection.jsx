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
  Center,
} from "@chakra-ui/react";

function UserTypeSelection({ onSelect, onBack }) {
  const userTypes = [
    {
      id: "student",
      label: "Student",
      description: "I attend school or university",
      icon: "🎓",
    },
    {
      id: "outdoor_worker",
      label: "Outdoor Worker",
      description: "I work primarily outdoors",
      icon: "🏗️",
    },
    {
      id: "office_worker",
      label: "Office Worker",
      description: "I work in an office setting",
      icon: "🏢",
    },
    {
      id: "home_based",
      label: "Home-Based",
      description: "I work or stay mostly at home",
      icon: "🏠",
    },
  ];

  return (
    <Flex h="100%" align="center" justify="center">
      <Container maxW="min(90%, 600px)" py="30px">
        <VStack spacing="30px">
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
                <Box fontSize="40px">{type.icon}</Box>
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
            onClick={onBack}
            variant="outline"
            w="100%"
            mt="10px"
          >
            Back
          </Button>
        </VStack>
      </Container>
    </Flex>
  );
}

export default UserTypeSelection;
