"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit3, Loader2, FolderPlus } from "lucide-react";
import { useMenuStore } from "@/store/menuStore";
import toast from "react-hot-toast";

// Import Modals
import CategoryModal from "@/components/admin/CategoryModal";
import SubcategoryModal from "@/components/admin/SubcategoryModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

export default function CategoriesPage() {
  const {
    menu,
    loading,
    error,
    fetchMenu,
    createCategory,
    updateCategory,
    deleteCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
  } = useMenuStore();

  const [modalState, setModalState] = useState<{
    type: "category" | "subcategory" | "delete" | null;
    mode: "add" | "edit" | null;
    data: any;
  }>({ type: null, mode: null, data: null });

  useEffect(() => {
    fetchMenu(true);
  }, [fetchMenu]);

  const handleSave = async (data: any) => {
    const { type, mode, data: initialData } = modalState;
    const loadingToast = toast.loading(`Saving ${type}...`);
    try {
      if (type === "category") {
        if (mode === "add") await createCategory(data);
        else await updateCategory(initialData._id, data);
      } else if (type === "subcategory") {
        if (mode === "add") await createSubcategory(data);
        else await updateSubcategory(initialData._id, data);
      }
      toast.success(`${type} saved successfully`, { id: loadingToast });
      setModalState({ type: null, mode: null, data: null });
    } catch (error) {
      toast.error(`Failed to save ${type}`, { id: loadingToast });
    }
  };

  const handleDelete = async () => {
    const { data } = modalState;
    const loadingToast = toast.loading(`Deleting ${data.type}...`);
    try {
      if (data.type === "category") await deleteCategory(data.id);
      else if (data.type === "subcategory") await deleteSubcategory(data.id);
      toast.success(`${data.type} deleted`, { id: loadingToast });
      setModalState({ type: null, mode: null, data: null });
    } catch (error) {
      toast.error(`Failed to delete ${data.type}`, { id: loadingToast });
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-6xl font-serif font-black italic tracking-tighter mb-2 uppercase text-white">
            STRUCTURE<span className="text-[#c8a24a]">.</span>
          </h1>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-widest leading-none">
            Manage menu categories and hierarchies
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() =>
              setModalState({ type: "subcategory", mode: "add", data: null })
            }
            className="flex items-center gap-2 px-6 py-4 bg-white/5 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-white/10 border border-white/10 transition-all font-[inherit]"
          >
            <FolderPlus size={16} />
            New Subcategory
          </button>
          <button
            onClick={() =>
              setModalState({ type: "category", mode: "add", data: null })
            }
            className="flex items-center gap-2 px-6 py-4 bg-[#c8a24a] text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-[#c8a24a]/20"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>
      </header>

      {loading && !menu.length ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-[#c8a24a]" size={40} />
          <p className="text-white/20 uppercase tracking-[0.3em] font-bold text-[10px]">
            Syncing Structure...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-32 text-red-500 font-bold uppercase tracking-widest text-[10px]">
          {error}
        </div>
      ) : (
        <div className="grid gap-6">
          {menu.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group p-4 md:p-8 bg-bg-card border border-white/5 hover:border-white/20 rounded-2xl md:rounded-[3rem] transition-all"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
                <div className="flex items-center gap-6">
                  {cat.image ? (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                      <img
                        src={cat.image}
                        alt={cat.title.en}
                        className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-white/10 uppercase font-black text-[8px]">
                      No Img
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-white">
                      {cat.title.pl} / {cat.title.en}
                    </h3>
                    <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-1">
                      ID: <span className="text-white/40">{cat.anchorId}</span>{" "}
                      • Order:{" "}
                      <span className="text-white/40">{cat.order}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <ActionButton
                    icon={<Edit3 size={18} />}
                    onClick={() =>
                      setModalState({
                        type: "category",
                        mode: "edit",
                        data: cat,
                      })
                    }
                  />
                  <button
                    onClick={() =>
                      setModalState({
                        type: "delete",
                        mode: null,
                        data: {
                          id: cat._id,
                          name: cat.title.en,
                          type: "category",
                        },
                      })
                    }
                    className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/50 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Subcategories inside categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.subcategories.map((sub: any) => (
                  <div
                    key={sub._id}
                    className="flex items-center justify-between p-3.5 md:p-5 bg-white/5 rounded-xl md:rounded-2xl group/sub border border-transparent hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c8a24a]/40 group-hover/sub:bg-[#c8a24a] transition-colors" />
                      <span className="text-sm font-bold text-white/60 group-hover/sub:text-white transition-colors uppercase tracking-widest">
                        {sub.title.en}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 translate-x-2 group-hover/sub:translate-x-0 transition-all">
                      <button
                        onClick={() =>
                          setModalState({
                            type: "subcategory",
                            mode: "edit",
                            data: sub,
                          })
                        }
                        className="p-2 text-white/20 hover:text-blue-400 transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() =>
                          setModalState({
                            type: "delete",
                            mode: null,
                            data: {
                              id: sub._id,
                              name: sub.title.en,
                              type: "subcategory",
                            },
                          })
                        }
                        className="p-2 text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {cat.subcategories.length === 0 && (
                  <p className="text-white/5 text-[10px] uppercase font-black tracking-widest italic py-4">
                    No subcategories created for this section
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CategoryModal
        isOpen={modalState.type === "category"}
        onClose={() => setModalState({ type: null, mode: null, data: null })}
        onSave={handleSave}
        initialData={modalState.data}
        title={modalState.mode === "add" ? "Add New Category" : "Edit Category"}
      />

      <SubcategoryModal
        isOpen={modalState.type === "subcategory"}
        onClose={() => setModalState({ type: null, mode: null, data: null })}
        onSave={handleSave}
        initialData={modalState.data}
        categories={menu}
        title={
          modalState.mode === "add" ? "Add Subcategory" : "Edit Subcategory"
        }
      />

      <DeleteConfirmModal
        isOpen={modalState.type === "delete"}
        onClose={() => setModalState({ type: null, mode: null, data: null })}
        onConfirm={handleDelete}
        title={`Delete ${modalState.data?.type}`}
        itemName={modalState.data?.name || ""}
      />
    </div>
  );
}

function ActionButton({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:bg-white hover:text-black transition-all duration-300 active:scale-95"
    >
      {icon}
    </button>
  );
}
