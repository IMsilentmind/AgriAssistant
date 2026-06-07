export async function diagnoseCrop(data) {
  const response = await fetch(
    "https://agriassistant-3afj.onrender.com/api/diagnose",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Diagnosis request failed");
  }

  return await response.json();
}