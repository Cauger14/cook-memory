"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ImageAdd01Icon,
  Delete02Icon,
  Loading01Icon,
} from "hugeicons-react";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const newUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = (await res.json()) as { error: string };
          setError(data.error);
          continue;
        }

        const data = (await res.json()) as { url: string };
        newUrls.push(data.url);
      } catch {
        setError("Erreur lors de l'upload.");
      }
    }

    onChange([...images, ...newUrls]);
    setUploading(false);

    // Reset l'input pour pouvoir re-sélectionner le même fichier
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {/* Grille d'images */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((url, index) => (
            <div key={url} className="group relative aspect-square">
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="h-full w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Delete02Icon size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bouton d'ajout */}
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loading01Icon size={16} className="mr-1 animate-spin" />
              Upload en cours...
            </>
          ) : (
            <>
              <ImageAdd01Icon size={16} className="mr-1" />
              Ajouter des photos
            </>
          )}
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}