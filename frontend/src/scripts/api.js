export async function fetchWeatherData(barangayId) {
  const res = await fetch(`/api/barangays/${barangayId}`);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return await res.json();
}

export async function fetchForecastData() {
  const res = await fetch(`/api/barangays/${barangayId}/forecast`);
  if (!res.ok) throw new Error('Failed to fetch forecast data');
  return await res.json();
}