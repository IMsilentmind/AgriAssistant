import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { MapPin, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import "leaflet/dist/leaflet.css";

const severityColor = {
  mild:     "#4caf50",
  moderate: "#f59e0b",
  severe:   "#ef4444",
};

const severityRadius = {
  mild:     8,
  moderate: 12,
  severe:   16,
};

export default function FieldMap() {
  const { data: diagnoses = [], isLoading } = useQuery({
    queryKey: ["diagnoses-map"],
    queryFn: () => base44.entities.Diagnosis.list("-created_date", 200),
  });

  const mapped = diagnoses.filter((d) => d.latitude && d.longitude);

  // Compute default center from data, or use a sensible world center
  const center =
    mapped.length > 0
      ? [
          mapped.reduce((s, d) => s + d.latitude, 0) / mapped.length,
          mapped.reduce((s, d) => s + d.longitude, 0) / mapped.length,
        ]
      : [0, 20];

  const zoom = mapped.length > 0 ? 13 : 3;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Field Disease Map
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {mapped.length} location{mapped.length !== 1 ? "s" : ""} tracked · tap a marker for details
        </p>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2">
          {[["mild", "Mild"], ["moderate", "Moderate"], ["severe", "Severe"]].map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="rounded-full border border-white/40"
                style={{ width: 12, height: 12, background: severityColor[key] }}
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 mx-4 mb-4 rounded-2xl overflow-hidden border shadow-sm relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/40">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : mapped.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/20 z-10 pointer-events-none">
            <Info className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center px-8">
              No GPS-tagged diagnoses yet. Allow location access when running a new diagnosis.
            </p>
          </div>
        ) : null}

        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mapped.map((d) => (
            <CircleMarker
              key={d.id}
              center={[d.latitude, d.longitude]}
              radius={severityRadius[d.severity] || 10}
              pathOptions={{
                color: severityColor[d.severity] || "#6b7280",
                fillColor: severityColor[d.severity] || "#6b7280",
                fillOpacity: 0.75,
                weight: 2,
              }}
            >
              <Popup>
                <div className="min-w-[180px] space-y-1.5">
                  <p className="font-bold text-sm leading-tight">{d.diagnosis_name || "Unknown"}</p>
                  <p className="text-xs text-gray-500">
                    {d.subject_type} · {d.category}
                  </p>
                  {d.severity && (
                    <span
                      className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: severityColor[d.severity] + "22",
                        color: severityColor[d.severity],
                      }}
                    >
                      {d.severity} severity
                    </span>
                  )}
                  {d.created_date && (
                    <p className="text-[10px] text-gray-400">
                      {format(new Date(d.created_date), "MMM d, yyyy")}
                    </p>
                  )}
                  <Link
                    to={`/diagnosis/${d.id}`}
                    className="block text-xs font-medium text-green-700 underline mt-1"
                  >
                    View full diagnosis →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}