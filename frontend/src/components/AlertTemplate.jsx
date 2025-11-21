import { useEffect } from "react";
import { Alert, AlertIcon } from "@chakra-ui/react";

export default function AlertTemplate({ alertInfo, onClose }) {
  useEffect(() => {
    if (!alertInfo) return;
    const timer = setTimeout(() => onClose(), 2000);
    return () => clearTimeout(timer);
  }, [alertInfo]);

  if (!alertInfo) return;

  return (
    <Alert
      variant="solid"
      status={alertInfo.status}
      position='fixed'
      top="0"
      transform="translateX(-50%)"
      left="50%"
      w="min(100%, 450px)"
      zIndex="9999"
    >
      <AlertIcon />
      {alertInfo.message}
    </Alert>
)
}
