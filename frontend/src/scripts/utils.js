export function getIndexByHeat(heatIndex) {
    if (heatIndex < 27) return 0; // very cool
    if (heatIndex < 32) return 1; // cool
    if (heatIndex < 41) return 2; // moderate
    if (heatIndex < 54) return 3; // hot
    return 4; // extreme
}

export function getColorByIndex(index) {
    const COLORS = ["#4caf50", "#cddc39", "#ffeb3b", "#ff9800", "#f44336"];
    return COLORS[index];
}