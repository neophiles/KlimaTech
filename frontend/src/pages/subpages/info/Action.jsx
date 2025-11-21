import {
  Flex,
  Text, Heading, Icon, 
  useColorModeValue,
  Box,
} from "@chakra-ui/react";

function Action() {
  const bgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Flex
      direction="column"
      w="100%"
      borderRadius="lg"
      overflow="hidden"
    >
      <Flex
        direction="column"
        align="start"
        gap="15px"
        p="15px"
        bg={bgColor}
      >
        <Heading size="sm" mb="5px">ANO ANG MAGAGAWA MO</Heading>
      </Flex>
      <Flex direction="column" fontSize={["xs", "sm"]}>
        <Flex
            direction="column"
            gap="5px"
            p="10px"
            bg={useColorModeValue("gray.200", "gray.900")}
            borderLeft="5px solid"
            borderColor="brand.500"
            h="100%"
          >
          <Heading size="xs">Magplano gamit ang PRESKO</Heading>
          <Text>
            Gamitin ang 24-hour forecast para i-schedule ang iyong mga lakad at trabaho sa mas malamig na oras.
          </Text>
        </Flex>
        <Flex
            direction="column"
            gap="5px"
            p="10px"
            bg={useColorModeValue("gray.200", "gray.900")}
            borderLeft="5px solid"
            borderColor="brand.500"
            h="100%"
          >
          <Heading size="xs">Maghanap ng PreskoSpots</Heading>
          <Text>
            Buksan ang PreskoSpots tab para maghanap ng libreng pampalamigan na malapit sa iyo (library, mall, park, etc.).
          </Text>
        </Flex>
        <Flex
            direction="column"
            gap="5px"
            p="10px"
            bg={useColorModeValue("gray.200", "gray.900")}
            borderLeft="5px solid"
            borderColor="brand.500"
            h="100%"
          >
          <Heading size="xs">Maging mapanuri sa kapwa</Heading>
          <Text>
            Tulungan at i-check ang iyong mga kapitbahay, lalo na ang mga matatanda at mga bata. I-share ang PRESKO app sa kanila.
          </Text>
        </Flex>
        <Flex
            direction="column"
            gap="5px"
            p="10px"
            bg={useColorModeValue("gray.200", "gray.900")}
            borderLeft="5px solid"
            borderColor="brand.500"
            h="100%"
          >
          <Heading size="xs">Palaguin ang community</Heading>
          <Text>
            May alam ka bang preskong lugar? I-share at i-suggest ito sa loob ng PRESKO app para matulungan din ang iba!
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Action;