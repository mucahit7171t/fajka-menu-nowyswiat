'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2,
  Filter,
  Search
} from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';
import toast from 'react-hot-toast';

// Import Modals
import ProductModal from '@/components/admin/ProductModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function ProductsPage() {
  const { 
    menu, loading, error, fetchMenu,
    createProduct, updateProduct, deleteProduct
  } = useMenuStore();

  const [modalState, setModalState] = useState<{
    type: 'product' | 'delete' | null;
    mode: 'add' | 'edit' | null;
    data: any;
  }>({ type: null, mode: null, data: null });

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSave = async (data: any) => {
    const { mode, data: initialData } = modalState;
    const loadingToast = toast.loading(`${mode === 'add' ? 'Creating' : 'Updating'} product...`);
    try {
      if (mode === 'add') await createProduct(data);
      else await updateProduct(initialData._id, data);
      toast.success(`Product ${mode === 'add' ? 'created' : 'updated'} successfully`, { id: loadingToast });
      setModalState({ type: null, mode: null, data: null });
    } catch (error) {
      toast.error(`Failed to ${mode === 'add' ? 'create' : 'update'} product`, { id: loadingToast });
    }
  };

  const handleDelete = async () => {
    const { data } = modalState;
    const loadingToast = toast.loading('Deleting product...');
    try {
      await deleteProduct(data.id);
      toast.success('Product deleted successfully', { id: loadingToast });
      setModalState({ type: null, mode: null, data: null });
    } catch (error) {
      toast.error('Failed to delete product', { id: loadingToast });
    }
  };

  const filteredMenu = filterCategory === 'all' 
    ? menu 
    : menu.filter(cat => cat._id === filterCategory);

  return (
    <div className="space-y-12">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        <div>
          <h1 className="text-3xl md:text-6xl font-serif font-black italic tracking-tighter mb-2 uppercase text-white">
            INVENTORY<span className="text-[#c8a24a]">.</span>
          </h1>
          <p className="text-white/40 text-[10px] uppercase font-black tracking-widest leading-none">Manage individual menu items and pricing</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
          {/* Search/Filter Controls */}
          <div className="flex gap-4 flex-1">
             <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text"
                  placeholder="SEARCH ITEMS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black tracking-widest uppercase focus:border-[#c8a24a]/50 transition-all outline-none text-white font-[inherit]"
                />
             </div>
             
             <div className="relative">
                <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-10 text-[10px] font-black tracking-widest uppercase appearance-none cursor-pointer outline-none focus:border-[#c8a24a]/50 text-white font-[inherit]"
                >
                  <option value="all" className="bg-bg-card">All Categories</option>
                  {menu.map(cat => (
                    <option key={cat._id} value={cat._id} className="bg-bg-card">{cat.title.en}</option>
                  ))}
                </select>
             </div>
          </div>

          <button 
            onClick={() => setModalState({ type: 'product', mode: 'add', data: null })}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#c8a24a] text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-[#c8a24a]/20"
          >
            <Plus size={16} />
            New Product
          </button>
        </div>
      </header>

      {loading && !menu.length ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="animate-spin text-[#c8a24a]" size={40} />
          <p className="text-white/20 uppercase tracking-[0.3em] font-bold text-[10px]">Syncing Items...</p>
        </div>
      ) : error ? (
        <div className="text-center py-32 text-red-500 font-bold uppercase tracking-widest text-[10px]">{error}</div>
      ) : (
        <div className="space-y-16">
          {filteredMenu.map((cat, i) => {
            const products = cat.products.filter(p => p.name.en.toLowerCase().includes(searchQuery.toLowerCase()));
            const subcategories = cat.subcategories.map(sub => ({
              ...sub,
              products: sub.products.filter(p => p.name.en.toLowerCase().includes(searchQuery.toLowerCase()))
            })).filter(sub => sub.products.length > 0);

            if (products.length === 0 && subcategories.length === 0) return null;

            return (
              <motion.div 
                key={cat._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-6">
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-[#c8a24a] shrink-0">{cat.title.en}</span>
                  <div className="h-px w-full bg-white/5" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Direct Products */}
                  {products.map((p) => (
                    <ProductListItem 
                      key={p._id} 
                      product={p} 
                      onEdit={() => setModalState({ type: 'product', mode: 'edit', data: p })}
                      onDelete={() => setModalState({ type: 'delete', mode: null, data: { id: p._id, name: p.name.en, type: 'product' } })}
                    />
                  ))}

                  {/* Products in Subcategories */}
                  {subcategories.map(sub => (
                    <React.Fragment key={sub._id}>
                      <div className="col-span-full mt-4 mb-2">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-6 flex items-center gap-3">
                           <span className="w-1 h-1 rounded-full bg-[#c8a24a]" /> {sub.title.en}
                         </h4>
                      </div>
                      {sub.products.map(p => (
                        <ProductListItem 
                          key={p._id} 
                          product={p} 
                          onEdit={() => setModalState({ type: 'product', mode: 'edit', data: p })}
                          onDelete={() => setModalState({ type: 'delete', mode: null, data: { id: p._id, name: p.name.en, type: 'product' } })}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ProductModal
        isOpen={modalState.type === 'product'}
        onClose={() => setModalState({ type: null, mode: null, data: null })}
        onSave={handleSave}
        initialData={modalState.data}
        categories={menu}
        title={modalState.mode === 'add' ? 'Add New Product' : 'Edit Product'}
      />

      <DeleteConfirmModal
        isOpen={modalState.type === 'delete'}
        onClose={() => setModalState({ type: null, mode: null, data: null })}
        onConfirm={handleDelete}
        title={`Delete Product`}
        itemName={modalState.data?.name || ''}
      />
    </div>
  );
}

import { CldImage } from 'next-cloudinary';

function ProductListItem({ product, onEdit, onDelete }: { product: any, onEdit: () => void, onDelete: () => void }) {
  const isCloudinary = product.image?.includes('cloudinary.com');

  return (
    <div className="group p-4 md:p-6 bg-bg-card border border-white/5 hover:border-white/10 rounded-2xl md:rounded-[2.5rem] transition-all flex items-center justify-between">
      <div className="flex items-center gap-6 flex-1">
         {product.image ? (
           <div className="w-16 h-16 rounded-2xl border border-white/5 overflow-hidden shrink-0">
              {isCloudinary ? (
                <CldImage 
                  src={product.image} 
                  alt={product.name.en} 
                  width={100} 
                  height={100} 
                  crop="fill"
                  className="w-full h-full object-cover opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" 
                />
              ) : (
                <img 
                  src={product.image} 
                  alt={product.name.en} 
                  className="w-full h-full object-cover opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" 
                />
              )}
           </div>
         ) : (
           <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/10 shrink-0">
              <span className="text-[8px] font-black uppercase">No Img</span>
           </div>
         )}
         <div>
            <h4 className="text-lg font-bold group-hover:text-[#c8a24a] transition-colors text-white">{product.name.en}</h4>
            <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-1">
              {product.price || (product.prices?.length > 0 ? `${product.prices[0].value}+` : 'Variable Pricing')}
            </p>
         </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
         <button onClick={onEdit} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 text-white/20 hover:bg-white hover:text-black transition-all duration-300 active:scale-95">
           <Edit3 className="size-4 md:size-[18px]" />
         </button>
         <button onClick={onDelete} className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500/50 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95">
           <Trash2 className="size-4 md:size-[18px]" />
         </button>
      </div>
    </div>
  );
}
