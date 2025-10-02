export function TimeSlot({ time, heatIndex }) {
    return (
        <div className="slot-column">
            <span>{time}</span>
            <div className={`slot-capsule ${heatIndex < 33 ? "safe" : "hot"}`}>
                <span>{heatIndex}°C</span>
                <span>🌥️</span>
            </div>
        </div>
    );
}