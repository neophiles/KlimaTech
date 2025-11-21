import { useState, useEffect } from "react";
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
  Box,
  Input,
  useCheckbox,
  Checkbox,
  Stack,
} from "@chakra-ui/react";

function StudentOnboarding({ onComplete, onBack, isLoading }) {
  const [selectedDays, setSelectedDays] = useState([]);
  const [commuteType, setCommuteType] = useState("");
  const [classHours, setClassHours] = useState({ start: "", end: "" });
  const [hasOutdoorActivities, setHasOutdoorActivities] = useState(null);
  const [activityHours, setActivityHours] = useState({ start: "", end: "" });
  const [errors, setErrors] = useState({});

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const commuteOptions = ["Walk / Bike", "Public Transport", "Private Vehicle"];

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (selectedDays.length === 0) newErrors.days = "Select at least one day";
    if (!commuteType) newErrors.commute = "Select a commute type";
    if (!classHours.start || !classHours.end) newErrors.hours = "Set class hours";
    if (hasOutdoorActivities === null) newErrors.outdoor = "Select yes or no";
    if (hasOutdoorActivities === "Yes" && (!activityHours.start || !activityHours.end)) {
      newErrors.activityHours = "Set activity hours";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const profileData = {
      selectedDays,
      commuteType,
      classHours,
      hasOutdoorActivities,
      activityHours: hasOutdoorActivities === "Yes" ? activityHours : null,
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
                Tell us about your weekly student life
              </Text>
            </VStack>

            {/* Days on campus */}
            <FormControl isInvalid={!!errors.days}>
              <FormLabel fontWeight="600">Which days are you usually on campus?</FormLabel>
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

            {/* Commute type */}
            <FormControl isInvalid={!!errors.commute}>
              <FormLabel fontWeight="600">How do you usually get to campus?</FormLabel>
              <VStack spacing="10px" align="stretch">
                {commuteOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => setCommuteType(commuteType === option ? "" : option)}
                    colorScheme={commuteType === option ? "brand" : "gray"}
                    variant={commuteType === option ? "solid" : "outline"}
                    justifyContent="flex-start"
                  >
                    {option}
                  </Button>
                ))}
              </VStack>
              {errors.commute && <Text color="red.500" fontSize="sm" mt="5px">{errors.commute}</Text>}
            </FormControl>

            {/* Class hours */}
            <FormControl isInvalid={!!errors.hours}>
              <FormLabel fontWeight="600">What are your usual class hours?</FormLabel>
              <HStack spacing="10px">
                <Input
                  type="time"
                  value={classHours.start}
                  onChange={(e) => setClassHours({ ...classHours, start: e.target.value })}
                />
                <Text>to</Text>
                <Input
                  type="time"
                  value={classHours.end}
                  onChange={(e) => setClassHours({ ...classHours, end: e.target.value })}
                />
              </HStack>
              {errors.hours && <Text color="red.500" fontSize="sm" mt="5px">{errors.hours}</Text>}
            </FormControl>

            {/* Outdoor activities */}
            <FormControl isInvalid={!!errors.outdoor}>
              <FormLabel fontWeight="600">Do you have outdoor PE or club activities?</FormLabel>
              <HStack spacing="15px">
                {["Yes", "No"].map((option) => (
                  <Button
                    key={option}
                    onClick={() => setHasOutdoorActivities(hasOutdoorActivities === option ? null : option)}
                    colorScheme={hasOutdoorActivities === option ? "brand" : "gray"}
                    variant={hasOutdoorActivities === option ? "solid" : "outline"}
                    flex="1"
                  >
                    {option}
                  </Button>
                ))}
              </HStack>
              {errors.outdoor && <Text color="red.500" fontSize="sm" mt="5px">{errors.outdoor}</Text>}
            </FormControl>

            {/* Activity hours (conditional) */}
            {hasOutdoorActivities === "Yes" && (
              <FormControl isInvalid={!!errors.activityHours}>
                <FormLabel fontWeight="600">What time are your outdoor activities?</FormLabel>
                <HStack spacing="10px">
                  <Input
                    type="time"
                    value={activityHours.start}
                    onChange={(e) => setActivityHours({ ...activityHours, start: e.target.value })}
                  />
                  <Text>to</Text>
                  <Input
                    type="time"
                    value={activityHours.end}
                    onChange={(e) => setActivityHours({ ...activityHours, end: e.target.value })}
                  />
                </HStack>
                {errors.activityHours && <Text color="red.500" fontSize="sm" mt="5px">{errors.activityHours}</Text>}
              </FormControl>
            )}

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

export default StudentOnboarding;
