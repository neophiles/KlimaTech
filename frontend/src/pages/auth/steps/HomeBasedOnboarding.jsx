import { useState } from "react";
import {
  Container,
  Flex,
  VStack,
  HStack,
  Button,
  Heading,
  Image,
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";

function HomeBasedOnboarding({ onComplete, onBack, isLoading }) {
  const [activities, setActivities] = useState([]);
  const [preferredTimes, setPreferredTimes] = useState([]);
  const [errors, setErrors] = useState({});

  const activityOptions = [
    "Exercise / Sports",
    "Errands / Groceries / Palengke",
    "Walking kids/pets",
    "I rarely go out",
  ];

  const timeOptions = [
    "Early Morning (5 AM – 8 AM)",
    "Mid-Morning (9 AM – 11 AM)",
    "Lunchtime (11 AM – 2 PM)",
    "Afternoon (2 PM – 5 PM)",
    "Evening (5 PM onwards)",
  ];

  const toggleOption = (option, current, setter) => {
    setter(
      current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (activities.length === 0) newErrors.activities = "Select at least one activity";
    if (preferredTimes.length === 0) newErrors.times = "Select at least one time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const profileData = {
      activities,
      preferredTimes,
    };

    onComplete(profileData);
  };

  return (
    <Flex h="100%" align="center" justify="center" bg="gray.50">
      <Container maxW="min(90%, 500px)" py="30px">
        <form onSubmit={handleSubmit}>
          <VStack spacing="25px">
            <VStack spacing="10px" align="center">
              <Image src="/logo/PRESKO-name-logo.png" alt="PRESKO Logo" w="80px" />
              <Heading size="lg">Personalize Your Presko</Heading>
              <Text color="gray.600" textAlign="center">
                Tell us about your daily home-based routine
              </Text>
            </VStack>

            {/* Outdoor activities */}
            <FormControl isInvalid={!!errors.activities}>
              <FormLabel fontWeight="600">Do you have regular outdoor activities?</FormLabel>
              <VStack spacing="8px" align="stretch">
                {activityOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => toggleOption(option, activities, setActivities)}
                    colorScheme={activities.includes(option) ? "brand" : "gray"}
                    variant={activities.includes(option) ? "solid" : "outline"}
                    justifyContent="flex-start"
                  >
                    {option}
                  </Button>
                ))}
              </VStack>
              {errors.activities && <Text color="red.500" fontSize="sm" mt="5px">{errors.activities}</Text>}
            </FormControl>

            {/* Preferred times */}
            <FormControl isInvalid={!!errors.times}>
              <FormLabel fontWeight="600">On days you go out, what time do you usually prefer?</FormLabel>
              <VStack spacing="8px" align="stretch">
                {timeOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => toggleOption(option, preferredTimes, setPreferredTimes)}
                    colorScheme={preferredTimes.includes(option) ? "brand" : "gray"}
                    variant={preferredTimes.includes(option) ? "solid" : "outline"}
                    justifyContent="flex-start"
                    h="auto"
                    py="12px"
                  >
                    {option}
                  </Button>
                ))}
              </VStack>
              {errors.times && <Text color="red.500" fontSize="sm" mt="5px">{errors.times}</Text>}
            </FormControl>

            {/* Action buttons */}
            <HStack w="100%" spacing="10px" pt="10px">
              <Button onClick={onBack} variant="outline" flex="1" isDisabled={isLoading}>
                Back
              </Button>
              <Button
                type="submit"
                colorScheme="brand"
                flex="1"
                isLoading={isLoading}
              >
                Complete Setup
              </Button>
            </HStack>
          </VStack>
        </form>
      </Container>
    </Flex>
  );
}

export default HomeBasedOnboarding;
