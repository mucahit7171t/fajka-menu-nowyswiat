"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, Plus, Trash2, ChevronDown } from "lucide-react";
import ImagePickerModal from "./ImagePickerModal";
import ImageUploadField from "./ImageUploadField";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
  categories: any[];
  title: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
  title,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: { pl: "", en: "" },
    desc: { pl: "", en: "" },
    price: "",
    badge: "",
    prices: [] as { label: string; value: string }[],
    image: "",
    category: "",
    subcategory: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subcategoryOpen, setSubcategoryOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || { pl: "", en: "" },
        desc: initialData.desc || { pl: "", en: "" },
        price: initialData.price || "",
        badge: initialData.badge || "",
        prices: initialData.prices || [],
        image: initialData.image || "",
        category:
          initialData.category?._id ||
          initialData.category ||
          initialData.categoryId ||
          "",
        subcategory:
          initialData.subcategory?._id || initialData.subcategory || "",
      });
    } else {
      setFormData({
        name: { pl: "", en: "" },
        desc: { pl: "", en: "" },
        price: "",
        badge: "",
        prices: [],
        image: "",
        category: categories[0]?._id || "",
        subcategory: "",
      });
    }
  }, [initialData, isOpen, categories]);

  const selectedCategoryData = categories.find(
    (c) => c._id === formData.category
  );

  const selectedCategoryLabel =
    selectedCategoryData?.title?.en || "Select a Category";

  const selectedSubcategoryData = selectedCategoryData?.subcategories?.find(
    (s: any) => s._id === formData.subcategory
  );

  const selectedSubcategoryLabel =
    selectedSubcategoryData?.title?.en || "No Subcategory";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave: any = {
        ...formData,
        categoryId: formData.category,
      };

      if (!dataToSave.subcategory) delete dataToSave.subcategory;
      if (!dataToSave.price) delete dataToSave.price;
      dataToSave.badge = formData.badge || "";

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addPriceOption = () => {
    setFormData({
      ...formData,
      prices: [...formData.prices, { label: "", value: "" }],
    });
  };

  const removePriceOption = (index: number) => {
    setFormData({
      ...formData,
      prices: formData.prices.filter((_, i) => i !== index),
    });
  };

  const updatePriceOption = (
    index: number,
    field: "label" | "value",
    value: string
  ) => {
    const newPrices = [...formData.prices];
    newPrices[index][field] = value;
    setFormData({ ...formData, prices: newPrices });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-2.5 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="custom-scrollbar relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-bg-card p-5 shadow-2xl md:rounded-[3.5rem] md:p-10"
            >
              <div className="mb-6 flex items-center justify-between md:mb-10">
                <h3 className="font-serif text-2xl font-black uppercase italic tracking-tighter md:text-3xl">
                  {title}
                </h3>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-white/20 transition-colors hover:text-white"
                >
                  <X size={28} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                      Name (PL)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name.pl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: { ...formData.name, pl: e.target.value },
                        })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all focus:border-[#c8a24a]/50 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                      Name (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: { ...formData.name, en: e.target.value },
                        })
                      }
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all focus:border-[#c8a24a]/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                      Description (PL)
                    </label>
                    <textarea
                      value={formData.desc.pl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          desc: { ...formData.desc, pl: e.target.value },
                        })
                      }
                      className="min-h-[100px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all focus:border-[#c8a24a]/50 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                      Description (EN)
                    </label>
                    <textarea
                      value={formData.desc.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          desc: { ...formData.desc, en: e.target.value },
                        })
                      }
                      className="min-h-[100px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all focus:border-[#c8a24a]/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                        Base Price (e.g., 30zł)
                      </label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all focus:border-[#c8a24a]/50 focus:outline-none"
                        placeholder="Leave empty if using price options"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                        Badge
                      </label>

                      <select
                        value={formData.badge}
                        onChange={(e) =>
                          setFormData({ ...formData, badge: e.target.value })
                        }
                        className="w-full rounded-2xl border border-white/10 bg-[#151515] px-6 py-4 font-bold text-white transition-all focus:border-[#c8a24a]/50 focus:outline-none"
                      >
                        <option value="">No Badge</option>
                        <option value="Best Seller">Best Seller</option>
                        <option value="Premium">Premium</option>
                        <option value="New">New</option>
                      </select>
                    </div>

                    <div className="relative space-y-2">
                      <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                        Category
                      </label>

                      <button
                        type="button"
                        onClick={() => setCategoryOpen(!categoryOpen)}
                        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all hover:border-[#c8a24a]/50"
                      >
                        <span>{selectedCategoryLabel}</span>
                        <ChevronDown
                          size={18}
                          className={`transition ${
                            categoryOpen ? "rotate-180 text-[#c8a24a]" : ""
                          }`}
                        />
                      </button>

                      {categoryOpen && (
                        <div className="absolute left-0 right-0 top-[78px] z-50 overflow-hidden rounded-2xl border border-[#c8a24a]/40 bg-[#0f0f0f] shadow-2xl">
                          {categories.map((cat) => (
                            <button
                              key={cat._id}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  category: cat._id,
                                  subcategory: "",
                                });
                                setCategoryOpen(false);
                              }}
                              className={`block w-full px-6 py-4 text-left font-bold transition ${
                                formData.category === cat._id
                                  ? "bg-[#c8a24a] text-black"
                                  : "text-white hover:bg-white/10"
                              }`}
                            >
                              {cat.title.en}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedCategoryData &&
                      selectedCategoryData.subcategories &&
                      selectedCategoryData.subcategories.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="relative space-y-2"
                        >
                          <label className="ml-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                            Subcategory (Optional)
                          </label>

                          <button
                            type="button"
                            onClick={() =>
                              setSubcategoryOpen(!subcategoryOpen)
                            }
                            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-bold text-white transition-all hover:border-[#c8a24a]/50"
                          >
                            <span>{selectedSubcategoryLabel}</span>
                            <ChevronDown
                              size={18}
                              className={`transition ${
                                subcategoryOpen
                                  ? "rotate-180 text-[#c8a24a]"
                                  : ""
                              }`}
                            />
                          </button>

                          {subcategoryOpen && (
                            <div className="absolute left-0 right-0 top-[78px] z-50 overflow-hidden rounded-2xl border border-[#c8a24a]/40 bg-[#0f0f0f] shadow-2xl">
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    subcategory: "",
                                  });
                                  setSubcategoryOpen(false);
                                }}
                                className={`block w-full px-6 py-4 text-left font-bold transition ${
                                  formData.subcategory === ""
                                    ? "bg-[#c8a24a] text-black"
                                    : "text-white hover:bg-white/10"
                                }`}
                              >
                                No Subcategory
                              </button>

                              {selectedCategoryData.subcategories.map(
                                (sub: any) => (
                                  <button
                                    key={sub._id}
                                    type="button"
                                    onClick={() => {
                                      setFormData({
                                        ...formData,
                                        subcategory: sub._id,
                                      });
                                      setSubcategoryOpen(false);
                                    }}
                                    className={`block w-full px-6 py-4 text-left font-bold transition ${
                                      formData.subcategory === sub._id
                                        ? "bg-[#c8a24a] text-black"
                                        : "text-white hover:bg-white/10"
                                    }`}
                                  >
                                    {sub.title.en}
                                  </button>
                                )
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                  </div>

                  <div className="space-y-4">
                    <div className="ml-4 flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40">
                        Price Options (Bundles)
                      </label>

                      <button
                        type="button"
                        onClick={addPriceOption}
                        className="text-[#c8a24a] transition-colors hover:text-white"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <div className="custom-scrollbar max-h-[300px] space-y-3 overflow-y-auto pr-2">
                      {formData.prices.map((p, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            placeholder="Label (e.g., 10 shots)"
                            value={p.label}
                            onChange={(e) =>
                              updatePriceOption(i, "label", e.target.value)
                            }
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white"
                          />

                          <input
                            placeholder="Price (e.g., 50zł)"
                            value={p.value}
                            onChange={(e) =>
                              updatePriceOption(i, "value", e.target.value)
                            }
                            className="w-24 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white"
                          />

                          <button
                            type="button"
                            onClick={() => removePriceOption(i)}
                            className="p-2 text-white/20 transition-colors hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <ImageUploadField
                  value={formData.image}
                  onChange={(val) => setFormData({ ...formData, image: val })}
                  onOpenGallery={() => setShowPicker(true)}
                  label="Product Visual"
                />

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#c8a24a] py-5 font-black uppercase tracking-[0.2em] text-black shadow-lg shadow-[#c8a24a]/20 transition-all hover:brightness-110 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Save size={20} /> Save Product
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ImagePickerModal
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(imagePath) => setFormData({ ...formData, image: imagePath })}
        currentValue={formData.image}
      />
    </>
  );
}
