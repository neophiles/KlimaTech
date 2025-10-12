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
            capture="environment"
            style={{ display: "none" }}
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          {!photo ? (
            <>
              <img src="/camera-icon.png" alt="Camera Icon" className="image-upload-icon" />
              <div className="image-upload-text">📸 Take or Upload a Photo</div>
              <div className="image-upload-subtext">
                Tap to open camera or choose from gallery
              </div>
            </>
          ) : (
            <img
              src={URL.createObjectURL(photo)}
              alt="Preview"
              className="image-preview"
            />
          )}
        </div>


        <button
          type="submit"
          disabled={!barangay}
          className="pin-to-map-btn"
        >
          <span className="pin-to-map-icon" aria-label="pin">
            {/* SVG location icon for crisp look */}
            <svg viewBox="0 0 24 24" fill="white" width="22" height="22">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
            </svg>
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