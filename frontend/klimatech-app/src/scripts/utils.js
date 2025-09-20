export function getIndexByHeat(heatIndex) {
    if (heatIndex < 27) return 0; // very cool
    if (heatIndex < 32) return 1; // cool
    if (heatIndex < 41) return 2; // moderate
    if (heatIndex < 54) return 3; // hot
    return 4; // extreme
}