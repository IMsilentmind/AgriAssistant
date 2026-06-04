import { useNavigate } from "react-router-dom";
import heroImage from"../Assets/hero-farm.jpg";
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="relative rounded-3xl overflow-hidden mb-12">
          <img
            src={heroImage}
            alt="AgriAssistant"
            className="w-full h-[500px] object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-6">
            <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur text-white text-sm font-medium mb-4">
              Built for African Agriculture
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              AgriAssistant
            </h1>

            <p className="text-xl text-white max-w-2xl">
              Smarter crop and livestock health support for farmers,
              cooperatives and agricultural professionals.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <button
            onClick={() => navigate("/diagnose")}
            className="px-8 py-4 rounded-xl bg-primary text-white font-semibold"
          >
            Start Free Diagnosis
          </button>

          <button
            className="px-8 py-4 rounded-xl border font-semibold"
          >
            Login
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mb-16">
          3 free diagnoses before registration
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-2">
              Crop Diagnosis
            </h3>

            <p>
              Identify diseases, pests and nutrient deficiencies from symptoms and images.
            </p>
          </div>

          <div className="border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-2">
              Livestock Health
            </h3>

            <p>
              Get guidance on common animal health conditions and treatments.
            </p>
          </div>

          <div className="border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-2">
              Offline Support
            </h3>

            <p>
              Continue receiving basic diagnosis support even with poor connectivity.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}