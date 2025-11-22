import { Button, Icon } from "@chakra-ui/react";
import { MapPinPlus } from "lucide-react";

function AddPreskoButton({ onStartPicking }) {
  return (
    <Button
      colorScheme="brand"
      p="0"
      onClick={onStartPicking}
      title="Add a new PreskoSpot"
    >
      <Icon as={MapPinPlus} boxSize={5} />
    </Button>
  );
}

export default AddPreskoButton;
