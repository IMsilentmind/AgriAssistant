export async function diagnoseCrop(data) {
  const url = "http://localhost:5000/api/diagnose";

  alert("Sending diagnosis request to backend...");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    alert("Backend responded");

    if (!response.ok) {
      throw new Error("Backend responded with error");
    }

    return await response.json();
  } catch (error) {
    alert("Phone error: " + error.message);
    throw error;
  }
}