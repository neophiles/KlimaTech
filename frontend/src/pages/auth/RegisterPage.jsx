import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Container, Flex, VStack, HStack,
	FormControl, FormLabel, FormHelperText, Input, FormErrorMessage,
	Button, Link,
	Heading, Text, Image,
} from "@chakra-ui/react";
import AlertTemplate from "../../components/AlertTemplate";
import { register } from "../../api/auth";

function Register() {
	const [userData, setUserData] = useState({
		username: "",
		password: "",
	});

	const [errors, setErrors] = useState({
		username: false,
		password: false,
	});

	const [showPassword, setShowPassword] = useState(false);

	const [alertInfo, setAlertInfo] = useState(null);

	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

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

	const handleSubmit = async (e) => {
		e.preventDefault();

		const hasEmptyFields = Object.values(userData).some((v) => v.trim() === "");
		if (hasEmptyFields) {
			setAlertInfo({ status: "error", message: "Please fill in all fields." });
			return;
		}

		setIsLoading(true);

		try {
			const res = await register({
				username: userData.username,
				password: userData.password,
				user_type: "office_worker",
			});

			if (!res?.id) throw new Error("Registration failed");

			setAlertInfo({ status: "success", message: "Registered successfully!" });
			setTimeout(() => navigate("/login"), 1500);
		} catch (err) {
			setAlertInfo({
				status: "error",
				message: err.response?.data?.detail || "Registration failed.",
			});
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{alertInfo && (
				<AlertTemplate alertInfo={alertInfo} onClose={() => setAlertInfo(null)} />
			)}

			<Flex h="100vh" align="center" justify="center">
				<Container maxW="min(90%, 450px)" py="30px" border="1px solid" borderColor="gray.300" borderRadius="5px">
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
									placeholder="johndoe"
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
									<Button onClick={() => setShowPassword(prev => !prev)} w="80px">
										{!showPassword ? "Show" : "Hide"}
									</Button>
								</HStack>
								{!errors.password ? (
									<FormHelperText>Enter your password.</FormHelperText>
								) : (
									<FormErrorMessage>Password is required.</FormErrorMessage>
								)}
							</FormControl>

							<Button type="submit" colorScheme="brand" w="100%" isLoading={isLoading}>
								Register
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
		</>
	);
}

export default Register;