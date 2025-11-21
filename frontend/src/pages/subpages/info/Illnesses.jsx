import {
  Box, Flex,
  Text, Heading, Icon, 
  UnorderedList, ListItem,
  useColorModeValue,
  Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
  OrderedList,
} from "@chakra-ui/react";
import { Brain, Droplets, Activity } from "lucide-react";

function Illnesses() {
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
        <Heading size="sm" mb="5px">MGA SAKIT DULOT NG INIT</Heading>

        <Accordion allowToggle w="100%">
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Flex as='span' flex='1' textAlign='left' align="center" gap="10px">
                  <Icon as={Brain} boxSize={6} color="red.500" />
                  <Flex direction="column" gap="5px">
                    <Text>Heat Stroke</Text>
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
                      EMERGENCY
                    </Box>
                  </Flex>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" gap="15px" fontSize={["xs", "sm"]}>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Deskripsyon</Heading>
                  <Text>
                    Banta sa buhay. Kailangan ng agarang atensyong medikal.
                  </Text>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Senyales</Heading>
                  <UnorderedList spacing="2.5px">
                    <ListItem>
                      Nalilito, iritable, o nahihirapang magsalita
                    </ListItem>
                    <ListItem>
                      Nawalan ng malay (nahimatay)
                    </ListItem>
                    <ListItem>
                      Mataas na temperatura (40°C o mas mataas)
                    </ListItem>
                    <ListItem>
                      Maaaring mainit at tuyo ang balat (hindi pinagpapawisan), o basang-basa pa rin sa pawis
                    </ListItem>
                  </UnorderedList>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Agad na Lunas</Heading>
                  <OrderedList spacing="2.5px">
                    <ListItem>TUMAWAG AGAD NG 911 (o local emergency number).</ListItem>
                    <ListItem>Dalhin sa malamig na lugar (sa lilim o may aircon).</ListItem>
                    <ListItem>Palamigin ang katawan habang naghihintay ng tulong:</ListItem>
                    <UnorderedList>
                        <ListItem>Hubarin ang hindi kailangang damit.</ListItem>
                        <ListItem>Basain ng malamig na tubig o tuwalya ang buong katawan.</ListItem>
                        <ListItem>Paypayan para mapabilis ang pag-evaporate ng tubig.</ListItem>
                        <ListItem>Lagyan ng yelo (ice packs) sa leeg, kili-kili, at singit.</ListItem>
                    </UnorderedList>
                    <ListItem>HUWAG piliting painumin kung nalilito o walang malay.</ListItem>
                  </OrderedList>
                </Flex>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Flex as='span' flex='1' textAlign='left' align="center" gap="10px">
                  <Icon as={Droplets} boxSize={6} color="orange.500" />
                  <Flex direction="column" gap="5px">
                    <Text>Heat Exhaustion</Text>
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
                      DELIKADO
                    </Box>
                  </Flex>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" gap="10px" fontSize={["xs", "sm"]}>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Deskripsyon</Heading>
                  <Text>
                    Matinding pagod dahil sa init. Pwedeng mauwi sa Heat Stroke kung hindi naagapan.
                  </Text>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Senyales</Heading>
                  <UnorderedList spacing="2.5px">
                    <ListItem>Matindi at maraming pawis</ListItem>
                    <ListItem>Maputla at malamig na balat (clammy skin)</ListItem>
                    <ListItem>Pagkahilo, pagkapagod, panghihina</ListItem>
                    <ListItem>Sakit ng ulo</ListItem>
                    <ListItem>Pagduduwal o pagsusuka</ListItem>
                    <ListItem>Mabilis pero mahinang pulso</ListItem>
                  </UnorderedList>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Agad na Lunas</Heading>
                  <OrderedList spacing="2.5px">
                    <ListItem>Pumunta agad sa malamig na lugar at magpahinga.</ListItem>
                    <ListItem>Uminom ng tubig o sports drink (paunti-unti).</ListItem>
                    <ListItem>Luagan ang damit.</ListItem>
                    <ListItem>Magpalamig: Gumamit ng malamig na tuwalya sa balat o maligo sa malamig na tubig.</ListItem>
                    <ListItem>Humiga at itaas nang bahagya ang mga paa.</ListItem>
                    <ListItem>Magpatingin sa doktor kung sumuka, lumala ang sintomas, o hindi bumuti ang pakiramdam pagkatapos ng 1 oras.</ListItem>
                  </OrderedList>
                </Flex>
              </Flex>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Flex as='span' flex='1' textAlign='left' align="center" gap="10px">
                  <Icon as={Activity} boxSize={6} color="yellow.500" />
                  <Flex direction="column" gap="5px">
                    <Text>Heat Cramps</Text>
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
                      MAG-INGAT
                    </Box>
                  </Flex>
                </Flex>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Flex direction="column" gap="10px" fontSize={["xs", "sm"]}>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Deskripsyon</Heading>
                  <Text>
                    Maagang senyales na nauubusan na ng tubig at asin ang katawan.
                  </Text>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Senyales</Heading>
                  <UnorderedList spacing="2.5px">
                    <ListItem>Pamumulikat (muscle spasms) o pananakit ng kalamnan, karaniwan sa binti, braso, o tiyan</ListItem>
                    <ListItem>Nangyayari habang o pagkatapos mag-ehersisyo sa init</ListItem>
                  </UnorderedList>
                </Flex>
                <Flex direction="column" gap="5px">
                  <Heading size="xs">Agad na Lunas</Heading>
                  <OrderedList spacing="2.5px">
                    <ListItem>Itigil ang anumang mabigat na gawain at magpahinga sa malamig na lugar.</ListItem>
                    <ListItem>Uminom ng tubig o sports drink na may electrolytes.</ListItem>
                    <ListItem>Dahan-dahang i-stretch at i-masahe ang apektadong kalamnan.</ListItem>
                    <ListItem>HUWAG bumalik sa mabigat na gawain sa loob ng ilang oras, kahit bumuti na ang pakiramdam.</ListItem>
                  </OrderedList>
                </Flex>
              </Flex>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </>
  )
}

export default Illnesses;