import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          AgriAssistant
        </h1>

        <p className="mb-6">
          AI-powered crop and livestock diagnosis.
        </p>

        <button
          className="border px-4 py-2 rounded-lg"
          onClick={() => navigate("/diagnose")}
        >
          Start Diagnosis
        </button>
      </div>
    </div>
  );
}