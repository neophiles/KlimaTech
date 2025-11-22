const API_BASE_URL = import.meta.env.VITE_API_URL;
console.log("API Base URL:", API_BASE_URL);

export async function fetchWeatherData(barangayId) {
  const res = await fetch(`${API_BASE_URL}/barangays/${barangayId}`);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return await res.json();
}

export async function fetchForecastData(barangayId) {
  const res = await fetch(`${API_BASE_URL}/barangays/${barangayId}/forecast`);
  if (!res.ok) throw new Error('Failed to fetch forecast data');
  return await res.json();
}

export async function fetchNearestBranch(lat, lon) {
  const res = await fetch(`${API_BASE_URL}/barangays/nearest?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to fetch nearest branch');
  return await res.json();
}
