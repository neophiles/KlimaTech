import React, { useState } from "react";

function Carousel({ images }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={images[idx]}
        alt={`photo-${idx}`}
        style={{ width: "90%", borderRadius: "16px", marginBottom: "8px" }}
      />
      <div>
        <button
          onClick={() => setIdx((idx - 1 + images.length) % images.length)}
          disabled={images.length < 2}
        >{"<"}</button>
        <span style={{ margin: "0 8px" }}>
          {idx + 1} / {images.length}
        </span>
        <button
          onClick={() => setIdx((idx + 1) % images.length)}
          disabled={images.length < 2}
        >{">"}</button>
      </div>
    </div>
  );
}

export default Carousel;