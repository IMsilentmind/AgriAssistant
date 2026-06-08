import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button.jsx";

import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sprout,
  Bug,
  Zap,
  WifiOff,
  Wifi,
} from "lucide-react";

import SubjectForm from "@/components/diagnose/SubjectForm";
import ImageUploader from "@/components/diagnose/ImageUploader";
import SymptomInput from "@/components/diagnose/SymptomInput";

import { useNetworkStatus } from "@/lib/networkStatus";

const diagnoseCrop = async (payload) => {
  const response = await fetch(
    "https://agriassistant-3afj.onrender.com/api/diagnose",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Diagnosis request failed");
  }

  return await response.json();
};

export default function Diagnose() {
  const navigate = useNavigate();
  const networkStatus = useNetworkStatus();

  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get("category") || "";

  const [category, setCategory] = useState(initialCategory);
  const [step, setStep] = useState(initialCategory ? 1 : 0);

  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStage, setAnalyzeStage] = useState("");

  const [formData, setFormData] = useState({
    subject_name: "",
    subject_type: "",
    age: "",
    season: "",
    affected_area: "",
    region: "",
  });

  const [imageUrl, setImageUrl] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const canProceedStep1 = formData.subject_type;
  const canAnalyze = imageUrl || symptoms.trim().length > 5;

  const isOffline = networkStatus === "offline";
  const isPoorConnection = networkStatus === "poor";

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setStep(1);
  };

  const handleAnalyze = async () => {
    alert("Button clicked");

    setAnalyzing(true);
    setAnalyzeStage("Connecting to AI server...");

    try {
      alert("About to call backend");

      const res = await diagnoseCrop({
        category,
        symptoms,
        imageUrl,
      });

      alert("Backend replied");

      setAnalyzing(false);

      navigate("/result", {
        state: {
          result: {
            diagnosis_name: res.diagnosis_name || "AI Diagnosis",
            confidence: res.confidence || "medium",
            severity: res.severity || "moderate",
            explanation: res.explanation || res.result || "",
            organic_treatment: res.organic_treatment || "",
            chemical_treatment: res.chemical_treatment || "",
            prevention_tips: res.prevention_tips || "",
          },
        },
      });
    } catch (error) {
      setAnalyzing(false);
      console.error(error);
      alert("Diagnosis failed. Check backend.");
    }
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <button
        onClick={() => (step > 0 ? setStep(step - 1) : navigate("/"))}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <AnimatePresence>
        {(isOffline || isPoorConnection) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 mb-4 text-sm font-medium ${
              isOffline
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {isOffline ? (
              <WifiOff className="w-4 h-4" />
            ) : (
              <Wifi className="w-4 h-4" />
            )}

            <span>
              {isOffline
                ? "No internet — offline mode active"
                : "Weak connection — offline recommended"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 mb-6">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              s <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-bold">Choose Category</h2>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <button
                onClick={() => handleCategorySelect("crops")}
                className="p-6 border rounded-2xl"
              >
                <Sprout className="w-8 h-8 text-primary mx-auto" />
                <p className="text-center mt-2">Crops</p>
              </button>

              <button
                onClick={() => handleCategorySelect("livestock")}
                className="p-6 border rounded-2xl"
              >
                <Bug className="w-8 h-8 text-secondary mx-auto" />
                <p className="text-center mt-2">Livestock</p>
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1">
            <h2 className="text-xl font-bold">
              {category === "crops" ? "Crop Details" : "Animal Details"}
            </h2>

            <SubjectForm
              category={category}
              formData={formData}
              setFormData={setFormData}
            />

            <Button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full mt-4"
            >
              Continue <ArrowRight />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2">
            <h2 className="text-xl font-bold">Add Evidence</h2>

            <ImageUploader
              imageUrl={imageUrl}
              onImageUploaded={setImageUrl}
            />

            <SymptomInput
              category={category}
              value={symptoms}
              onChange={setSymptoms}
            />

            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze || analyzing}
              className="w-full mt-4"
            >
              {analyzing ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  {analyzeStage || "Analysing..."}
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Get AI Diagnosis
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}