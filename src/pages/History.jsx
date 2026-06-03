import { useState } from "react";

export default function History() {
  const [search, setSearch] = useState("");

  const diagnoses = [];

  const filteredDiagnoses = diagnoses.filter((d) =>
    d.diagnosis_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">
        Diagnosis History
      </h2>

      <p className="text-gray-500 mb-4">
        Previous diagnoses will appear here.
      </p>

      <input
        type="text"
        placeholder="Search diagnoses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg p-2 w-full mb-4"
      />

      {filteredDiagnoses.length === 0 ? (
        <div className="border rounded-lg p-6 text-center">
          No diagnosis history available yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDiagnoses.map((d) => (
            <div
              key={d.id}
              className="border rounded-lg p-4"
            >
              <h3 className="font-bold">
                {d.diagnosis_name}
              </h3>

              <p>{d.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}