import { TimeSlot } from "./TimeSlot";

export function TimeSlotContainer({ hours }) {
    if (!hours) return null;
    return (
        <div className="slot-container">
            {hours.map((h) => (
                <TimeSlot key={h.hour} time={h.hour} heatIndex={h.heat_index} color={h.color} />
            ))}
        </div>
    );
}