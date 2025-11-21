import {
	Flex, HStack, Spacer,
	Image,
	useColorMode, useColorModeValue,
	IconButton,
} from "@chakra-ui/react";
import { Sun, Moon, } from "lucide-react";

function Header({ bgColor }) {
	const { colorMode, toggleColorMode } = useColorMode();
	const hoverBg = useColorModeValue("contrast.700", "contrast.300");

	return (
		<Flex
			as="header"
			bg={bgColor}
			h={["50px", "60px", "70px"]}
			px={["10px", "20px", "30px"]}
			py={["10px", "20px"]}
			justify="center"
		>
			<Flex align="center" w="min(600px, 95%)">
				<Image src="/logo/PRESKO-name-logo.png" alt="PRESKO Logo" w="100px" />
				<Spacer />
				<HStack spacing="5px" align="center">
					<IconButton
						variant="ghost"
						icon={colorMode === "light" ? <Sun /> : <Moon />}
						onClick={toggleColorMode}
						aria-label="Toggle Color Mode"
						size="lg"
						_hover={{ bg: hoverBg }}
						color="yellow.500"
						p="0"
					/>
				</HStack>
			</Flex>
		</Flex>
	);
}

export default Header;
