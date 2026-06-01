import { Routes, Route } from "react-router-dom";
import Diagnose from "./pages/Diagnose";
import Result from "./pages/Result";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Diagnose />} />
        <Route path="/diagnose" element={<Diagnose />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </div>
  );
}

export default App;