const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(import.meta.env.VITE_API_BASE_URL);

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