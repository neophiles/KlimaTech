import {
  Flex,
  Heading, Text,
  useColorModeValue,
} from "@chakra-ui/react";

function TipEntry({ guideData }) {
  const borderColor = guideData?.type === "do" ?
    "brand.300" : "red.300";

  if (!guideData) return;
  
  return (
    <Flex
      direction="column"
      w="100%"
      bg={useColorModeValue("gray.200", "gray.900")}
      borderLeft="5px solid"
      borderColor={borderColor}
      p="10px"
      color={useColorModeValue("gray.900", "gray.200")}
    >
      <Heading fontSize={["xs", "sm"]}>
        {guideData.heading}
      </Heading>
      <Text fontSize={["xs", "sm"]}>
        {guideData.body}
      </Text>
    </Flex>
  );
}

export default TipEntry;
