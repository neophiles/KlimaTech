import {
  Flex,
  Text, Heading, Icon,
  UnorderedList, ListItem,
  useColorModeValue,
} from "@chakra-ui/react";

function Cause() {
  const bgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <>
      <Flex
        direction="column"
        align="start"
        gap="15px"
        w="100%"
        p="15px"
        bg={bgColor}
        borderRadius="lg"
      >
        <Heading size="sm" mb="5px">BAKIT UMIINIT ANG PANAHON</Heading>
        <Flex direction="column" gap="15px" fontSize={["xs", "sm"]}>
          <Flex direction="column" gap="5px">
            <Heading size="xs">Global Warming / Climate Change</Heading>
            <Text>
              Dahil sa climate change, bawat taon ay nagiging mas mainit sa buong mundo, kasama na ang Pilipinas.
            </Text>
          </Flex>
          <Flex direction="column" gap="5px">
            <Heading size="xs">Epekto sa Pilipinas</Heading>
            <UnorderedList spacing="2.5px">
              <ListItem>Mas matinding Heat Index tuwing tag-init (summer).</ListItem>
              <ListItem>"Urban Heat Island Effect": Mas kukulob ang init sa mga siyudad tulad ng Metro Manila. Ang semento at mga gusali ay sumisipsip ng init, at kulang sa puno para magpalamig.</ListItem>
              <ListItem>Mas mahabang tag-init at mas pabago-bagong panahon.</ListItem>
              <ListItem>Mas madalas na class suspensions at pag-iingat sa mga outdoor event.</ListItem>
            </UnorderedList>
          </Flex>
          <Text as="i">
            Sources: PAGASA, DOH, World Meteorological Organization
          </Text>
        </Flex>
      </Flex>
    </>
  )
}

export default Cause;