"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  GripVertical,
  ChevronRight,
  RefreshCw,
  LayoutGrid,
  ChevronLeft,
  Package,
  Layers,
} from "lucide-react";
import axios from "axios";
import { useMenuStore } from "@/store/menuStore";

import toast from "react-hot-toast";

type SelectionLevel = "root" | "category" | "subcategory";

interface ViewPath {
  level: SelectionLevel;
  id?: string;
  title?: string;
}

export default function MenuOrderPage() {
  const { menu, fetchMenu } = useMenuStore();
  const [viewPath, setViewPath] = useState<ViewPath>({ level: "root" });
  
  // Local state for items being reordered
  const [items, setItems] = useState<any[]>([]);
  const [reorderType, setReorderType] = useState<"category" | "subcategory" | "product">("category");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // Sync internal items state with menu store based on current viewPath
  useEffect(() => {
    if (!menu) return;

    if (viewPath.level === "root") {
      setItems([...menu].sort((a, b) => (a.order || 0) - (b.order || 0)));
      setReorderType("category");
    } else if (viewPath.level === "category") {
      const cat = menu.find((c) => c._id === viewPath.id);
      if (cat) {
        // We handle subcategories and standalone products separately or together?
        // For simplicity and to match the API, let's allow choosing what to reorder or show both.
        // Actually, let's keep it simple: when in category, show subcategories first, then standalone products.
        // BUT the reorder API needs a single type.
        // So we will show two lists if needed, or just focus on one.
        // The user request says "changing order of products in categories/subcategories".
        // Let's show two sections if we are in category.
      }
    }
  }, [menu, viewPath]);

  // Optimized grouping for the UI
  const currentContent = useMemo(() => {
    if (!menu) return { categories: [], subcategories: [], products: [] };
    
    if (viewPath.level === "root") {
      return { 
        categories: [...menu].sort((a, b) => (a.order || 0) - (b.order || 0)),
        subcategories: [], 
        products: [] 
      };
    }

    if (viewPath.level === "category") {
      const cat = menu.find(c => c._id === viewPath.id);
      if (!cat) return { categories: [], subcategories: [], products: [] };
      return {
        categories: [],
        subcategories: [...cat.subcategories].sort((a, b) => (a.order || 0) - (b.order || 0)),
        products: [...cat.products].sort((a, b) => (a.order || 0) - (b.order || 0))
      };
    }

    if (viewPath.level === "subcategory") {
        // Find cat then sub
        for (const cat of menu) {
            const sub = cat.subcategories.find(s => s._id === viewPath.id);
            if (sub) {
                return {
                    categories: [],
                    subcategories: [],
                    products: [...sub.products].sort((a, b) => (a.order || 0) - (b.order || 0))
                };
            }
        }
    }

    return { categories: [], subcategories: [], products: [] };
  }, [menu, viewPath]);

  // We need local sortable states for each group
  const [localSubcategories, setLocalSubcategories] = useState<any[]>([]);
  const [localProducts, setLocalProducts] = useState<any[]>([]);
  const [localCategories, setLocalCategories] = useState<any[]>([]);

  useEffect(() => {
    setLocalCategories(currentContent.categories);
    setLocalSubcategories(currentContent.subcategories);
    setLocalProducts(currentContent.products);
  }, [currentContent]);

  const moveItem = (list: any[], setList: (l: any[]) => void, index: number, direction: "up" | "down") => {
    const newList = [...list];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newList.length) return;

    const temp = newList[index];
    newList[index] = newList[targetIndex];
    newList[targetIndex] = temp;

    setList(newList);
  };

  const handleSave = async (type: "category" | "subcategory" | "product", itemsToSave: any[]) => {
    setSaving(true);
    const loadingToast = toast.loading(`Saving ${type} order...`);
    try {
      const orderData = itemsToSave.map((item, index) => ({
        id: item._id,
        order: index,
      }));

      const { reorder } = useMenuStore.getState();
      await reorder(type, orderData);
      toast.success(`${type} order updated`, { id: loadingToast });
    } catch (error) {
      console.error(`Failed to save ${type} order:`, error);
      toast.error(`Failed to update ${type} order`, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const navigateTo = (level: SelectionLevel, id: string, title: string) => {
    setViewPath({ level, id, title });
  };

  const goBack = () => {
    if (viewPath.level === "subcategory") {
      // Find parent category
      for (const cat of menu) {
        if (cat.subcategories.some(s => s._id === viewPath.id)) {
          setViewPath({ level: "category", id: cat._id, title: cat.title.en });
          return;
        }
      }
    }
    setViewPath({ level: "root" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {viewPath.level !== "root" && (
              <button 
                onClick={goBack}
                className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-[#c8a24a] hover:bg-[#c8a24a]/10 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="text-2xl md:text-4xl font-serif font-black italic uppercase tracking-tighter text-white">
              {viewPath.level === "root" ? "Menu Structure" : viewPath.title}
            </h2>
          </div>
          <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em]">
            {viewPath.level === "root" && "Manage sections order"}
            {viewPath.level === "category" && "Manage subcategories and standalone products"}
            {viewPath.level === "subcategory" && "Manage products order"}
          </p>
        </div>
      </div>

      {/* Categories Reordering */}
      {viewPath.level === "root" && (
        <ReorderSection 
          title="Categories"
          items={localCategories}
          onMove={(idx, dir) => moveItem(localCategories, setLocalCategories, idx, dir)}
          onSave={() => handleSave("category", localCategories)}
          saving={saving}
          onNavigate={(item) => navigateTo("category", item._id, item.title.en)}
          icon={<LayoutGrid size={16} />}
        />
      )}

      {/* Category İçeriği */}
      {viewPath.level === "category" && (
        <div className="space-y-10">
          {localSubcategories.length > 0 && (
            <ReorderSection 
              title="Subcategories"
              items={localSubcategories}
              onMove={(idx, dir) => moveItem(localSubcategories, setLocalSubcategories, idx, dir)}
              onSave={() => handleSave("subcategory", localSubcategories)}
              saving={saving}
              onNavigate={(item) => navigateTo("subcategory", item._id, item.title.en)}
              icon={<Layers size={16} />}
            />
          )}

          {localProducts.length > 0 && (
            <ReorderSection 
              title="Standalone Products"
              items={localProducts}
              onMove={(idx, dir) => moveItem(localProducts, setLocalProducts, idx, dir)}
              onSave={() => handleSave("product", localProducts)}
              saving={saving}
              icon={<Package size={16} />}
            />
          )}

          {localSubcategories.length === 0 && localProducts.length === 0 && (
            <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
                <p className="text-white/20 uppercase font-black tracking-widest text-xs">This category is empty</p>
            </div>
          )}
        </div>
      )}

      {/* Subcategory İçeriği */}
      {viewPath.level === "subcategory" && (
        <ReorderSection 
          title="Products"
          items={localProducts}
          onMove={(idx, dir) => moveItem(localProducts, setLocalProducts, idx, dir)}
          onSave={() => handleSave("product", localProducts)}
          saving={saving}
          icon={<Package size={16} />}
        />
      )}

      <div className="flex items-center gap-3 p-5 md:p-8 bg-[#c8a24a]/5 border border-[#c8a24a]/10 rounded-2xl md:rounded-3xl">
        <div className="w-10 h-10 rounded-xl bg-[#c8a24a]/20 flex items-center justify-center text-[#c8a24a]">
          <ChevronRight size={20} />
        </div>
        <p className="text-xs text-white/60 leading-relaxed font-medium">
          Changes made here will affect the display order on the{" "}
          <span className="text-[#c8a24a] italic font-bold">Public Website</span>.
        </p>
      </div>
    </div>
  );
}

interface ReorderSectionProps {
  title: string;
  items: any[];
  onMove: (index: number, direction: "up" | "down") => void;
  onSave: () => void;
  saving: boolean;
  onNavigate?: (item: any) => void;
  icon?: React.ReactNode;
}

function ReorderSection({ title, items, onMove, onSave, saving, onNavigate, icon }: ReorderSectionProps) {
  return (
    <div className="bg-bg-card border border-white/10 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl">
      <div className="p-3 md:p-4 bg-white/2 border-b border-white/5 flex justify-between items-center px-5 md:px-8">
        <div className="flex items-center gap-2">
            <span className="text-white/40">{icon}</span>
            <span className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-white/20">
            {title} ({items.length})
            </span>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-[#c8a24a]/10 text-[#c8a24a] hover:bg-[#c8a24a] hover:text-black font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-[9px] disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={12} /> : <><Save size={12} /> Save {title}</>}
        </button>
      </div>

      <div className="divide-y divide-white/5">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group flex items-center justify-between p-3.5 md:p-6 hover:bg-white/2 transition-colors"
            >
              <div className="flex items-center gap-3 md:gap-6 flex-1">
                <div className="text-white/10 group-hover:text-[#c8a24a] transition-colors cursor-grab active:cursor-grabbing shrink-0">
                  <GripVertical className="size-[18px] md:size-5" />
                </div>
                
                {item.image && (
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.title?.en || item.name?.en}
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                    />
                  </div>
                )}
                
                <div 
                  className={onNavigate ? "cursor-pointer" : ""} 
                  onClick={() => onNavigate && onNavigate(item)}
                >
                  <h4 className="text-sm md:text-lg font-serif font-black italic text-white group-hover:text-[#c8a24a] transition-colors">
                    {item.title?.en || item.name?.en}
                  </h4>
                  <p className="text-[7px] md:text-[8px] text-white/20 uppercase font-bold tracking-widest">
                    {item.anchorId || (item.price ? `Price: ${item.price}` : "Product")}
                  </p>
                </div>
                
                {onNavigate && (
                    <button 
                        onClick={() => onNavigate(item)}
                        className="ml-auto opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-[#c8a24a] transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 md:gap-3 ml-4">
                <button
                  onClick={() => onMove(index, "up")}
                  disabled={index === 0}
                  className="p-2 md:p-3 rounded-lg md:rounded-xl bg-white/5 text-white/40 hover:text-[#c8a24a] hover:bg-[#c8a24a]/10 disabled:opacity-0 transition-all active:scale-95"
                >
                  <ArrowUp className="size-3 md:size-4" />
                </button>
                <button
                  onClick={() => onMove(index, "down")}
                  disabled={index === items.length - 1}
                  className="p-2 md:p-3 rounded-lg md:rounded-xl bg-white/5 text-white/40 hover:text-[#c8a24a] hover:bg-[#c8a24a]/10 disabled:opacity-0 transition-all active:scale-95"
                >
                  <ArrowDown className="size-3 md:size-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
