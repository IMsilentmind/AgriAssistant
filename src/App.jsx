import { Routes, Route } from "react-router-dom";
import Diagnose from "./pages/Diagnose"; // Or wherever your Diagnose.jsx is
// import Result from "./pages/Result"; // We will fix this one next

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Diagnose />} />
        
        {/* Diagnosis Page */}
        <Route path="/diagnose" element={<Diagnose />} />

        {/* Result Page (We will create/fix this next) */}
        <Route path="/result" element={<div>Result Page Coming Soon</div>} />
      </Routes>
    </div>
  );
}

export default App;