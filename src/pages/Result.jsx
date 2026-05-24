import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, CheckCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // If someone refreshes the page and data is gone, send them back
  if (!state || !state.result) {
    return (
      <div className="p-8 text-center">
        <p>No diagnosis data found.</p>
        <Button onClick={() => navigate("/")}>Go Back</Button>
      </div>
    );
  }

  const { result, category } = state;

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm mb-6">
        <ArrowLeft size={16} /> Back to Form
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header section based on your Schema [cite: 4, 7, 8] */}
        <div className="bg-card border rounded-3xl p-6 text-center shadow-sm">
          <p className="text-sm uppercase tracking-wider text-muted-foreground">{category} Diagnosis</p>
          <h1 className="text-3xl font-bold mt-1">{result.diagnosis_name}</h1>
          <div className="flex justify-center gap-4 mt-4">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase">
              Confidence: {result.confidence}
            </span>
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">
              Severity: {result.severity}
            </span>
          </div>
        </div>

        {/* Explanation section [cite: 5] */}
        <div className="space-y-2">
          <h2 className="font-bold flex items-center gap-2"><AlertCircle size={18}/> What this means</h2>
          <p className="text-muted-foreground bg-muted/30 p-4 rounded-2xl border leading-relaxed">
            {result.explanation}
          </p>
        </div>

        {/* Treatments section [cite: 5] */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-2xl bg-green-50/50">
            <h3 className="font-bold text-green-700 flex items-center gap-2 mb-2">
              <CheckCircle size={16}/> Organic Treatment
            </h3>
            <p className="text-sm">{result.organic_treatment}</p>
          </div>
          <div className="p-4 border rounded-2xl bg-blue-50/50">
            <h3 className="font-bold text-blue-700 flex items-center gap-2 mb-2">
              <ShieldCheck size={16}/> Chemical Treatment
            </h3>
            <p className="text-sm">{result.chemical_treatment}</p>
          </div>
        </div>

        <Button onClick={() => navigate("/")} className="w-full h-14 rounded-2xl text-lg mt-4">
          Done
        </Button>
      </motion.div>
    </div>
  );
}