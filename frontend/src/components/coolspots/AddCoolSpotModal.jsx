import React, { useState } from "react";

function AddCoolSpotModal({ show, onClose, onSubmit, barangays }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Park");
  const [photo, setPhoto] = useState(null);
  const [barangayId, setBarangayId] = useState(""); 

  if (!show) return null;

  return (
    <div className="modal">
      <h2>Add a Cool Spot!</h2>
      <form onSubmit={e => {
        e.preventDefault();
        onSubmit({ barangay_id: barangayId, name, description, type, photo });
      }}>
        <input
          type="text"
          placeholder="Name of Place"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <select
          value={barangayId}
          onChange={e => setBarangayId(e.target.value)}
          required
        >

          {/*TODO: instead of options, we need to automatically populate this based on user's location*/}
          <option value="">Select Barangay</option>
          {barangays.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="Park">Park</option>
          <option value="Shaded Area">Shaded Area</option>
          <option value="Water Source">Water Source</option>
          {/* Add more types as needed */}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={e => setPhoto(e.target.files[0])}
        />
        <button type="submit">Pin to Map</button>
      </form>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default AddCoolSpotModal;