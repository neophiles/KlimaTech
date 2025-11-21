import { Button, Icon } from "@chakra-ui/react";
import { MapPinPlus } from "lucide-react";

function AddPreskoButton() {
  return (
    <Button
      colorScheme="brand"
      p="0"
    >
      <Icon as={MapPinPlus} boxSize={5} />
    </Button>
  );
}

export default AddPreskoButton;
