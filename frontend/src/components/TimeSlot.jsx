import { getColorByIndex } from "../scripts/utils";

function TimeSlot({ time, heatIndex, index }) {
    const yOffsets = [20, 10, 0, -10, 20];

    return (
        <div className="slot-column">
            <span>{time}</span>
            <div
                className="slot-capsule"
                style={{
                    backgroundColor: getColorByIndex(index),
                    transform: `translateY(${yOffsets[index]}px)`
                }}
            >
                <span>{heatIndex}°C</span>
                <span>🌥️</span>
            </div>
        </div>
    );
}

export default TimeSlot;