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
  SimpleGrid,
  Input,
} from "@chakra-ui/react";

function OfficeWorkerOnboarding({ onComplete, onBack, isLoading }) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [workHours, setWorkHours] = useState({ start: "", end: "" });
  const [commuteType, setCommuteType] = useState("");
  const [lunchHabit, setLunchHabit] = useState("");
  const [errors, setErrors] = useState({});

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const commuteOptions = [
    "Walk / Bike",
    "Public Transport (Jeepney, Bus, MRT/LRT)",
    "Private Vehicle / Ride-sharing",
  ];
  const lunchOptions = [
    "Yes, I walk/commute out",
    "No, I eat inside the building / bring baon",
  ];

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (selectedDays.length === 0) newErrors.days = "Select at least one day";
    if (!workHours.start || !workHours.end) newErrors.hours = "Set working hours";
    if (!commuteType) newErrors.commute = "Select a commute type";
    if (!lunchHabit) newErrors.lunch = "Select a lunch habit";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const profileData = {
      selectedDays,
      workHours,
      commuteType,
      lunchHabit,
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
                Tell us about your office work routine
              </Text>
            </VStack>

            {/* Days in office */}
            <FormControl isInvalid={!!errors.days}>
              <FormLabel fontWeight="600">Which days do you usually go to the office?</FormLabel>
              <SimpleGrid columns={3} spacing="8px">
                {days.map((day) => (
                  <Button
                    key={day}
                    onClick={() => toggleDay(day)}
                    colorScheme={selectedDays.includes(day) ? "brand" : "gray"}
                    variant={selectedDays.includes(day) ? "solid" : "outline"}
                    size="sm"
                  >
                    {day}
                  </Button>
                ))}
              </SimpleGrid>
              {errors.days && <Text color="red.500" fontSize="sm" mt="5px">{errors.days}</Text>}
            </FormControl>

            {/* Working hours */}
            <FormControl isInvalid={!!errors.hours}>
              <FormLabel fontWeight="600">What are your usual working hours?</FormLabel>
              <HStack spacing="10px">
                <Input
                  type="time"
                  value={workHours.start}
                  onChange={(e) => setWorkHours({ ...workHours, start: e.target.value })}
                />
                <Text>to</Text>
                <Input
                  type="time"
                  value={workHours.end}
                  onChange={(e) => setWorkHours({ ...workHours, end: e.target.value })}
                />
              </HStack>
              {errors.hours && <Text color="red.500" fontSize="sm" mt="5px">{errors.hours}</Text>}
            </FormControl>

            {/* Commute type */}
            <FormControl isInvalid={!!errors.commute}>
              <FormLabel fontWeight="600">How do you usually commute to work?</FormLabel>
              <VStack spacing="8px" align="stretch">
                {commuteOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => setCommuteType(commuteType === option ? "" : option)}
                    colorScheme={commuteType === option ? "brand" : "gray"}
                    variant={commuteType === option ? "solid" : "outline"}
                    justifyContent="flex-start"
                    h="auto"
                    py="12px"
                  >
                    {option}
                  </Button>
                ))}
              </VStack>
              {errors.commute && <Text color="red.500" fontSize="sm" mt="5px">{errors.commute}</Text>}
            </FormControl>

            {/* Lunch habit */}
            <FormControl isInvalid={!!errors.lunch}>
              <FormLabel fontWeight="600">Do you usually go out for lunch?</FormLabel>
              <VStack spacing="8px" align="stretch">
                {lunchOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => setLunchHabit(lunchHabit === option ? "" : option)}
                    colorScheme={lunchHabit === option ? "brand" : "gray"}
                    variant={lunchHabit === option ? "solid" : "outline"}
                    justifyContent="flex-start"
                    h="auto"
                    py="12px"
                  >
                    {option}
                  </Button>
                ))}
              </VStack>
              {errors.lunch && <Text color="red.500" fontSize="sm" mt="5px">{errors.lunch}</Text>}
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

export default OfficeWorkerOnboarding;
