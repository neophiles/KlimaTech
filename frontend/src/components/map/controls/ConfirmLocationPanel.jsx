import React from "react";

/**
 * Small floating confirm panel used when pinning is active.
 * props:
 *  - pendingSpot (object) : metadata for the spot (name, barangay_id, etc)
 *  - centerCoords : [lat, lon]
 *  - onConfirm(formCreator)
 *  - onCancel
 */
export default function ConfirmLocationPanel({ pendingSpot, centerCoords, onConfirm, onCancel }) {
  const disabled = !pendingSpot || !centerCoords;
  return (
    <div style={{
      position: "absolute",
      bottom: "80px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1000,
      background: "white",
      padding: "10px 16px",
      borderRadius: "12px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
    }}>
      <button disabled={disabled} onClick={() => onConfirm && onConfirm(centerCoords)}>Confirm Location</button>
      <button style={{ marginLeft: 8 }} onClick={() => onCancel && onCancel()}>Cancel</button>
    </div>
  );
}