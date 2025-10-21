import { useState } from "react";

function Carousel({ images }) {
  const [idx, setIdx] = useState(0);

  // Filter out empty or invalid URLs
  const validImages = images?.filter((img) => img) || [];

  return (
    <div className="carousel">
      {validImages.length === 0 ? (
        <div className="no-img">No Image</div>
      ) : validImages.length === 1 ? (
        <img
          src={validImages[idx]}
          alt={`photo-${idx}`}
        />
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() =>
              setIdx((idx - 1 + validImages.length) % validImages.length)
            }
          >
            {"<"}
          </button>

          <img
            src={validImages[idx]}
            alt={`photo-${idx}`}
          />

          <button
            onClick={() => setIdx((idx + 1) % validImages.length)}
          >
            {">"}
          </button>

          <span style={{ margin: "0 8px" }}>
            {idx + 1} / {validImages.length}
          </span>
        </div>
      )}
    </div>
  );
}

export default Carousel;
