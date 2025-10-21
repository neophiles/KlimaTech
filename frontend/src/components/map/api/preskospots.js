const BASE = "/api/coolspots";

export async function getAll() {
  const res = await fetch(`${BASE}/all`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getById(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function add(formData) {
  const res = await fetch(`${BASE}/add`, { method: "POST", body: formData });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function report(spotId, formData) {
  const res = await fetch(`${BASE}/${spotId}/report`, { method: "POST", body: formData });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function vote(spotId, type) {
  const res = await fetch(`${BASE}/${spotId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vote: type })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json(); // expected { likes, dislikes, user_vote }
}

export async function getVotes(spotId) {
  const res = await fetch(`${BASE}/${spotId}/votes`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getReports(spotId) {
  const res = await fetch(`${BASE}/${spotId}/reports`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}