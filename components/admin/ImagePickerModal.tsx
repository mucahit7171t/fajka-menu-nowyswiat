"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Loader2, RefreshCw, Search } from "lucide-react";
import axios from "axios";

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imagePath: string) => void;
  currentValue?: string;
}

export default function ImagePickerModal({
  isOpen,
  onClose,
  onSelect,
  currentValue,
}: ImagePickerModalProps) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadImages = async () => {
    setLoading(true);

    try {
      const res = await axios.get("/api/admin/images");

      if (Array.isArray(res.data)) {
        setImages(res.data);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Image gallery load failed:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadImages();
    }
  }, [isOpen]);

  const filteredImages = images.filter((img: any) => {
    const imageText =
      typeof img === "string"
        ? img
        : img.secure_url || img.url || img.public_id || "";

    return imageText.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden p-2.5 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-bg-card shadow-2xl md:rounded-[3rem]"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-5 md:p-8">
              <div>
                <h3 className="font-serif text-2xl font-black uppercase italic tracking-tighter text-white md:text-3xl">
                  Image Gallery
                </h3>
                <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-white/30">
                  Select uploaded Cloudinary image
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-white/30 transition-colors hover:text-white"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between md:p-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-14 pr-5 text-sm font-bold text-white outline-none transition-all placeholder:text-white/20 focus:border-[#c8a24a]/50"
                />
              </div>

              <button
                type="button"
                onClick={loadImages}
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:border-[#c8a24a]/50 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <RefreshCw size={16} />
                )}
                Refresh
              </button>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto p-5 md:p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-white/30">
                  <Loader2 className="mb-4 animate-spin text-[#c8a24a]" size={40} />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Loading images...
                  </p>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-white/30">
                  <ImageIcon className="mb-4" size={44} />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    No images found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                  {filteredImages.map((imgUrl: any) => {
                    const imageUrl =
                      typeof imgUrl === "string"
                        ? imgUrl
                        : imgUrl.secure_url || imgUrl.url || "";

                    const imageId =
                      typeof imgUrl === "string"
                        ? imgUrl
                        : imgUrl.public_id || imageUrl;

                    const isSelected = currentValue === imageUrl;
                    const fileName =
                      imageUrl.split("/").pop()?.split("?")[0] || "image";

                    return (
                      <motion.button
                        key={imageId}
                        type="button"
                        onClick={() => {
                          onSelect(imageUrl);
                          onClose();
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`group overflow-hidden rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "border-[#c8a24a] bg-[#c8a24a]/10"
                            : "border-white/10 bg-white/5 hover:border-[#c8a24a]/50"
                        }`}
                      >
                        <div className="relative aspect-square overflow-hidden bg-black">
                          <img
                            src={imageUrl}
                            alt={fileName}
                            className="h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                          />

                          {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#c8a24a]/30">
                              <span className="rounded-full bg-[#c8a24a] px-3 py-1 text-[10px] font-black uppercase text-black">
                                Selected
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-3">
                          <p className="truncate text-[10px] font-bold text-white/60">
                            {fileName}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}