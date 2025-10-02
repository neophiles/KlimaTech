export function TimeSlot({ time, heatIndex, color }) {
    return (
        <div className="slot-column">
            <span>{time}</span>
            <div
                className="slot-capsule"
                style={{backgroundColor: color}}
            >
                <span>{heatIndex}°C</span>
                <span>🌥️</span>
            </div>
        </div>
    );
}