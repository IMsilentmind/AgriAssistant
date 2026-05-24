import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, AlertCircle, Shield, Leaf, FlaskConical, ChevronRight, GitBranch, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const confidenceConfig = {
  low:    { color: "bg-muted text-muted-foreground border-border",              label: "Low Confidence",    bar: "w-1/3 bg-muted-foreground/50" },
  medium: { color: "bg-secondary/15 text-secondary border-secondary/30",       label: "Medium Confidence", bar: "w-2/3 bg-secondary" },
  high:   { color: "bg-primary/15 text-primary border-primary/30",             label: "High Confidence",   bar: "w-full bg-primary" },
};

const severityConfig = {
  mild:     { icon: CheckCircle2, color: "text-primary",      bg: "bg-primary/10",      label: "Mild" },
  moderate: { icon: AlertCircle,  color: "text-secondary",    bg: "bg-secondary/10",    label: "Moderate" },
  severe:   { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10",  label: "Severe" },
};

const urgencyConfig = {
  low:      { color: "bg-primary/10 text-primary border-primary/20",             label: "Low urgency" },
  medium:   { color: "bg-secondary/15 text-secondary border-secondary/30",       label: "Act within 1–2 weeks" },
  high:     { color: "bg-destructive/10 text-destructive border-destructive/20", label: "Act within days" },
  critical: { color: "bg-destructive text-destructive-foreground border-destructive", label: "URGENT — act now" },
};

export default function DiagnosisResultCard({ diagnosis, index = 0, showLink = false }) {
  const conf = confidenceConfig[diagnosis.confidence] || confidenceConfig.medium;
  const sev  = severityConfig[diagnosis.severity]   || severityConfig.moderate;
  const urg  = urgencyConfig[diagnosis.urgency_level];
  const SeverityIcon = sev.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-card rounded-2xl border overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl ${sev.bg} flex items-center justify-center flex-shrink-0`}>
            <SeverityIcon className={`w-5 h-5 ${sev.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground leading-tight">{diagnosis.diagnosis_name || "Unknown"}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">{sev.label} severity</p>
          </div>
        </div>

        {/* Confidence bar + badge */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${conf.bar}`} />
          </div>
          <Badge variant="outline" className={`${conf.color} border text-[11px] whitespace-nowrap`}>
            {conf.label}
          </Badge>
        </div>

        {/* Urgency pill */}
        {urg && (
          <div className={`mt-2 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border w-fit ${urg.color}`}>
            <Clock className="w-3.5 h-3.5" />
            {urg.label}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="p-4 space-y-3">
        {diagnosis.explanation && (
          <p className="text-sm text-foreground/80 leading-relaxed">{diagnosis.explanation}</p>
        )}

        {diagnosis.organic_treatment && (
          <div className="flex gap-2.5 bg-primary/5 rounded-xl p-3">
            <Leaf className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-primary mb-0.5">Organic Treatment</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{diagnosis.organic_treatment}</p>
            </div>
          </div>
        )}

        {diagnosis.chemical_treatment && (
          <div className="flex gap-2.5 bg-blue-50 rounded-xl p-3">
            <FlaskConical className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-blue-600 mb-0.5">Chemical Treatment</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{diagnosis.chemical_treatment}</p>
            </div>
          </div>
        )}

        {diagnosis.prevention_tips && (
          <div className="flex gap-2.5 bg-secondary/8 rounded-xl p-3">
            <Shield className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-secondary mb-0.5">Prevention</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{diagnosis.prevention_tips}</p>
            </div>
          </div>
        )}

        {/* Alternative diagnoses */}
        {diagnosis.alternative_diagnoses && (
          <div className="flex gap-2.5 bg-muted/60 rounded-xl p-3">
            <GitBranch className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-0.5">Other possibilities considered</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{diagnosis.alternative_diagnoses}</p>
            </div>
          </div>
        )}
      </div>

      {showLink && (
        <Link
          to={`/diagnosis/${diagnosis.id}`}
          className="flex items-center justify-between p-4 border-t hover:bg-muted/30 transition-colors"
        >
          <span className="text-sm font-medium text-primary">View Full Details</span>
          <ChevronRight className="w-4 h-4 text-primary" />
        </Link>
      )}
    </motion.div>
  );
}