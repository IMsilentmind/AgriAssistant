import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state?.result;

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          No Result Found
        </h1>

        <button
          onClick={() => navigate("/diagnose")}
          className="px-4 py-2 rounded-xl border"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Diagnosis Result
        </h1>

        <button
          onClick={() => navigate("/diagnose")}
          className="px-4 py-2 rounded-xl border"
        >
          New Diagnosis
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="border rounded-2xl p-4 bg-white">
          <p className="text-sm text-gray-500">Confidence</p>
          <p className="text-xl font-bold capitalize">
            {data.confidence}
          </p>
        </div>

        <div className="border rounded-2xl p-4 bg-white">
          <p className="text-sm text-gray-500">Severity</p>
          <p className="text-xl font-bold capitalize">
            {data.severity}
          </p>
        </div>

      </div>

      <div className="border rounded-2xl p-5 bg-white">
        <h2 className="font-bold text-lg mb-2">
          Diagnosis
        </h2>
        <p>{data.diagnosis_name}</p>
      </div>

      <div className="border rounded-2xl p-5 bg-white">
        <h2 className="font-bold text-lg mb-2">
          Explanation
        </h2>
        <p>{data.explanation}</p>
      </div>

      <div className="border rounded-2xl p-5 bg-white">
        <h2 className="font-bold text-lg mb-2">
          Organic Treatment
        </h2>
        <p>{data.organic_treatment}</p>
      </div>

      <div className="border rounded-2xl p-5 bg-white">
        <h2 className="font-bold text-lg mb-2">
          Chemical Treatment
        </h2>
        <p>{data.chemical_treatment}</p>
      </div>

      <div className="border rounded-2xl p-5 bg-white">
        <h2 className="font-bold text-lg mb-2">
          Prevention Tips
        </h2>
        <p>{data.prevention_tips}</p>
      </div>

    </div>
  );
}