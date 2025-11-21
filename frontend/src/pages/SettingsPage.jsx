import { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { Undo2 } from "lucide-react";
import Profile from "./subpages/Profile";
import About from "./subpages/About";
import Info from "./subpages/Info";

function Settings() {
  const [subPage, setSubPage] = useState("settings");
  const bgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex
      justify="center"
      p={["20px", "30px"]}
      h="100%"
    >
      <Flex
        direction="column"
        align="center"
        gap="20px"
        w="min(600px, 95%)"
        h="auto"
      >
        {subPage !== "settings" && (
          <Button
            size="sm"
            alignSelf="start"
            variant="link"
            leftIcon={<Undo2 />}
            onClick={() => setSubPage("settings")}
          >
            Back to Settings
          </Button>
        )}

        {subPage === "profile" ? <Profile /> : 
         subPage === "info" ? <Info /> : 
         subPage === "about" ? <About /> : (
          <>
            <Flex
              direction="column"
              align="start"
              gap="5px"
              w="100%"
              p="15px"
              bg={bgColor}
              borderRadius="lg"
            >

              <Heading size="sm" mb="5px">ACCOUNT</Heading>
              <Button variant="link" onClick={() => setSubPage("profile")}>Profile</Button>
              <Button variant="link" onClick={() => setSubPage("notifications")}>Notification</Button>

            </Flex>
            <Flex
              direction="column"
              align="start"
              gap="5px"
              w="100%"
              p="15px"
              bg={bgColor}
              borderRadius="lg" 
            >
              
              <Heading size="sm" mb="5px">RESOURCES</Heading>
              <Button variant="link" onClick={() => setSubPage("info")}>Heat Info</Button>
            </Flex>
            <Flex
              direction="column"
              align="start"
              gap="5px"
              w="100%"
              p="15px"
              bg={bgColor}
              borderRadius="lg"
            >
              
              <Heading size="sm" mb="5px">ABOUT PRESKO</Heading>
              <Button variant="link" onClick={() => setSubPage("about")}>About</Button>
              <Button variant="link" onClick={() => setSubPage("share")}>Share the App</Button>

            </Flex>
          </>
        )}
        </Flex>
    </Flex>
  );
}

export default Settings;