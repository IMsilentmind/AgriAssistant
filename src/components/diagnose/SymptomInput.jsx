import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare } from "lucide-react";

const cropPrompts = [
  "Yellow spots on leaves",
  "Wilting despite watering",
  "White powder on stems",
  "Holes in leaves",
  "Brown root rot",
];

const livestockPrompts = [
  "Not eating properly",
  "Fever and lethargy",
  "Skin rash or lesions",
  "Coughing or sneezing",
  "Limping or swelling",
];

export default function SymptomInput({ category, value, onChange }) {
  const prompts = category === "crops" ? cropPrompts : livestockPrompts;

  return (
    <div>
      <Label className="text-sm font-semibold mb-2 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        Describe the Problem
      </Label>
      <Textarea
        className="min-h-[120px] rounded-xl text-base resize-none"
        placeholder="Describe what you see — color changes, spots, behavior changes, etc."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex flex-wrap gap-2 mt-3">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onChange(value ? `${value}, ${p.toLowerCase()}` : p)}
            className="text-xs bg-accent hover:bg-primary/10 text-accent-foreground px-3 py-1.5 rounded-full transition-colors border"
          >
            + {p}
          </button>
        ))}
      </div>
    </div>
  );
}