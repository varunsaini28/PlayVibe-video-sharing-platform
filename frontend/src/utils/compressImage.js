// utils/compressImage.js
export const compressImage = (file, maxSizeMB = 5) => {
  return new Promise((resolve) => {
    const maxBytes = maxSizeMB * 1024 * 1024;

    // If already small enough, return as-is
    if (file.size <= maxBytes) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");

      // Scale down dimensions proportionally
      let { width, height } = img;
      const MAX_DIMENSION = 1920;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Try quality 0.8 first, then lower if still too big
      const tryCompress = (quality) => {
        canvas.toBlob(
          (blob) => {
            if (blob.size <= maxBytes || quality <= 0.3) {
              // Convert blob back to File
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              // Still too big, try lower quality
              tryCompress(quality - 0.1);
            }
          },
          "image/jpeg",
          quality
        );
      };

      tryCompress(0.8);
    };

    img.src = url;
  });
};