import {
  Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody,
  ModalCloseButton,
  Box, VStack, HStack,
  Heading, Text, Icon, Image,
  useColorModeValue,
  Button, Textarea,
  useToast, Divider,
} from '@chakra-ui/react'

import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import api from "../../../api/axios";
import { useState, useEffect } from 'react';
import { useCurrentUser } from '../../../hooks/useCurrentUser';

function PreskoModal({ isOpen, onClose, spot }) {
  if (!spot) return null;

  const { user, isLoading: userLoading } = useCurrentUser();
  const [likes, setLikes] = useState(spot?.likes || 0);
  const [dislikes, setDislikes] = useState(spot?.dislikes || 0);
  const [userVote, setUserVote] = useState(null);
  const [reportText, setReportText] = useState("");
  const [reports, setReports] = useState(spot?.reports || []);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isLoadingVotes, setIsLoadingVotes] = useState(false);
  const toast = useToast();

  // Move all useColorModeValue calls to top level
  const textColor = useColorModeValue("black", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const reportBgColor = useColorModeValue("gray.50", "gray.800");
  const reportTextColor = useColorModeValue("gray.500", "gray.400");
  const headerTextColor = useColorModeValue("gray.600", "gray.400");
  const emptyTextColor = useColorModeValue("gray.500", "gray.500");

  const getImageUrl = (path) => {
    if (!path) return null;
    const baseUrl = api.defaults.baseURL;
    return path.startsWith('http') ? path : `${baseUrl}${path}`;
  };

  // Fetch vote status for the current user
  useEffect(() => {
    if (isOpen && spot?.id && user?.id) {
      fetchUserVote();
    }
  }, [isOpen, spot?.id, user?.id]);

  // Update reports when spot changes
  useEffect(() => {
    if (isOpen && spot?.id) {
      fetchReports();
    }
  }, [isOpen, spot?.id]);

  const fetchReports = async () => {
    try {
      const response = await api.get(`/coolspots/${spot.id}`);
      setReports(response.data.reports || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchUserVote = async () => {
    try {
      setIsLoadingVotes(true);
      const response = await api.get(`/coolspots/${spot.id}/votes`, {
        params: { user_id: user.id }
      });
      setUserVote(response.data.user_vote);
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
    } catch (error) {
      console.error("Error fetching vote status:", error);
    } finally {
      setIsLoadingVotes(false);
    }
  };

  const handleVote = async (voteType) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to vote",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const endpoint = voteType === "like" 
        ? `/coolspots/${spot.id}/like`
        : `/coolspots/${spot.id}/dislike`;
      
      await api.post(endpoint, null, {
        params: { user_id: user.id }
      });

      // Update vote status
      await fetchUserVote();
      toast({
        title: "Success",
        description: `${voteType.charAt(0).toUpperCase() + voteType.slice(1)} recorded!`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error(`Error ${voteType}ing spot:`, error);
      toast({
        title: "Error",
        description: `Failed to ${voteType} this spot`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmitReport = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to submit a report",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!reportText.trim()) {
      toast({
        title: "Error",
        description: "Report cannot be empty",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmittingReport(true);
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("note", reportText);

      await api.post(
        `/coolspots/${spot.id}/report`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Refresh reports to get the latest list with proper usernames from backend
      await fetchReports();
      setReportText("");
      
      toast({
        title: "Success",
        description: "Report submitted successfully!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="lg"
    >
      <ModalOverlay />
      <ModalContent
        maxW="min(90%, 450px)"
        maxH="min(90%, 450px)"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
          {spot.photo_url ? (
            <Image src={getImageUrl(spot.photo_url)} h="150px" w="100%" objectFit="cover" />
          ) : (
            <Box h="150px" w="100%" bg="whiteAlpha.500" gap="10px" />
          )}
            
          <ModalHeader pb="2">
            <Heading size="md">{spot?.name || "PreskoSpot"}</Heading>
            <Text fontSize="sm" color={headerTextColor} mt="1">
              {spot?.type || "N/A"}
            </Text>
            <Text fontSize="xs" color={emptyTextColor} mt="2">
              {spot?.description || "N/A"}
            </Text>
          </ModalHeader>
          <ModalCloseButton 
            colorScheme="brand"
            variant="filled"
          />

          <ModalBody 
            overflowY="auto"
            flex="1"
            pb="4"
            sx={{
              "::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {/* Like/Dislike Section */}
            <VStack align="start" spacing="4" w="100%">
              <Box w="100%">
                <Text fontSize="sm" fontWeight="bold" mb="2">Rate this spot:</Text>
                <HStack spacing="0">
                  <Button
                    size="sm"
                    variant={userVote === "like" ? "solid" : "ghost"}
                    colorScheme={userVote === "like" ? "green" : "gray"}
                    onClick={() => handleVote("like")}
                    isLoading={isLoadingVotes}
                    isDisabled={userLoading}
                    leftIcon={<Icon as={ThumbsUp} boxSize={5} />}
                  >
                    {likes}
                  </Button>
                  <Button
                    size="sm"
                    variant={userVote === "dislike" ? "solid" : "ghost"}
                    colorScheme={userVote === "dislike" ? "red" : "gray"}
                    onClick={() => handleVote("dislike")}
                    isLoading={isLoadingVotes}
                    isDisabled={userLoading}
                    leftIcon={<Icon as={ThumbsDown} boxSize={5} />}
                  >
                    {dislikes}
                  </Button>
                </HStack>
              </Box>

              <Divider />

              {/* Reports/Comments Section */}
              <Box w="100%">
                <Text fontSize="sm" fontWeight="bold" mb="3">Reports & Comments:</Text>
                
                {/* Report Input */}
                <VStack spacing="2" mb="4">
                  <Textarea
                    placeholder="Share your experience or report an issue..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    size="sm"
                    resize="vertical"
                    isDisabled={isSubmittingReport || userLoading}
                  />
                  <Button
                    size="sm"
                    colorScheme="brand"
                    w="100%"
                    onClick={handleSubmitReport}
                    isLoading={isSubmittingReport}
                    isDisabled={userLoading || !reportText.trim()}
                    rightIcon={<Send size={16} />}
                  >
                    Submit Report
                  </Button>
                </VStack>

                {/* Reports List */}
                <VStack align="start" spacing="3" w="100%">
                  {reports && reports.length > 0 ? (
                    reports.map((report, index) => (
                      <Box
                        key={report.id || `report-${index}-${report.date}-${report.time}`}
                        p="3"
                        border="1px"
                        borderColor={borderColor}
                        borderRadius="md"
                        w="100%"
                        bg={reportBgColor}
                      >
                        <HStack justify="space-between" mb="1">
                          <Text fontSize="xs" fontWeight="bold" color={textColor}>
                            {report.username || "Anonymous"}
                          </Text>
                          <Text fontSize="xs" color={reportTextColor}>
                            {report.date} {report.time}
                          </Text>
                        </HStack>
                        <Text fontSize="xs" color={textColor} whiteSpace="pre-wrap">
                          {report.note}
                        </Text>
                        {report.photo_url && (
                          <Image
                            src={getImageUrl(report.photo_url)}
                            maxH="120px"
                            mt="2"
                            borderRadius="md"
                            objectFit="cover"
                          />
                        )}
                      </Box>
                    ))
                  ) : (
                    <Text fontSize="xs" color={emptyTextColor} textAlign="center" w="100%">
                      No reports yet. Be the first to share!
                    </Text>
                  )}
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default PreskoModal;
