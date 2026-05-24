import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function CategoryCard({ icon, title, description, color, onClick, delay = 0 }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      className="w-full bg-card rounded-2xl border p-6 text-left hover:shadow-lg hover:border-primary/30 transition-all duration-300 group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${color}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </motion.button>
  );
}