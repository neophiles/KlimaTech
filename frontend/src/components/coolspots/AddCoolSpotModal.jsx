import React, { useState, useEffect } from "react";
import "./AddCoolSpotModal.css"; // Import the CSS file

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
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Add a Cool Spot!</h2>
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
          placeholder="e.g., Tambayan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            marginBottom: 12,
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="text"
          placeholder="e.g., Malawak, Goods for mag tro-tropa"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{
            marginBottom: 12,
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            marginBottom: 12,
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <option value="Park">Park</option>
          <option value="Shaded Area">Shaded Area</option>
          <option value="Water Source">Water Source</option>
        </select>
        <div
          className="image-upload-box"
          onClick={() => document.getElementById("photo-input").click()}
        >
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <div
            style={{
              border: "2px dashed #bbb",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            <img
              src="/camera-icon.png"
              alt="Add an image"
              style={{ width: 40, marginBottom: 8 }}
            />
            <div style={{ color: "#888" }}>+ Add an image</div>
            {photo && <div style={{ marginTop: 8 }}>{photo.name}</div>}
          </div>
        </div>
        <button
          type="submit"
          disabled={!barangay}
          style={{
            background: "#007bff",
            color: "#fff",
            borderRadius: "24px",
            padding: "12px 24px",
            border: "none",
            fontWeight: "bold",
            marginTop: "16px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span role="img" aria-label="pin" style={{ marginRight: 8 }}>
            📍
          </span>
          Pin to Map
        </button>
      </form>
      <button
        onClick={onClose}
        style={{ marginTop: 12, width: "100%" }}
      >
        Cancel
      </button>
    </div>
  );
}

export default AddCoolSpotModal;
// filepath: c:\Users\PC\Desktop\COOL'to!\frontend\src\components\coolspots\AddCoolSpotModal.jsx