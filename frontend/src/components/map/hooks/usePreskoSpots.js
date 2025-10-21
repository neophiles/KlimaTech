import { useState, useEffect, useCallback } from "react";

/**
 * Manages fetching and mutating cool spots.
 * - fetchAll on mount
 * - provides helpers: getSpotById, addSpot(formData), submitReport(spotId, formData)
 */
export default function usePreskoSpots(initial = []) {
  const [coolSpots, setCoolSpots] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/coolspots/all");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCoolSpots(data);
    } catch (err) {
      console.error("useCoolSpots.fetchAll", err);
      setError(err.message || "Failed to load cool spots");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const getSpotById = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/coolspots/${id}`);
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      console.error("useCoolSpots.getSpotById", err);
      throw err;
    }
  }, []);

  const addSpot = useCallback(async (formData) => {
    try {
      const res = await fetch("/api/coolspots/add", {
        method: "POST",
        body: formData
      });
      if (!res.ok) throw new Error(await res.text());
      const newSpot = await res.json();
      setCoolSpots(prev => [...prev, newSpot]);
      return newSpot;
    } catch (err) {
      console.error("useCoolSpots.addSpot", err);
      throw err;
    }
  }, []);

  const submitReport = useCallback(async (spotId, formData) => {
    try {
      const res = await fetch(`/api/coolspots/${spotId}/report`, {
        method: "POST",
        body: formData
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit report");
      }
      // refresh specific spot
      const updated = await (await fetch(`/api/coolspots/${spotId}`)).json();
      setCoolSpots(prev => {
        const copy = [...prev];
        const idx = copy.findIndex(s => s.id === updated.id);
        if (idx !== -1) copy[idx] = { ...copy[idx], ...updated };
        else copy.push(updated);
        return copy;
      });
      return updated;
    } catch (err) {
      console.error("useCoolSpots.submitReport", err);
      throw err;
    }
  }, []);

  return {
    coolSpots,
    setCoolSpots,
    loading,
    error,
    refresh: fetchAll,
    getSpotById,
    addSpot,
    submitReport
  };
}