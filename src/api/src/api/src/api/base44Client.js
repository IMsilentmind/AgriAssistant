export async function diagnoseCrop(data) {
  const response = await fetch("http://localhost:5000/api/diagnose", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Diagnosis request failed");
  }

  return await response.json();
}