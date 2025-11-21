import {
  Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton,
  Box, VStack, HStack,
  Text,
  Button,
  useColorModeValue,
  Heading,
  Icon,
} from '@chakra-ui/react'

import { ThumbsUp, ThumbsDown } from "lucide-react";

function PreskoModal({ isOpen, onClose, spot }) {


  if (!spot) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent w="300px" overflow="hidden">
          <Box h="125px" w="100%" bg="whiteAlpha.500" gap="10px">

          </Box>
          <ModalHeader>
            <Heading size="sm">{spot?.name || "Presko Spot"}</Heading>
            <Text fontSize="sm">{spot?.type || "N/A"}</Text>
            <Text fontSize="xs">{spot?.Address || "N/A"}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack justify="start" fontSize="sm">
              <HStack spacing="0">
                <Button variant="ghost" p="0">
                  <Icon as={ThumbsUp} boxSize={5} />
                </Button>
                <Text>1</Text>
              </HStack>
              <HStack spacing="0">
                <Button variant="ghost" p="0">
                  <Icon as={ThumbsDown} boxSize={5} />
                </Button>
                <Text>1</Text>
              </HStack>
            </HStack>
          </ModalBody>

        {/* <ModalFooter>
          <Button colorScheme='blue' onClick={onClose}>
            Close
          </Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  )
}

export default PreskoModal;
