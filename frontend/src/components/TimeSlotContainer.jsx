import TimeSlot from "./TimeSlot";

function TimeSlotContainer({ hours }) {
    if (!hours) return null;
    return (
        <div className="slot-container">
            {hours.map((h) => (
                <TimeSlot key={h.hour} time={h.hour} heatIndex={h.heat_index} index={h.index} />
            ))}
        </div>
    );
}

export default TimeSlotContainer;