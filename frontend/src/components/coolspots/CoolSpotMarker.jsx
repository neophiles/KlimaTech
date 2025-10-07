import { Marker, Popup } from "react-leaflet";

function CoolSpotMarker({ spot, onViewDetails, setSelectedSpot, setCoolSpots }) {

  function handleLike(id) {
    fetch(`/api/coolspots/${id}/like`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setSelectedSpot(prev => ({ ...prev, likes: data.likes }));
        setCoolSpots(prev =>
          prev.map(s => s.id === id ? { ...s, likes: data.likes } : s)
        );
      });
  }

  function handleDislike(id) {
    fetch(`/api/coolspots/${id}/dislike`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setSelectedSpot(prev => ({ ...prev, dislikes: data.dislikes }));
        setCoolSpots(prev =>
          prev.map(s => s.id === id ? { ...s, dislikes: data.dislikes } : s)
        );
      });
  }

  return (
    <Marker position={[spot.lat, spot.lon]}>
      <Popup>
        <strong>{spot.name}</strong>
        <br />
        Type: {spot.type}
        <br />
        {spot.reports && spot.reports.length > 0 && (
          <div>
            <hr />
            <strong>Reports:</strong>
            <ul>
              {spot.reports.map((r, idx) => (
                <li key={idx}>
                  {r.note} <br />
                  <small>{r.date} {r.time}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button onClick={() => onViewDetails(spot.id)}>
          View Details
        </button>
        <button onClick={() => handleLike(spot.id)}>▲</button>
        <span style={{ margin: "0 8px" }}>{spot.likes || 0}</span>
        <button onClick={() => handleDislike(spot.id)}>▼</button>
        <span style={{ margin: "0 8px" }}>{spot.dislikes || 0}</span>
      </Popup>
    </Marker>
  );
}

export default CoolSpotMarker;