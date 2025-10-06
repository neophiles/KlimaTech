export async function fetchAllCoolSpots() {
  const res = await fetch("/api/coolspots/all");
  if (!res.ok) throw new Error("Failed to fetch cool spots");
  return res.json();
}

export async function fetchCoolSpotDetails(id) {
  const res = await fetch(`/api/coolspots/${id}`);
  if (!res.ok) throw new Error("Failed to fetch cool spot details");
  return res.json();
}

export async function addCoolSpot(newSpot) {
  const res = await fetch("/api/coolspots/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSpot),
  });
  if (!res.ok) throw new Error("Failed to add cool spot");
  return res.json();
}

export async function submitReport(spotId, note) {
  const res = await fetch(`/api/coolspots/${spotId}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: 0, note }),
  });
  if (!res.ok) throw new Error("Failed to submit report");
  return res.json();
}