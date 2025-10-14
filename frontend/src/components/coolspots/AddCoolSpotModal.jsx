import React, { useState, useEffect } from "react";
import "./AddCoolSpotModal.css";
import Button from "../Button";

function AddCoolSpotModal({ show, onClose, onSubmit, barangays }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
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
        className="coolspot-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!barangay) return alert("Barangay not detected yet.");
          onSubmit({
            barangay_id: barangay.id,
            name,
            type,
            description,
            address,
            landmark,
            photo,
          });
        }}
      >

        {/* Name Field */}
        <input
          className="input-field"
          type="text"
          placeholder="e.g., Tambayan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Category Dropdown */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field"
        >
          <option value="" disabled hidden>-- Select Spot Type --</option>
          <option value="Park">Park</option>
          <option value="Shaded Area">Shaded Area</option>
          <option value="Water Source">Water Source</option>
          <option value="Air-Conditioned Area">Air-Conditioned Area</option>
          <option value="Waiting Shed">Waiting Shed</option>
          <option value="Gazebo / Pavilion">Gazebo / Pavilion</option>
        </select>

        {/* Description Field */}
        <input
          className="input-field"
          type="text"
          placeholder="e.g., Malawak, Goods for mag tro-tropa"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Address Field */}
        <input
          className="input-field"
          type="text"
          placeholder="Address (e.g., Quezon Ave., Lucena)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        {/* Landmark Field */}
        <input
          className="input-field"
          type="text"
          placeholder="Nearest landmark (e.g., beside 7-Eleven)"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
        />
        
        {/* Upload Image */}
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
      
      <Button
        otherClass={"cancel"}
        onClick={onClose}
        children={
          <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        }
      />
    </div>
  );
}

export default AddCoolSpotModal;