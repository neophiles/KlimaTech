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
  Input,
  useDisclosure,
} from "@chakra-ui/react";

function OutdoorWorkerOnboarding({ onComplete, onBack, isLoading }) {
  const [workType, setWorkType] = useState("");
  const [otherWork, setOtherWork] = useState("");
  const [workHours, setWorkHours] = useState({ start: "", end: "" });
  const [breakPreference, setBreakPreference] = useState("");
  const [errors, setErrors] = useState({});

  const workOptions = [
    "Construction / Maintenance",
    "Delivery / Transport",
    "Vendor / Street Food",
    "Field Agent / Technician",
    "Agriculture / Fishing",
    "Others",
  ];

  const breakOptions = [
    "Mostly outdoors / In a shaded area",
    "Mostly indoors (with fan or AC)",
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!workType) newErrors.work = "Select a work type";
    if (workType === "Others" && !otherWork.trim()) newErrors.otherWork = "Please specify your work";
    if (!workHours.start || !workHours.end) newErrors.hours = "Set working hours";
    if (!breakPreference) newErrors.breaks = "Select a break preference";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const profileData = {
      workType: workType === "Others" ? otherWork : workType,
      workHours,
      breakPreference,
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
                Tell us about your outdoor work routine
              </Text>
            </VStack>

            {/* Work type */}
            <FormControl isInvalid={!!errors.work}>
              <FormLabel fontWeight="600">What type of work do you usually do outdoors?</FormLabel>
              <VStack spacing="8px" align="stretch">
                {workOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => setWorkType(workType === option ? "" : option)}
                    colorScheme={workType === option ? "brand" : "gray"}
                    variant={workType === option ? "solid" : "outline"}
                    justifyContent="flex-start"
                  >
                    {option}
                  </Button>
                ))}
              </VStack>
              {errors.work && <Text color="red.500" fontSize="sm" mt="5px">{errors.work}</Text>}
            </FormControl>

            {/* Other work type input */}
            {workType === "Others" && (
              <FormControl isInvalid={!!errors.otherWork}>
                <FormLabel fontWeight="600">Please specify</FormLabel>
                <Input
                  placeholder="Your work type"
                  value={otherWork}
                  onChange={(e) => setOtherWork(e.target.value)}
                />
                {errors.otherWork && <Text color="red.500" fontSize="sm" mt="5px">{errors.otherWork}</Text>}
              </FormControl>
            )}

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

            {/* Break preference */}
            <FormControl isInvalid={!!errors.breaks}>
              <FormLabel fontWeight="600">Do you take breaks outdoors or indoors?</FormLabel>
              <VStack spacing="8px" align="stretch">
                {breakOptions.map((option) => (
                  <Button
                    key={option}
                    onClick={() => setBreakPreference(breakPreference === option ? "" : option)}
                    colorScheme={breakPreference === option ? "brand" : "gray"}
                    variant={breakPreference === option ? "solid" : "outline"}
                    justifyContent="flex-start"
                    h="auto"
                    py="15px"
                    px="15px"
                  >
                    {option}
                  </Button>
                ))}
              </VStack>
              {errors.breaks && <Text color="red.500" fontSize="sm" mt="5px">{errors.breaks}</Text>}
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

export default OutdoorWorkerOnboarding;
