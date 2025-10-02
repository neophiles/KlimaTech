export function getIndexByHeat(heatIndex) {
    if (heatIndex < 27) return 0; // safe
    if (heatIndex < 32) return 1; // caution
    if (heatIndex < 41) return 2; // extreme caution
    if (heatIndex < 54) return 3; // danger
    return 4; // extreme danger
}

export function getColorByIndex(index) {
    const COLORS = ["#409aafff", "#49b446ff", "#f0c031ff", "#f17743ff", "#E23F3F"];
    return COLORS[index];
}

export function formatFullTime(timestamp) {
    return timestamp 
        ? new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        : "--:--";
}

export function formatHourLabel(timestamp, start, end) {
    if (!timestamp) return "--";

    const date = new Date(timestamp);
    const hour = date.getHours(); // 0–23

    // Only allow 5 AM (5) through 7 PM (19)
    if (hour < start || hour > end) return;

    return date.toLocaleTimeString([], {
        hour: "numeric",
        hour12: true
    });
}