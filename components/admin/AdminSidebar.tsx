'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Layers,
  GlassWater,
  ListOrdered,
  LogOut,
  X,
  ChevronRight,
  Globe
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin', icon: <LayoutDashboard size={20} />, label: 'Overview', end: true },
    { href: '/admin/order', icon: <ListOrdered size={20} />, label: 'Menu Order' },
    { href: '/admin/categories', icon: <Layers size={20} />, label: 'Categories' },
    { href: '/admin/products', icon: <GlassWater size={20} />, label: 'Products' },
    { href: '/admin/settings', icon: <Globe size={20} />, label: 'Settings' },
  ];

  return (
    <div className="h-full flex flex-col bg-bg-card border-l border-white/5 p-5 lg:p-8 relative">

      {/* Brand */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-black italic tracking-tighter">
            FAJKA<span className="text-[#c8a24a]">ADMIN</span>
          </h2>
          <p className="text-[8px] uppercase font-black tracking-[0.3em] text-white/20 mt-1">Version 1.0.4 - Premium</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white transition-colors">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = item.end ? pathname === item.href : pathname.startsWith(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center justify-between px-5 py-3 lg:px-6 lg:py-5 rounded-xl lg:rounded-2xl transition-all duration-300",
                isActive
                  ? 'bg-[#c8a24a] text-black shadow-lg shadow-[#c8a24a]/20'
                  : 'text-white/40 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/5'
              )}
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <span className="transition-transform group-hover:scale-110">{item.icon}</span>
                <span className="text-[9px] lg:text-[10px] uppercase font-black tracking-widest leading-none">{item.label}</span>
              </div>
              <ChevronRight size={14} className={cn("transition-transform duration-300", onClose ? 'opacity-0' : 'group-hover:translate-x-1')} />
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="mt-auto pt-8 border-t border-white/5">
        <div className="px-6 mb-6">
          <p className="text-[8px] uppercase font-black tracking-widest text-white/20 mb-1">Authenticated As</p>
          <p className="text-sm font-bold truncate">{user?.username}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} />
          <span className="text-[10px] uppercase font-black tracking-widest">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
