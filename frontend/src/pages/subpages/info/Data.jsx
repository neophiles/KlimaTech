import {
  Flex, Grid, GridItem,
  Text, Heading, Icon,
  useColorModeValue,
} from "@chakra-ui/react";

function Data() {
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
        <Heading size="sm" mb="5px">INIT SA PILIPINAS</Heading>
      </Flex>
      <Grid 
        templateColumns={["1fr", "repeat(2, 1fr)"]}
        fontSize={["xs", "sm"]}
      >
        <GridItem>
          <Flex
            direction="column"
            gap="5px"
            p="10px"
            bg={useColorModeValue("gray.200", "gray.900")}
            borderLeft="5px solid"
            borderColor="red.500"
            h="100%"
          >
            <Heading className="data" size={["sm", "md"]}>55°C</Heading>
            <Text>DEADLY HEAT INDEX RECORD</Text>
            <Text>Pinakamataas na naitala sa PH (Iba, Zambales - Apr 2024)</Text>
          </Flex>
        </GridItem>

        <GridItem>
          <Flex
            direction="column"
            gap="5px"
            p="10px"
            bg={useColorModeValue("gray.200", "gray.900")}
            borderLeft="5px solid"
            borderColor="red.500"
            h="100%"
          >
            <Heading className="data" size={["sm", "md"]}>Daan-daang Kaso</Heading>
            <Text>SAKIT DULOT NG INIT</Text>
            <Text>Maraming Pilipino ang naaapektuhan ng heat stroke at heat exhaustion.</Text>
          </Flex>
        </GridItem>

        <GridItem>
          <Flex
            direction="column"
            gap="5px"
            p="10px"
            bg={useColorModeValue("gray.200", "gray.900")}
            borderLeft="5px solid"
            borderColor="red.500"
            h="100%"
          >
            <Heading className="data" size={["sm", "md"]}>+1.0°C</Heading>
            <Text>TUMATAAS ANG KLIMA</Text>
            <Text>Tumaas na temperatura na nagdudulot ng mas madalas na extreme heat.</Text>
          </Flex>
        </GridItem>

        <GridItem>
          <Flex
            direction="column"
            gap="5px"
            p="10px"
            bg={useColorModeValue("gray.200", "gray.900")}
            borderLeft="5px solid"
            borderColor="red.500"
            h="100%"
          >
            <Heading className="data" size={["sm", "md"]}>Marso-Mayo</Heading>
            <Text>PEAK HEAT SEASON</Text>
            <Text>Pinakamainit na buwan; iwasan ang direktang sikat ng araw.</Text>
          </Flex>
        </GridItem>
      </Grid>
    </Flex>
  )
}

export default Data;