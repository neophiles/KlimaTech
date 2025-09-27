const barangay_id = 1; // for testing

export async function fetchWeatherData() {
  const res = await fetch(`/api/barangays/${barangay_id}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return await res.json();
}