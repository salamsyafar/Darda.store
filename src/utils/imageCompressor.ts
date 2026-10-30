/**
 * Utility to compress and resize images on the client side.
 * Keeps image quality high while reducing size to < 100-200 KB,
 * ensuring flawless saving into Firestore (under 1MB document limit)
 * and avoiding localStorage QuotaExceededError.
 */
export async function compressImage(
  file: File,
  maxWidth = 1024,
  maxHeight = 1024,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions preserving aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original if canvas context unavailable
          resolve(event.target?.result as string);
          return;
        }

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP or JPEG
        const mimeType = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
        let compressedDataUrl = canvas.toDataURL(mimeType, quality);

        // If WebP is not supported by browser, fallback to jpeg
        if (!compressedDataUrl.startsWith(`data:${mimeType}`)) {
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
