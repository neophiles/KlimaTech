import { 
  Flex,
  Skeleton,
  useColorModeValue
} from '@chakra-ui/react'

function TipEntrySkeleton() {
  return (
    <Flex
      direction="column"
      w="100%"
      bg={useColorModeValue("gray.200", "gray.900")}
      borderLeft="5px solid"
      borderColor="gray.400"
      p="10px"
      gap="8px"
    >
      <Skeleton height='20px' width='60%' />
      <Skeleton height='16px' width='100%' />
      <Skeleton height='16px' width='95%' />
    </Flex>
  )
}

export default TipEntrySkeleton;
