import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import CategoryCard from "@/components/home/CategoryCard";
import QuickTip from "@/components/home/QuickTip";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const navigate = useNavigate();

  const { data: recentDiagnoses = [] } = useQuery({
    queryKey: ["recent-diagnoses"],
    queryFn: () => base44.entities.Diagnosis.list("-created_date", 3),
  });

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-4"
      >
        <h2 className="text-2xl font-extrabold text-foreground">
          What do you need<br />help with today?
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          AI-powered pest & disease diagnosis for your farm
        </p>
      </motion.div>

      {/* Category Selection */}
      <div className="space-y-3">
        <CategoryCard
          icon="🌾"
          title="Crops"
          description="Identify plant diseases, pests & damage"
          color="bg-primary/10"
          onClick={() => navigate("/diagnose?category=crops")}
          delay={0.1}
        />
        <CategoryCard
          icon="🐄"
          title="Livestock"
          description="Detect animal diseases & health issues"
          color="bg-secondary/10"
          onClick={() => navigate("/diagnose?category=livestock")}
          delay={0.2}
        />
      </div>

      {/* Quick Tip */}
      <QuickTip />

      {/* Recent Diagnoses */}
      {recentDiagnoses.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-bold text-foreground">Recent Diagnoses</h3>
            </div>
            <Link to="/history" className="text-xs font-medium text-primary flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentDiagnoses.map((d) => (
              <Link
                key={d.id}
                to={`/diagnosis/${d.id}`}
                className="flex items-center gap-3 bg-card rounded-xl border p-3 hover:shadow-sm transition-all"
              >
                {d.image_url ? (
                  <img src={d.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
                    {d.category === "crops" ? "🌿" : "🐾"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{d.diagnosis_name || "Pending"}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.subject_type}</p>
                </div>
                <Badge variant="outline" className="text-[10px] capitalize">
                  {d.status}
                </Badge>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}