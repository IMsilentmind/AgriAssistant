import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Inbox } from "lucide-react";
import HistoryItem from "@/components/history/HistoryItem";

export default function History() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const { data: diagnoses = [], isLoading } = useQuery({
    queryKey: ["diagnoses"],
    queryFn: () => base44.entities.Diagnosis.list("-created_date", 100),
  });

  const filteredDiagnoses = diagnoses.filter((d) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "crops" && d.category === "crops") ||
      (filter === "livestock" && d.category === "livestock") ||
      d.status === filter;
    const matchesSearch =
      !search ||
      d.diagnosis_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.subject_type?.toLowerCase().includes(search.toLowerCase()) ||
      d.subject_name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Diagnosis History</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Track your past diagnoses and treatment progress
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="pl-10 h-11 rounded-xl"
          placeholder="Search diagnoses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="w-full bg-muted rounded-xl h-10">
          <TabsTrigger value="all" className="flex-1 rounded-lg text-xs">All</TabsTrigger>
          <TabsTrigger value="crops" className="flex-1 rounded-lg text-xs">Crops</TabsTrigger>
          <TabsTrigger value="livestock" className="flex-1 rounded-lg text-xs">Livestock</TabsTrigger>
          <TabsTrigger value="active" className="flex-1 rounded-lg text-xs">Active</TabsTrigger>
          <TabsTrigger value="resolved" className="flex-1 rounded-lg text-xs">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filteredDiagnoses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-semibold text-foreground">No diagnoses found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {search ? "Try a different search term" : "Start a new diagnosis from the home page"}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filteredDiagnoses.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <HistoryItem diagnosis={d} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}