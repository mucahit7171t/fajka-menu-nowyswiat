'use client';

import { motion } from 'framer-motion';
import { Layers, GlassWater } from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';

export default function AdminOverview() {
  const { menu } = useMenuStore();

  const totalProducts = menu.reduce((acc, cat) => {
    return acc + cat.products.length + cat.subcategories.reduce((sAcc, sub) => sAcc + sub.products.length, 0);
  }, 0);

  const stats = [
    { label: 'Total Categories', value: menu.length, icon: <Layers size={20} />, color: 'primary' },
    { label: 'Total Items', value: totalProducts, icon: <GlassWater size={20} />, color: 'blue' },
  ];


  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl md:text-6xl font-serif font-black italic tracking-tighter mb-2 uppercase text-white">
          OVERVIEW<span className="text-[#c8a24a]">.</span>
        </h1>
        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest leading-none">Management control panel dashboard</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-bg-card border border-white/5 rounded-[2.5rem] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c8a24a]/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#c8a24a]/10 transition-all" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-white/40 group-hover:text-white transition-colors">
                {stat.icon}
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] text-white/10 uppercase italic">0{i+1}</span>
            </div>

            <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">{stat.label}</p>
            <h3 className="text-4xl font-serif font-black italic tracking-tighter text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
