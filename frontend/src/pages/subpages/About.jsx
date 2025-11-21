import {
  Flex,
  Text, Heading, Link, Image,
  UnorderedList, ListItem,
  useColorModeValue,
} from "@chakra-ui/react";
import neil from "../../assets/photos/neil.jpg";
import rm from "../../assets/photos/rm.jpg";
import vincent from "../../assets/photos/vincent.png";
import kyla from "../../assets/photos/kyla.jpg";
import iggy from "../../assets/photos/iggy.jpg";

function About() {
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
        <Heading size="sm" mb="5px">WHAT IS PRESKO?</Heading>

        <Flex direction="column" gap="5px"fontSize="sm">
          <Heading size="xs">Our Mission</Heading>
          <Text>
            The Philippine heat can be more than just uncomfortable; it can be dangerous.{" "}
            PRESKO (from pampapresko, 'to cool down') is your daily companion for navigating the tropical heat safely and comfortably.
          </Text>
        </Flex>

        <Flex direction="column" gap="5px"fontSize="sm">
          <Heading size="xs">Core Features</Heading>
          <UnorderedList>
            <ListItem>
              24-Hour Heat Index: Plan your day with our real-time and upcoming heat index forecast, powered by Open-Meteo.
            </ListItem>
            <ListItem>
              PreskoSpots: Find the nearest public parks, malls, libraries, or palamigan (cooling stations) to get a break from the heat.
            </ListItem>
            <ListItem>
              Init Tips: Simple, actionable do's and don'ts to keep you and your loved ones safe during extreme heat.
            </ListItem>
          </UnorderedList>
        </Flex>
      </Flex>

      <Flex
        direction="column"
        align="start"
        gap="15px"
        w="100%"
        p="15px"
        bg={bgColor}
        borderRadius="lg"
      >
        <Heading size="sm" mb="5px">MEET THE TEAM</Heading>
        
        <Text fontSize="sm">
          We are a group of CS students from <a className="university" href="https://mseuf.edu.ph/" target="_blank"><span className="highlight bold">Manuel S. Enverga University Foundation Lucena</span></a> passionate about using technology to promote climate resilience in the Philippines. 🇵🇭
        </Text>

        <Flex justify="center" gap="15px" wrap="wrap" fontSize="xs">
          <Link 
            _hover={{ textDecoration: "none" }}
            href="https://www.linkedin.com/in/marc-neil-tagle/"
            target="_blank"
          >
            <Flex
              direction="column"
              align="center"
              w="150px"
              gap="5px"
              role="group"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Image
                src={neil}
                alt="Neil's Picture"
                boxSize="150px"
                borderRadius="lg"
                _groupHover={{ boxShadow: "0 0 5px #02b9a3" }}
              />
              <Heading
                size="xs"
                transition="all 0.2s"
                _groupHover={{ color: "brand.500" }}
              >
                Marc Neil Tagle
              </Heading>
              <Text textAlign="center" lineHeight="1">Project Lead & Frontend Developer</Text>
            </Flex>
          </Link>
          <Link 
            _hover={{ textDecoration: "none" }}
            href="https://www.linkedin.com/in/villarm/"
            target="_blank"
          >
            <Flex
              direction="column"
              align="center"
              w="150px"
              gap="5px"
              role="group"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Image
                src={rm}
                alt="RM's Picture"
                boxSize="150px"
                borderRadius="lg"
                _groupHover={{ boxShadow: "0 0 5px #02b9a3" }}
              />
              <Heading
                size="xs"
                transition="all 0.2s"
                _groupHover={{ color: "brand.500" }}
              >
                Rodmark Bernard Villa
              </Heading>
              <Text textAlign="center" lineHeight="1">Backend & Systems Developer</Text>
            </Flex>
          </Link>
          <Link 
            _hover={{ textDecoration: "none" }}
            href="https://www.linkedin.com/in/vincent-aguirre-367173367/"
            target="_blank"
          >
            <Flex
              direction="column"
              align="center"
              w="150px"
              gap="5px"
              role="group"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Image
                src={vincent}
                alt="Vincent's Picture"
                boxSize="150px"
                borderRadius="lg"
                _groupHover={{ boxShadow: "0 0 5px #02b9a3" }}
              />
              <Heading
                size="xs"
                transition="all 0.2s"
                _groupHover={{ color: "brand.500" }}
              >
                Paul Vincent Aguirre
              </Heading>
              <Text textAlign="center" lineHeight="1">UI/UX Designer</Text>
            </Flex>
          </Link>
          <Link 
            _hover={{ textDecoration: "none" }}
            href="https://www.linkedin.com/in/kydequito/"
            target="_blank"
          >
            <Flex
              direction="column"
              align="center"
              w="150px"
              gap="5px"
              role="group"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Image
                src={kyla}
                alt="Kyla's Picture"
                boxSize="150px"
                borderRadius="lg"
                _groupHover={{ boxShadow: "0 0 5px #02b9a3" }}
              />
              <Heading
                size="xs"
                transition="all 0.2s"
                _groupHover={{ color: "brand.500" }}
              >
                Kyla Dessirei Dequito
              </Heading>
              <Text textAlign="center" lineHeight="1">Research & Frontend Contributor</Text>
            </Flex>
          </Link>
          <Link 
            _hover={{ textDecoration: "none" }}
            href="mailto:iggycamelot@gmail.com"
            target="_blank"
          >
            <Flex
              direction="column"
              align="center"
              w="150px"
              gap="5px"
              role="group"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Image
                src={iggy}
                alt="Iggy's Picture"
                boxSize="150px"
                borderRadius="lg"
                _groupHover={{ boxShadow: "0 0 5px #02b9a3" }}
              />
              <Heading
                size="xs"
                transition="all 0.2s"
                _groupHover={{ color: "brand.500" }}
              >
                Iggy Michael Cadeliña
              </Heading>
              <Text textAlign="center" lineHeight="1">Data & Backend Contributor</Text>
            </Flex>
          </Link>
        </Flex>

      </Flex>
      
      <Flex
        direction="column"
        align="start"
        gap="15px"
        w="100%"
        p="15px"
        bg={bgColor}
        borderRadius="lg"
      >
        <Heading size="sm" mb="5px">IMPORTANT DISCLAIMERS & REMINDERS</Heading>

        <Flex direction="column" gap="5px"fontSize="sm">
          <Heading size="xs">General Disclaimer</Heading>
          <Text>
            PRESKO is an informational tool, not a medical device. 
            The information provided (heat index, tips) is not a substitute for professional medical advice, diagnosis, or treatment.
          </Text>
        </Flex>
        
        <Flex direction="column" gap="5px"fontSize="sm">
          <Heading size="xs">On Heat Index & Tips</Heading>
          <Text>
            Always listen to your body. If you feel symptoms of heat exhaustion (dizziness, nausea, headache), seek a cool place and medical attention immediately. 
            'Init Tips' are general guidelines and may not apply to every individual's health condition.
          </Text>
        </Flex>

        <Flex direction="column" gap="5px"fontSize="sm">
          <Heading size="xs">On PreskoSpots</Heading>
          <Text>
            The 'PreskoSpots' feature relies on publicly available data and CSS (community-sourced suggestions). PRESKO does not guarantee the safety, accessibility, or operating hours of these locations. 
            Please exercise caution and verify information before traveling.
          </Text>
        </Flex>

        <Flex direction="column" gap="5px"fontSize="sm">
          <Heading size="xs">Data Sources</Heading>
          <Text>
            Heat Index data is sourced from Open-Meteo.com. 
            We are not responsible for inaccuracies from third-party data providers.
          </Text>
        </Flex>
      </Flex>

      <Flex
        direction="column"
        align="start"
        gap="15px"
        w="100%"
        p="15px"
        bg={bgColor}
        borderRadius="lg"
      >
        <Heading size="sm" mb="5px">TECHNICAL</Heading>

        <Flex direction="column" gap="5px"fontSize="sm">
          <Heading size="xs">Send Feedback</Heading>
          <Text>
            See a bug? Have a suggestion? We'd love to hear it! 
            Email us at: <a href="mailto:feedback@presko.ph">feedback@presko.ph</a>
          </Text>
        </Flex>
        
        <Flex direction="column" gap="5px"fontSize="sm">
          <Heading size="xs">Attribution</Heading>
          <UnorderedList>
            <ListItem>
              Maps powered by <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>
            </ListItem>
            <ListItem>
              Weather data from <a href="https://open-meteo.com/" target="_blank">Open-Meteo</a>
            </ListItem>
            <ListItem>
              Icons by <a href="https://heroicons.com/" target="_blank">Heroicons</a> and <a href="https://tabler.io/icons" target="_blank">Tabler</a>
            </ListItem>
          </UnorderedList>
        </Flex>

        <Flex direction="column" gap="5px"fontSize="sm">
          <Heading size="xs">VERSION</Heading>
          <Text>
            Version 0.0.2 (Build 2025-11-20)
          </Text>
        </Flex>
      </Flex>
    </>
  )
}

export default About;