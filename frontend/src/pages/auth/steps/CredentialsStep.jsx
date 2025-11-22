import { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Container,
  Flex,
  VStack,
  HStack,
  Button,
  Link,
  Text,
  Heading,
  Image,
} from "@chakra-ui/react";

function CredentialsStep({ onSubmit, userData, setUserData }) {
  const [errors, setErrors] = useState({
    username: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: value.trim() === "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasEmptyFields = Object.values({
      username: userData.username,
      password: userData.password,
    }).some((v) => v.trim() === "");

    if (hasEmptyFields) {
      setErrors({
        username: userData.username.trim() === "",
        password: userData.password.trim() === "",
      });
      return;
    }

    onSubmit({
      username: userData.username,
      password: userData.password,
    });
  };

  return (
    <Flex minH="100vh" align="center" justify="center">
      <Container
        maxW="min(90%, 450px)"
        py="30px"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="5px"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing="20px">
            <VStack spacing="0">
              <Heading size={["md", "lg"]}>Hey there! Let's keep you</Heading>
              <Image src="/logo/PRESKO-name-logo.png" alt="PRESKO Logo" w="100px" />
            </VStack>

            <FormControl isInvalid={errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                value={userData.username}
                placeholder="juandelacruz"
                onChange={handleChange}
                variant="filled"
              />
              {!errors.username ? (
                <FormHelperText>What would you like us to call you?</FormHelperText>
              ) : (
                <FormErrorMessage>Username is required.</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <HStack>
                <Input
                  type={!showPassword ? "password" : "text"}
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  variant="filled"
                />
                <Button onClick={() => setShowPassword((prev) => !prev)} w="80px">
                  {!showPassword ? "Show" : "Hide"}
                </Button>
              </HStack>
              {!errors.password ? (
                <FormHelperText>Enter your password.</FormHelperText>
              ) : (
                <FormErrorMessage>Password is required.</FormErrorMessage>
              )}
            </FormControl>

            <Button type="submit" colorScheme="brand" w="100%">
              Next
            </Button>

            <Text>
              Already have an account?{" "}
              <Link href="/login" color="brand.600">
                Log in
              </Link>
            </Text>
          </VStack>
        </form>
      </Container>
    </Flex>
  );
}

export default CredentialsStep;
