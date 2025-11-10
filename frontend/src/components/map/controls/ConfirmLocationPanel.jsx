export default function ConfirmLocationPanel({ pendingSpot, centerCoords, onConfirm, onCancel }) {
  const disabled = !pendingSpot || !centerCoords;
  return (
    <div className="confirm-new-preskospot">
      <button
        className="confirm"
        disabled={disabled}
        onClick={() => onConfirm && onConfirm(centerCoords)}
      >
        Confirm
      </button>
      <button
        className="cancel"
        style={{ marginLeft: 8 }}
        onClick={() => onCancel && onCancel()}
      >
        Cancel
      </button>
    </div>
  );
}