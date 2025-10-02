import { Marker, Popup } from "react-leaflet";

function CoolSpotMarker({ spot, onViewDetails }) {
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
      </Popup>
    </Marker>
  );
}

export default CoolSpotMarker;