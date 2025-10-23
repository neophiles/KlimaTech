import React, { useState, useEffect } from "react";
import "./AddPreskoSpotModal.css";
import Button from "../../Button";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
                `${API_BASE_URL}/barangays/nearest?lat=${lat}&lon=${lon}`
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
    <div className="modal addcoolspot">
      <h2>Add a PreskoSpot!</h2>
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
          <option value="" disabled hidden>Piliin ang uri ng PreskoSpot</option>
          <option value="Park">Parke o Plaza</option>
          <option value="Covered Court">Covered Court</option>
          <option value="Barangay Hall">Barangay Hall</option>
          <option value="Place of Worship">Simbahan</option>
          <option value="Water Fountain">Water Fountain</option>
          <option value="Shaded Walkway">May Bubong na Lakaran</option>
          <option value="Waiting Shed">Hintayan / Waiting Shed</option>
          <option value="Waterside">Tabing-Tubig</option>
          <option value="Mall">Mall</option>
          <option value="Stall">Tindahan ng Palamig</option>
          <option value="Convenience Store">Convenience Store</option>
          <option value="Sari-sari Store">Sari-sari Store</option>
          <option value="Transportation Hub">Terminal o Sakayan</option>
          <option value="Eatery">Karinderya</option>
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
          <span>Pin to Map</span>
          {/* SVG location icon for crisp look */}
          <svg className="nav-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
          </svg>
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