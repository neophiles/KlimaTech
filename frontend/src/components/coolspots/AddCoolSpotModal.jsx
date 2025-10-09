import React, { useState, useEffect } from "react";

function AddCoolSpotModal({ show, onClose, onSubmit, barangays }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Park");
  const [photo, setPhoto] = useState(null);
  const [barangay, setBarangay] = useState(null);
  const [loadingBarangay, setLoadingBarangay] = useState(true);

  // Get user location and fetch nearest barangay
  useEffect(() => {
    async function detectBarangay() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
              const res = await fetch(
                `api/barangays/nearest?lat=${lat}&lon=${lon}`
              );
              const data = await res.json();
              setBarangay(data); // { id, name }
            } catch (err) {
              console.error("Failed to fetch barangay:", err);
            } finally {
              setLoadingBarangay(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLoadingBarangay(false);
          }
        );
      } else {
        setLoadingBarangay(false);
      }
    }

    detectBarangay();
  }, []);

   if (!show) return null;

  return (
    <div className="modal">
      <h2>Add a Cool Spot!</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!barangay) return alert("Barangay not detected yet.");
          onSubmit({
            barangay_id: barangay.id,
            name,
            description,
            type,
            photo,
          });
        }}
      >
        <input
          type="text"
          placeholder="Name of Place"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="barangay-field">
          {loadingBarangay ? (
            <p>Detecting barangay...</p>
          ) : barangay ? (
            <p>
              <strong>Barangay:</strong> {barangay.name}
            </p>
          ) : (
            <p>Could not detect your barangay.</p>
          )}
        </div>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Park">Park</option>
          <option value="Shaded Area">Shaded Area</option>
          <option value="Water Source">Water Source</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />

        <button type="submit" disabled={!barangay}>
          Pin to Map
        </button>
      </form>

      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default AddCoolSpotModal;