"use client";

import React, { useRef, useState } from "react";
import { Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import axios from "axios";

interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  onOpenGallery: () => void;
  label?: string;
}

export default function ImageUploadField({
  value,
  onChange,
  onOpenGallery,
  label = "Product Visual",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/admin/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedUrl =
        response.data.secure_url || response.data.url || response.data.image;

      if (uploadedUrl) {
        onChange(uploadedUrl);
      } else {
        alert("Image uploaded but URL was not returned.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-white/45">
        {label}
      </label>

      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:h-32 md:w-32">
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="text-white/20" size={32} />
          )}
        </div>

        <div className="flex-1 space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={onOpenGallery}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/15"
            >
              <ImageIcon size={16} />
              Select from Gallery
            </button>

            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#c8a24a] px-4 py-4 text-[10px] font-black uppercase tracking-widest text-black shadow-lg shadow-[#c8a24a]/20 transition-all hover:brightness-110 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Upload size={16} />
              )}
              {uploading ? "Uploading..." : "Upload New"}
            </button>
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[11px] font-bold text-white/50 outline-none transition-all placeholder:text-white/20 focus:border-[#c8a24a]/60 focus:text-white"
            placeholder="Or paste URL here..."
          />
        </div>
      </div>
    </div>
  );
}
