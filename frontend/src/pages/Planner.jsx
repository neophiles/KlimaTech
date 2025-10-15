import React, { useState, useEffect } from "react";

function Planner() {
  const [userLocation, setUserLocation] = useState(null);
  const [barangays, setBarangays] = useState([]);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [tasks, setTasks] = useState([{ task: "", time: "" }]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => console.error("Failed to get location:", err)
    );
  }, []);

  // Fetch barangays when location is ready
  useEffect(() => {
    if (!userLocation) return;
    const { lat, lon } = userLocation;
    fetch(`/api/barangays/all?lat=${lat}&lon=${lon}`)
      .then((res) => res.json())
      .then((data) => setBarangays(data))
      .catch((err) => console.error("Failed to fetch barangays:", err));
  }, [userLocation]);

  const addTask = () => setTasks([...tasks, { task: "", time: "" }]);
  const updateTask = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const submitTasks = async () => {
    if (!selectedBarangay) return alert("Select a barangay first!");
    if (tasks.length === 0 || tasks.every((t) => !t.task || !t.time))
      return alert("Add at least one task with time.");

    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const res = await fetch("/api/suggestions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barangay_id: selectedBarangay.id, tasks }),
      });
      if (!res.ok) throw new Error("Failed to get suggestions from server.");
      const data = await res.json();
      setSuggestions(data.length ? data : [{ task: "N/A", suggestion: "No suggestions available" }]);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-container" style={styles.container}>
      <h1 style={styles.title}>Planner</h1>

      {/* Select Barangay */}
      <div style={styles.section}>
        <label style={styles.label}>Select Barangay:</label>
        <select
          style={styles.select}
          value={selectedBarangay?.id || ""}
          onChange={(e) =>
            setSelectedBarangay(barangays.find((b) => b.id === parseInt(e.target.value)))
          }
        >
          <option value="">-- Select --</option>
          {barangays.map((b) => (
            <option key={b.id} value={b.id}>
              {b.barangay} ({b.locality})
            </option>
          ))}
        </select>
      </div>

      {/* Tasks */}
      <div style={styles.section}>
        <h2 style={styles.subtitle}>Tasks</h2>
        {tasks.map((t, i) => (
          <div key={i} style={styles.taskRow}>
            <input
              type="text"
              placeholder="Task"
              value={t.task}
              onChange={(e) => updateTask(i, "task", e.target.value)}
              style={styles.input}
              disabled={loading}
            />
            <input
              type="time"
              value={t.time}
              onChange={(e) => updateTask(i, "time", e.target.value)}
              style={styles.inputTime}
              disabled={loading}
            />
          </div>
        ))}
        <button onClick={addTask} style={styles.addButton} disabled={loading}>
          + Add Task
        </button>
      </div>

      {/* Submit */}
      <div style={styles.section}>
        <button onClick={submitTasks} style={styles.submitButton} disabled={loading}>
          {loading ? "Generating..." : "Get AI Suggestions"}
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={styles.section} id="suggestions">
          <h2 style={styles.subtitle}>AI Suggestions</h2>
          <ul style={styles.suggestionsList}>
            {suggestions.map((s, i) => (
              <li key={i} style={styles.suggestionItem}>
                <strong>{s.task}</strong>: {s.suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Inline styles for quick improvement
const styles = {
  container: { maxWidth: 700, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif" },
  title: { textAlign: "center", color: "#2c3e50" },
  section: { marginTop: 20, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 8 },
  label: { display: "block", marginBottom: 8, fontWeight: "bold" },
  select: { width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" },
  subtitle: { marginBottom: 10, color: "#34495e" },
  taskRow: { display: "flex", gap: 10, marginBottom: 10 },
  input: { flex: 2, padding: 8, borderRadius: 4, border: "1px solid #ccc" },
  inputTime: { flex: 1, padding: 8, borderRadius: 4, border: "1px solid #ccc" },
  addButton: {
    padding: "8px 12px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  submitButton: {
    padding: "10px 16px",
    backgroundColor: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    width: "100%",
  },
  error: { color: "red", marginTop: 8 },
  suggestionsList: { paddingLeft: 20 },
  suggestionItem: { marginBottom: 8 },
};

export default Planner;
