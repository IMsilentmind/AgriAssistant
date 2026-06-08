import { useState, useRef } from "react";
import { Camera, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { compressImage, formatBytes } from "@/lib/imageUtils";

export default function ImageUploader({ imageUrl, onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [compressionInfo, setCompressionInfo] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setCompressionInfo(null);

    try {
      const originalSize = file.size;
      const compressed = await compressImage(file, 1024, 0.72);
      const compressedSize = compressed.size;

      if (compressedSize < originalSize) {
        setCompressionInfo({
          original: formatBytes(originalSize),
          compressed: formatBytes(compressedSize),
          saved: Math.round((1 - compressedSize / originalSize) * 100),
        });
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        onImageUploaded(reader.result);
        setUploading(false);
      };

      reader.onerror = () => {
        setUploading(false);
        alert("Image could not be loaded.");
      };

      reader.readAsDataURL(compressed);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Image could not be loaded.");
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <AnimatePresence mode="wait">
        {imageUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden border"
          >
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full h-48 object-cover"
            />

            <button
              onClick={() => {
                onImageUploaded("");
                setCompressionInfo(null);
              }}
              className="absolute top-3 right-3 w-8 h-8 bg-foreground/70 rounded-full flex items-center justify-center text-background hover:bg-foreground/90 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Photo ready
            </div>

            {compressionInfo && (
              <div className="absolute bottom-3 right-3 bg-foreground/60 text-background text-[10px] px-2 py-1 rounded-full">
                {compressionInfo.saved}% smaller · {compressionInfo.compressed}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-40 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-accent/50 transition-all"
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Preparing photo…
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Camera className="w-7 h-7 text-primary" />
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      Upload Photo
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Photo is compressed to save data
                    </p>
                  </div>
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}