// Handler to add a new cool spot (called from AddSpotOnClick)
function handleAddSpot(newSpot) {
fetch("/api/coolspots/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSpot)
})
    .then(res => res.json())
    .then(spot => setCoolSpots(prev => [...prev, spot]))
    .catch(err => alert("Failed to add cool spot"));
setAddMode(false);
}

// Handler to view details of a cool spot
function handleViewDetails(id) {
fetch(`/api/coolspots/${id}`)
    .then(res => res.json())
    .then(data => {
    setSelectedSpot(data);
    setShowModal(true);
    })
    .catch(err => alert("Failed to fetch details"));
}