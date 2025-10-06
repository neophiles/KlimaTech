import { useState, useEffect } from "react";
import {
  fetchAllCoolSpots,
  fetchCoolSpotDetails,
  addCoolSpot,
  submitReport,
} from "../api/coolspots";

export function useCoolSpots() {
  const [coolSpots, setCoolSpots] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reportNote, setReportNote] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  // Fetch on mount
  useEffect(() => {
    fetchAllCoolSpots()
      .then(setCoolSpots)
      .catch((err) => console.error(err));
  }, []);

  async function handleAddSpot(newSpot) {
    try {
      const spot = await addCoolSpot(newSpot);
      setCoolSpots((prev) => [...prev, spot]);
    } catch {
      alert("Failed to add cool spot");
    }
  }

  async function handleViewDetails(id) {
    try {
      const data = await fetchCoolSpotDetails(id);
      setSelectedSpot(data);
      setShowModal(true);
    } catch {
      alert("Failed to fetch details");
    }
  }

  async function handleSubmitReport() {
    if (!selectedSpot) return;
    setReportSubmitting(true);
    try {
      await submitReport(selectedSpot.id, reportNote);
      const updated = await fetchCoolSpotDetails(selectedSpot.id);
      setSelectedSpot(updated);
      setReportNote("");
    } catch {
      alert("Failed to submit report");
    } finally {
      setReportSubmitting(false);
    }
  }

  return {
    coolSpots,
    selectedSpot,
    showModal,
    reportNote,
    reportSubmitting,
    setReportNote,
    setShowModal,
    handleAddSpot,
    handleViewDetails,
    handleSubmitReport,
  };
}