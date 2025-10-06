import React, { useState } from "react";

function AddCoolSpotModal({ show, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Park");
  const [photo, setPhoto] = useState(null);

  if (!show) return null;

  return (
    <div className="modal">
      <h2>Add a Cool Spot!</h2>
      <form onSubmit={e => {
        e.preventDefault();
        onSubmit({ name, description, type, photo });
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