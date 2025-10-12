import React, { useState } from "react";

function Carousel({ images }) {
  const [idx, setIdx] = useState(0);

  // Filter out empty or invalid URLs
  const validImages = images?.filter((img) => img) || [];

  if (validImages.length === 0) return null;

  return (
    <div style={{ textAlign: "center" }}>
      <img
        src={validImages[idx]}
        alt={`photo-${idx}`}
        style={{
          width: "100%",        
          maxWidth: "300px",    
          height: "100px",       
          objectFit: "cover",   
          borderRadius: "16px",
          marginBottom: "8px"
        }}
      />
      {validImages.length > 1 && (
        <div>
          <button
            onClick={() => setIdx((idx - 1 + validImages.length) % validImages.length)}
          >
            {"<"}
          </button>
          <span style={{ margin: "0 8px" }}>
            {idx + 1} / {validImages.length}
          </span>
          <button
            onClick={() => setIdx((idx + 1) % validImages.length)}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Carousel;
