import { TimeSlotContainer } from "./TimeSlotContainer";

export function HeatClockWidget({ safeHours, hotHours }) {
    return (
        <div className="base-widget heat-clock-widget">
            <h1>Safe Hours</h1>
            <TimeSlotContainer hours={safeHours} />
            <h1>Hot Hours</h1>
            <TimeSlotContainer hours={hotHours} />
        </div>
    );
}