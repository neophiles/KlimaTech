import { Outlet } from "react-router-dom";
import { 
	Grid, GridItem, 
	useColorModeValue
} from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";

function RootLayout() {
	const bgColor = useColorModeValue("contrast.600", "contrast.400");

	return (
		<Grid
      templateColumns="repeat(1, 1fr)"
			templateRows="auto 1fr auto"
			minW="100%"
      minH="100vh"
    >
			<GridItem
				position="sticky"
        top="0"
				zIndex="900"
			>
				<Header bgColor={bgColor} />
			</GridItem>
			<GridItem flex="1">
				<Outlet />
			</GridItem>
			<GridItem
				position="sticky"
        bottom="0"
				zIndex="900"
			>
				<Footer bgColor={bgColor} />
			</GridItem>
		</Grid>
	);
}

export default RootLayout;
