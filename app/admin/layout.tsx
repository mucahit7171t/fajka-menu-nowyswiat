'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AdminLayout from '@/components/admin/AdminLayout';
import { Loader2 } from 'lucide-react';

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const isLoginPage = pathname === '/admin/login';

    if (!isAuthenticated && !isLoginPage) {
      router.replace('/admin/login');
    } else if (isAuthenticated && isLoginPage) {
      router.replace('/admin');
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#c8a24a]" size={48} />
        <p className="text-white/20 uppercase tracking-[0.4em] font-black text-[10px]">Verifying Permissions...</p>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
