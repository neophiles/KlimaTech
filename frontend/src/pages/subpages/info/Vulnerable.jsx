import {
  Box, Flex,
  Text, Heading, Icon, 
  UnorderedList, ListItem,
  useColorModeValue,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  OrderedList,
} from "@chakra-ui/react";
import {
  Baby, CandyCane,
  Milk, PillBottle,
  ThermometerSun, Wind
} from "lucide-react";

function Vulnerable() {
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
        <Heading size="sm" mb="5px">SINO ANG MAS NANGANGANIB</Heading>

        <Accordion allowToggle w="100%">
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Flex as='span' flex='1' textAlign='left' align="center" gap="10px">
                  <Icon as={Baby} boxSize={6} color="red.500" />
                  <Flex direction="column" gap="5px">
                    <Text>Bata/Sanggol</Text>
                    <Box
                      py="2px"
                      px="8px"
                      bg="red.500"
                      color="white"
                      borderRadius="lg"
                      fontSize="xs"
                      textAlign="center"
                      alignSelf="flex-start"
                    >
                      SEVERE
                    </Box>
                  </Flex>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" gap="15px" fontSize={["xs", "sm"]}>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Bakit?</Heading>
                  <Text>
                    Hindi pa ganap na developed ang kanilang body temperature control. Mas mabilis silang uminit.
                  </Text>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Paano Alagaan?</Heading>
                  <UnorderedList spacing="2.5px">
                    <ListItem>Hinding-hindi dapat iniiwan sa loob ng nakaparadang sasakyan, kahit saglit lang.</ListItem>
                    <ListItem>Laging painumin ng tubig. Sila ay hindi magsasabi na nauuhaw sila.</ListItem>
                    <ListItem>Damitan ng manipis at maluwag na damit.</ListItem>
                  </UnorderedList>
                </Flex>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Flex as='span' flex='1' textAlign='left' align="center" gap="10px">
                  <Icon as={CandyCane} boxSize={6} color="red.500" />
                  <Flex direction="column" gap="5px">
                    <Text>Matatanda</Text>
                    <Box
                      py="2px"
                      px="8px"
                      bg="red.500"
                      color="white"
                      borderRadius="lg"
                      fontSize="xs"
                      textAlign="center"
                      alignSelf="flex-start"
                    >
                      SEVERE
                    </Box>
                  </Flex>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" gap="15px" fontSize={["xs", "sm"]}>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Bakit?</Heading>
                  <Text>
                    Mas mabagal ang cooling mechanism ng katawan at minsan ay hindi na nila nararamdaman na sila ay nauuhaw.
                  </Text>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Paano Alagaan?</Heading>
                  <UnorderedList spacing="2.5px">
                    <ListItem>Regular na i-check ang kanilang kalagayan (e.g., tawagan o bisitahin). Huwag umasa na sila ang magsasabi na nahihirapan na sila.</ListItem>
                    <ListItem>Siguraduhin na ang kanilang tinitirhan ay may bentilador (e-fan) o access sa malamig na lugar.</ListItem>
                    <ListItem>Paalalahanan silang uminom ng tubig, kahit hindi nauuhaw.</ListItem>
                  </UnorderedList>
                </Flex>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Flex as='span' flex='1' textAlign='left' align="center" gap="10px">
                  <Icon as={Milk} boxSize={6} color="orange.500" />
                  <Flex direction="column" gap="5px">
                    <Text>Buntis</Text>
                    <Box
                      py="2px"
                      px="8px"
                      bg="orange.500"
                      color="white"
                      borderRadius="lg"
                      fontSize="xs"
                      textAlign="center"
                      alignSelf="flex-start"
                    >
                      HEALTH
                    </Box>
                  </Flex>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" gap="10px" fontSize={["xs", "sm"]}>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Bakit?</Heading>
                  <Text>
                    Mas mataas ang kanilang base body temperature at ang kanilang katawan ay mas nagsisikap na palamigin ang sarili at si baby.
                  </Text>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Paano Alagaan?</Heading>
                  <UnorderedList spacing="2.5px">
                    <ListItem>Uminom ng extra na tubig.</ListItem>
                    <ListItem>Iwasan ang matagal na pagtayo sa init. Magpahinga agad kapag nakaramdam ng hilo.</ListItem>
                  </UnorderedList>
                </Flex>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Flex as='span' flex='1' textAlign='left' align="center" gap="10px">
                  <Icon as={PillBottle} boxSize={6} color="orange.500" />
                  <Flex direction="column" gap="5px">
                    <Text>May Sakit / Maintenance Meds</Text>
                    <Box
                      py="2px"
                      px="8px"
                      bg="orange.500"
                      color="white"
                      borderRadius="lg"
                      fontSize="xs"
                      textAlign="center"
                      alignSelf="flex-start"
                    >
                      HEALTH
                    </Box>
                  </Flex>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" gap="10px" fontSize={["xs", "sm"]}>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Bakit?</Heading>
                  <Text>
                    Ang mga may sakit (lalo na sa puso, high blood, diabetes) ay mas nahihirapang mag-adjust sa init. Ang ibang mga gamot (tulad ng diuretics) ay nakaka-dagdag ng risk.
                  </Text>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Paano Alagaan?</Heading>
                  <UnorderedList spacing="2.5px">
                    <ListItem>Doble-ingat. Huwag mag-babad sa init.</ListItem>
                    <ListItem>Mag-konsulta sa doktor kung paano nakaka-apekto ang kanilang gamot sa init.</ListItem>
                  </UnorderedList>
                </Flex>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Flex as='span' flex='1' textAlign='left' align="center" gap="10px">
                  <Icon as={ThermometerSun} boxSize={6} color="yellow.500" />
                  <Flex direction="column" gap="5px">
                    <Text>Nagtatrabaho sa Labas</Text>
                    <Box
                      py="2px"
                      px="8px"
                      bg="yellow.500"
                      color="white"
                      borderRadius="lg"
                      fontSize="xs"
                      textAlign="center"
                      alignSelf="flex-start"
                    >
                      EXPOSURE
                    </Box>
                  </Flex>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" gap="10px" fontSize={["xs", "sm"]}>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Bakit?</Heading>
                  <Text>
                    Sila ang direktang exposed sa araw at init sa loob ng maraming oras.
                  </Text>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Paano Alagaan?</Heading>
                  <UnorderedList spacing="2.5px">
                    <ListItem>Ito ang mga power users ng PRESKO. Hikayatin silang gamitin ang 24-hour forecast para i-plano ang kanilang pinaka-mabibigat na gawain sa mas malamig na oras.</ListItem>
                    <ListItem>Mag-break nang mas madalas sa lilim o sa isang PreskoSpot.</ListItem>
                  </UnorderedList>
                </Flex>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Flex as='span' flex='1' textAlign='left' align="center" gap="10px">
                  <Icon as={Wind} boxSize={6} color="yellow.500" />
                  <Flex direction="column" gap="5px">
                    <Text>Walang Aircon / Ventilation</Text>
                    <Box
                      py="2px"
                      px="8px"
                      bg="yellow.500"
                      color="white"
                      borderRadius="lg"
                      fontSize="xs"
                      textAlign="center"
                      alignSelf="flex-start"
                    >
                      EXPOSURE
                    </Box>
                  </Flex>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" gap="10px" fontSize={["xs", "sm"]}>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Bakit?</Heading>
                  <Text>
                    Walang lugar para "mag-charge" at palamigin ang katawan, lalo na sa gabi.
                  </Text>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Paano Alagaan?</Heading>
                  <UnorderedList spacing="2.5px">
                    <ListItem>Ito ang pinaka-importanteng rason para sa PreskoSpots.</ListItem>
                    <ListItem>Gamitin ang PreskoSpots tab para maghanap ng pinakamalapit na library, mall, o community center kung saan pwedeng magpalamig."</ListItem>
                  </UnorderedList>
                </Flex>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </>
  )
}

export default Vulnerable;