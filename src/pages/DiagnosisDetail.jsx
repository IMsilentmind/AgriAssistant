import { useParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Sprout, Bug, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DiagnosisResultCard from "@/components/diagnosis/DiagnosisResultCard";

const statusOptions = [
  { value: "active", label: "Active", color: "bg-destructive/10 text-destructive" },
  { value: "treating", label: "Treating", color: "bg-secondary/15 text-secondary" },
  { value: "resolved", label: "Resolved", color: "bg-primary/10 text-primary" },
];

export default function DiagnosisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: diagnosis, isLoading } = useQuery({
    queryKey: ["diagnosis", id],
    queryFn: async () => {
      const list = await base44.entities.Diagnosis.filter({ id });
      return list[0];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus) => base44.entities.Diagnosis.update(id, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagnosis", id] });
      queryClient.invalidateQueries({ queryKey: ["recent-diagnoses"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="px-4 py-10 text-center">
        <p className="text-muted-foreground">Diagnosis not found.</p>
        <Button variant="outline" onClick={() => navigate("/history")} className="mt-4">
          Go to History
        </Button>
      </div>
    );
  }

  const isCrop = diagnosis.category === "crops";

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Image */}
      {diagnosis.image_url && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl overflow-hidden border"
        >
          <img
            src={diagnosis.image_url}
            alt="Diagnosis"
            className="w-full h-52 object-cover"
          />
        </motion.div>
      )}

      {/* Subject Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isCrop ? "bg-primary/10" : "bg-secondary/10"}`}>
            {isCrop ? <Sprout className="w-5 h-5 text-primary" /> : <Bug className="w-5 h-5 text-secondary" />}
          </div>
          <div>
            <p className="font-bold text-foreground">{diagnosis.subject_type}</p>
            <p className="text-xs text-muted-foreground">{diagnosis.subject_name}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {diagnosis.created_date && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Calendar className="w-3 h-3" />
              {format(new Date(diagnosis.created_date), "MMM d, yyyy")}
            </Badge>
          )}
          <Badge variant="outline" className="capitalize text-xs">
            <Tag className="w-3 h-3 mr-1" />
            {diagnosis.category}
          </Badge>
          {diagnosis.season && (
            <Badge variant="outline" className="text-xs">{diagnosis.season}</Badge>
          )}
          {diagnosis.age && (
            <Badge variant="outline" className="text-xs">Age: {diagnosis.age}</Badge>
          )}
        </div>

        {diagnosis.symptom_description && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Reported Symptoms</p>
            <p className="text-sm text-foreground/80">{diagnosis.symptom_description}</p>
          </div>
        )}
      </motion.div>

      {/* Status Update */}
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-foreground">Status:</p>
        <Select
          value={diagnosis.status || "active"}
          onValueChange={(val) => updateStatusMutation.mutate(val)}
        >
          <SelectTrigger className="w-36 h-9 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Diagnosis Result */}
      <DiagnosisResultCard diagnosis={diagnosis} />
    </div>
  );
}