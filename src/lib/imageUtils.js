/**
 * Compresses an image File before upload to save bandwidth on low-connectivity networks.
 * Targets ~150KB output regardless of input size.
 *
 * @param {File} file - Original image file
 * @param {number} maxWidthPx - Resize to fit within this width (default 1024)
 * @param {number} quality - JPEG quality 0–1 (default 0.7)
 * @returns {Promise<File>} Compressed File object
 */
export async function compressImage(file, maxWidthPx = 1024, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Downscale if wider than maxWidthPx
      if (width > maxWidthPx) {
        height = Math.round((height * maxWidthPx) / width);
        width = maxWidthPx;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            // If compression fails, just use original
            resolve(file);
            return;
          }
          // Only use compressed version if it's actually smaller
          if (blob.size < file.size) {
            const compressed = new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressed);
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // fallback — use original
    };

    img.src = objectUrl;
  });
}

/**
 * Returns a human-readable file size string.
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}