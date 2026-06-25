import React, { useRef } from "react";
import { FiCamera } from "react-icons/fi";

interface ImageData {
  id: string;
  url: string;
  label: string;
  nbiLabel?: string;
  isNbi?: boolean;
  brightness?: number;
  filePath?: string;
  contrast?: number;
}

interface ImageUploaderProps {
  images: ImageData[];
  onImagesAdded: (images: ImageData[]) => void;
  onImagesUpdated: (images: ImageData[]) => void;
  onImageRemoved: (id: string) => void;
  onImageLabelChanged: (id: string, label: string) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesAdded,
  onImagesUpdated,
  onImageRemoved,
  onImageLabelChanged,
  maxImages = 6,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  const remainingSlots = maxImages - images.length;
  const filesToAdd = files.slice(0, remainingSlots);

  const newImages: ImageData[] = [];

  for (let i = 0; i < filesToAdd.length; i++) {
    const file = filesToAdd[i];

    // convert to base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    let filePath = "";

    try {
      // save to Electron backend
      if ((window as any).api?.saveImage) {
        const saved = await (window as any).api.saveImage({
          base64,
          name: file.name,
        });

        filePath = saved.filePath;
      }
    } catch (err) {
      console.error(" Image save failed:", err);
    }

    newImages.push({
      id: crypto.randomUUID(),
      url: base64, 
      filePath: filePath || "",     // REAL STORAGE PATH
      label: `Image ${images.length + i + 1}`,
      brightness: 100,
      contrast: 100,
    });
  }

  onImagesAdded(newImages);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ color: "#1a3a52", marginTop: 0, marginBottom: 12, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 600, display: "flex", alignItems: "center" }}>
        <FiCamera style={{ marginRight: 8 }} /> Upload Endoscopy Images ({images.length}/{maxImages})
      </h3>

      {images.length < maxImages && (
        <div
          style={{
            border: "2px dashed #007bff",
            borderRadius: 6,
            padding: 20,
            textAlign: "center",
            backgroundColor: "#f0f8ff",
            cursor: "pointer",
            marginBottom: 15,
            fontFamily: "'Inter', sans-serif"
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <p style={{ margin: "0 0 5px 0", fontWeight: "bold", color: "#007bff" }}>
            Click to upload up to 6 image(s)
          </p>
          <p style={{ margin: 0, color: "#666", fontSize: 12 }}>
            or drag and drop PNG, JPG, JPEG images
          </p>
        </div>
      )}

      {images.length > 0 && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
            {images.map((img, index) => (
              <div
                key={img.id}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  padding: 10,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 4,
                  borderLeft: "4px solid #007bff",
                }}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 3,
                    objectFit: "cover",
                    border: "1px solid #ddd",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 6 }}>
                  <input
                    type="text"
                    value={img.label}
                    onChange={(e) => onImageLabelChanged(img.id, e.target.value)}
                    style={{
                      padding: 6,
                      border: "1px solid #ddd",
                      borderRadius: 3,
                      fontSize: 11,
                    }}
                  />
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: "bold", cursor: "pointer", color: "#007bff" }}>
                      <input
                        type="checkbox"
                        checked={img.isNbi || false}
                        onChange={(e) => {
                          const updated = images.map((i) =>
                            i.id === img.id
                              ? {
                                  ...i,
                                  isNbi: e.target.checked,
                                  nbiLabel: e.target.checked ? "NBI" : undefined,
                                }
                              : i
                          );
                          onImagesUpdated(updated);
                        }}
                        style={{ accentColor: "#007bff", cursor: "pointer", margin: 0 }}
                      />
                      NBI Tag
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
                  <label style={{ fontSize: 10 }}>Brightness</label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={img.brightness || 100}
                    onChange={(e) => {
                      const updated = images.map((i) =>
                        i.id === img.id
                          ? { ...i, brightness: Number(e.target.value) }
                          : i
                      );

                      onImagesUpdated(updated);
                    }}
                  />

                  <label style={{ fontSize: 10 }}>Contrast</label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={img.contrast || 100}
                    onChange={(e) => {
                      const updated = images.map((i) =>
                        i.id === img.id
                          ? { ...i, contrast: Number(e.target.value) }
                          : i
                      );

                      onImagesUpdated(updated);
                    }}
                  />
                </div>

                <button
                  onClick={() => onImageRemoved(img.id)}
                  style={{
                    padding: "6px 10px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: 3,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: "bold",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;