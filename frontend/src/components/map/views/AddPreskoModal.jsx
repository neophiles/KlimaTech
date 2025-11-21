import { useState } from "react";
import {
  Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Box, VStack,
  FormControl, FormLabel, FormErrorMessage,
  Input, Select, Button, Textarea,
  useToast, Spinner,
  Heading, Text, Icon, Image,
} from "@chakra-ui/react";
import { Upload } from "lucide-react";
import api from "../../../api/axios";

const PRESKOS_TYPES = [
  "Park",
  "Covered Court",
  "Barangay Hall",
  "Simbahan",
  "Walkway",
  "Water Fountain",
  "Waterside Area",
  "Mall",
  "Palamig Stall",
  "Convenience Store",
  "Transportation Hub",
  "Karinderya",
];

function AddPreskoModal({ isOpen, onClose, userLocation, onPreskoAdded }) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);

    // Create preview URLs
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!userLocation) newErrors.location = "User location not available";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("barangay_id", 3); // Default to UP Campus for now
      formDataToSend.append("name", formData.name);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("lat", userLocation.lat);
      formDataToSend.append("lon", userLocation.lon);

      // Append the first image if available
      if (files.length > 0) {
        formDataToSend.append("file", files[0]);
      }

      // Send to backend
      const response = await api.post("/coolspots/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Success!",
        description: "New PreskoSpot added successfully!",
        status: "success",
        duration: 3,
        isClosable: true,
      });

      // Call callback to refresh the map
      if (onPreskoAdded) {
        onPreskoAdded(response.data);
      }

      // Reset form
      setFormData({
        name: "",
        type: "",
        address: "",
        description: "",
      });
      setFiles([]);
      setPreviewUrls([]);
      setErrors({});
      onClose();
    } catch (error) {
      console.error("Error adding PreskoSpot:", error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to add PreskoSpot",
        status: "error",
        duration: 4,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: "",
      type: "",
      address: "",
      description: "",
    });
    setFiles([]);
    setPreviewUrls([]);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        maxW="min(90%, 450px)"
        maxH="min(90%, 500px)"
        overflowX="hidden"
        overflowY="auto"
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <ModalHeader>
          <Heading size={["sm", "md"]}>Add New PreskoSpot</Heading>
        </ModalHeader>
        <ModalCloseButton isDisabled={isLoading} />

        <ModalBody>
          <VStack spacing={4}>
            {/* Name */}
            <FormControl isInvalid={!!errors.name}>
              <FormLabel fontSize={["sm", "md"]}>Spot Name</FormLabel>
              <Input
                name="name"
                placeholder="e.g., Community Park, City Hall"
                value={formData.name}
                onChange={handleInputChange}
                isDisabled={isLoading}
                size={["sm", "md"]}
              />
              {errors.name && (
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              )}
            </FormControl>

            {/* Type */}
            <FormControl isInvalid={!!errors.type}>
              <FormLabel fontSize={["sm", "md"]}>Type</FormLabel>
              <Select
                name="type"
                placeholder="Select a type"
                value={formData.type}
                onChange={handleInputChange}
                isDisabled={isLoading}
                size={["sm", "md"]}
              >
                {PRESKOS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              {errors.type && (
                <FormErrorMessage>{errors.type}</FormErrorMessage>
              )}
            </FormControl>

            {/* Address */}
            <FormControl isInvalid={!!errors.address}>
              <FormLabel fontSize={["sm", "md"]}>Address</FormLabel>
              <Textarea
                name="address"
                placeholder="e.g., 123 Main St, Quezon City, Metro Manila"
                value={formData.address}
                onChange={handleInputChange}
                isDisabled={isLoading}
                minH="80px"
                size={["sm", "md"]}
              />
              {errors.address && (
                <FormErrorMessage>{errors.address}</FormErrorMessage>
              )}
            </FormControl>

            {/* Description */}
            <FormControl>
              <FormLabel fontSize={["sm", "md"]}>Description (Optional)</FormLabel>
              <Textarea
                name="description"
                placeholder="Add any additional details about this spot..."
                value={formData.description}
                onChange={handleInputChange}
                isDisabled={isLoading}
                minH="80px"
                size={["sm", "md"]}
              />
            </FormControl>

            {/* Image Upload */}
            <FormControl>
              <FormLabel fontSize={["sm", "md"]}>Upload Photos</FormLabel>
              <Box
                borderWidth={2}
                borderStyle="dashed"
                borderColor="gray.300"
                borderRadius="md"
                p={6}
                textAlign="center"
                cursor="pointer"
                _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                transition="all 0.2s"
                position="relative"
              >
                {previewUrls.length > 0 ? (
                  <VStack spacing={2}>
                      {previewUrls.map((url, index) => (
                        <Box pos="relative">
                          <Image
                            key={index}
                            src={url}
                            alt={`Preview ${index + 1}`}
                            borderRadius="md"
                            w="100%"
                          />
                          <Button
                            size="xs"
                            colorScheme="red"
                            position="absolute"
                            bottom="5px"
                            right="5px"
                            onClick={() => removeFile(index)}
                            isDisabled={isLoading}
                          >
                            Remove
                          </Button>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          opacity: 0,
                          cursor: "pointer",
                        }}
                      />
                      <VStack spacing={2}>
                        <Icon as={Upload} boxSize={["4", "6"]} />
                        <Box>
                          <Text fontWeight={500} fontSize={["sm", "md"]}>
                            Click to select images
                          </Text>
                          <Text fontSize={["xs", "sm"]} color="gray">
                            or drag and drop (Note: Only the first image will be saved)
                          </Text>
                        </Box>
                      </VStack>
                    </>
                  )}
              </Box>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button
            variant="ghost"
            onClick={handleClose}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            onClick={handleSubmit}
            isDisabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" mr={2} /> : null}
            {isLoading ? "Adding..." : "Add Spot"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddPreskoModal;
