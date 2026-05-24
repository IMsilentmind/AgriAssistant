import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ChevronRight, Sprout, Bug } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const statusColors = {
  active: "bg-destructive/10 text-destructive border-destructive/20",
  treating: "bg-secondary/15 text-secondary border-secondary/30",
  resolved: "bg-primary/10 text-primary border-primary/20",
};

export default function HistoryItem({ diagnosis }) {
  const statusConf = statusColors[diagnosis.status] || statusColors.active;
  const isCrop = diagnosis.category === "crops";

  return (
    <Link
      to={`/diagnosis/${diagnosis.id}`}
      className="flex items-center gap-3 bg-card rounded-2xl border p-4 hover:shadow-md hover:border-primary/20 transition-all"
    >
      {diagnosis.image_url ? (
        <img
          src={diagnosis.image_url}
          alt=""
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
          {isCrop ? <Sprout className="w-6 h-6 text-primary" /> : <Bug className="w-6 h-6 text-secondary" />}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-foreground truncate">{diagnosis.diagnosis_name || "Pending"}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {diagnosis.subject_type} — {diagnosis.subject_name}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <Badge variant="outline" className={`${statusConf} border text-[10px] px-2 py-0`}>
            {diagnosis.status}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {diagnosis.created_date ? format(new Date(diagnosis.created_date), "MMM d, yyyy") : ""}
          </span>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </Link>
  );
}