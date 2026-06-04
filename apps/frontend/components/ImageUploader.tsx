import React, { useRef } from "react";

interface ImageData {
  id: string;
  url: string;
  label: string;
}

interface ImageUploaderProps {
  images: ImageData[];
  onImagesAdded: (images: ImageData[]) => void;
  onImageRemoved: (id: string) => void;
  onImageLabelChanged: (id: string, label: string) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesAdded,
  onImageRemoved,
  onImageLabelChanged,
  maxImages = 6,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = maxImages - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newImages: ImageData[] = filesToAdd.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      label: `Image ${images.length + index + 1}`,
    }));

    onImagesAdded(newImages);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{ color: "#1a3a52", marginTop: 0, marginBottom: 12, fontSize: 14 }}>
        📸 Upload Endoscopy Images ({images.length}/{maxImages})
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
                <input
                  type="text"
                  value={img.label}
                  onChange={(e) => onImageLabelChanged(img.id, e.target.value)}
                  style={{
                    flex: 1,
                    padding: 6,
                    border: "1px solid #ddd",
                    borderRadius: 3,
                    fontSize: 11,
                  }}
                />
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