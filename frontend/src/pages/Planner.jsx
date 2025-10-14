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
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
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

  // Add a new empty task
  const addTask = () => setTasks([...tasks, { task: "", time: "" }]);

  // Update task value
  const updateTask = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  // Submit tasks to AI suggestion API
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
      setSuggestions(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="planner-container">
      <h1>Planner</h1>

      {/* Select Barangay */}
      <div>
        <label>Select Barangay:</label>
        <select
          value={selectedBarangay?.id || ""}
          onChange={(e) =>
            setSelectedBarangay(
              barangays.find((b) => b.id === parseInt(e.target.value))
            )
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
      <div>
        <h2>Tasks</h2>
        {tasks.map((t, i) => (
          <div key={i}>
            <input
              type="text"
              placeholder="Task"
              value={t.task}
              onChange={(e) => updateTask(i, "task", e.target.value)}
            />
            <input
              type="time"
              value={t.time}
              onChange={(e) => updateTask(i, "time", e.target.value)}
            />
          </div>
        ))}
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Submit */}
      <div>
        <button onClick={submitTasks} disabled={loading}>
          {loading ? "Generating..." : "Get AI Suggestions"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <h2>AI Suggestions</h2>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>
                <strong>{s.task}</strong>: {s.suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Planner;
