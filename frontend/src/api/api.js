export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, options);

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return await res.json();
  } else {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
}
