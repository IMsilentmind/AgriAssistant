import { Lightbulb } from "lucide-react";

const tips = [
  "Take clear, close-up photos for better diagnosis results.",
  "Describe symptoms in detail — color changes, wilting, spots, etc.",
  "Check your crops early in the morning for pest activity.",
  "Rotate crops each season to reduce disease buildup.",
  "Keep livestock areas clean and well-ventilated.",
  "Monitor animals daily for changes in behavior or appetite.",
];

export default function QuickTip() {
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="bg-accent/60 border border-primary/10 rounded-2xl p-4 flex gap-3">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Lightbulb className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs font-semibold text-primary mb-0.5">Quick Tip</p>
        <p className="text-sm text-foreground/80 leading-relaxed">{tip}</p>
      </div>
    </div>
  );
}