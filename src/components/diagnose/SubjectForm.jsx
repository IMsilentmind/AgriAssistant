import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const cropTypes = ["Rice", "Wheat", "Maize/Corn", "Tomato", "Potato", "Cotton", "Soybean", "Cassava", "Banana", "Coffee", "Cabbage", "Cucumber", "Pepper", "Bean", "Mango", "Sorghum", "Sugarcane", "Other"];
const livestockTypes = ["Cattle", "Goat", "Sheep", "Poultry/Chicken", "Pig", "Horse", "Fish", "Other"];
const seasons = ["Planting / Germination", "Vegetative / Growing", "Flowering / Tasselling", "Fruiting / Grain fill", "Harvesting", "Post-harvest / Dry season"];
const affectedAreas = ["Leaves", "Stems / Stalk", "Roots / Base", "Fruit / Pods", "Flowers", "Whole plant", "Multiple parts"];
const regionOptions = ["Tropical / Humid", "Semi-arid / Dry", "Highland / Cool", "Coastal", "Irrigated field", "Rainfed field"];

export default function SubjectForm({ category, formData, setFormData }) {
  const isCrop = category === "crops";

  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          {isCrop ? "Crop Type" : "Animal Type"}
        </Label>
        <Select
          value={formData.subject_type}
          onValueChange={(val) => setFormData({ ...formData, subject_type: val })}
        >
          <SelectTrigger className="h-12 rounded-xl text-base">
            <SelectValue placeholder={isCrop ? "Select crop type…" : "Select animal type…"} />
          </SelectTrigger>
          <SelectContent>
            {(isCrop ? cropTypes : livestockTypes).map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Name / variety */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">
          {isCrop ? "Variety / Name (optional)" : "Animal Name (optional)"}
        </Label>
        <Input
          className="h-12 rounded-xl text-base"
          placeholder={isCrop ? "e.g. Basmati, F1 hybrid, local variety…" : "e.g. Bessie, Flock #3…"}
          value={formData.subject_name}
          onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
        />
      </div>

      {/* Crop-specific fields */}
      {isCrop && (
        <>
          <div>
            <Label className="text-sm font-semibold mb-2 block">Growth Stage</Label>
            <Select
              value={formData.season}
              onValueChange={(val) => setFormData({ ...formData, season: val })}
            >
              <SelectTrigger className="h-12 rounded-xl text-base">
                <SelectValue placeholder="Select growth stage…" />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block">Where is the damage? (optional)</Label>
            <Select
              value={formData.affected_area || ""}
              onValueChange={(val) => setFormData({ ...formData, affected_area: val })}
            >
              <SelectTrigger className="h-12 rounded-xl text-base">
                <SelectValue placeholder="Select affected part…" />
              </SelectTrigger>
              <SelectContent>
                {affectedAreas.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block">Farm / Climate Region (optional)</Label>
            <Select
              value={formData.region || ""}
              onValueChange={(val) => setFormData({ ...formData, region: val })}
            >
              <SelectTrigger className="h-12 rounded-xl text-base">
                <SelectValue placeholder="Select region type…" />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {/* Livestock-specific fields */}
      {!isCrop && (
        <div>
          <Label className="text-sm font-semibold mb-2 block">Age (optional)</Label>
          <Input
            className="h-12 rounded-xl text-base"
            placeholder="e.g. 2 years, 6 months…"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}