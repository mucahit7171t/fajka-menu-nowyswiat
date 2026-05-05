'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      setAuth(response.data.token, response.data.user);
      router.push('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-[#c8a24a] selection:text-black">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c8a24a]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c8a24a]/5 blur-[120px] rounded-full delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-bg-card border border-white/10 p-10 md:p-14 rounded-[4rem] shadow-2xl backdrop-blur-3xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#c8a24a]/20">
             <motion.div 
               className="h-full bg-[#c8a24a] shadow-[0_0_10px_#d4af37]"
               initial={{ width: 0 }}
               animate={{ width: "100%" }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
             />
          </div>

          <header className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#c8a24a]/5 border border-[#c8a24a]/20 text-[#c8a24a] mb-6 group-hover:scale-110 transition-transform duration-500">
               <ShieldCheck size={32} />
            </div>
            <h1 className="text-4xl font-serif font-black italic tracking-tighter mb-2 uppercase">
              FAJKA<span className="text-[#c8a24a]">ADMIN</span>
            </h1>
            <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Authorized Access Only</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="username"
                className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4 cursor-pointer hover:text-[#c8a24a] transition-colors"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-[#c8a24a]/50 focus:bg-white/10 transition-all font-bold placeholder:text-white/20 shadow-inner"
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="password"
                className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4 cursor-pointer hover:text-[#c8a24a] transition-colors"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-[#c8a24a]/50 focus:bg-white/10 transition-all font-bold placeholder:text-white/20 shadow-inner"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8a24a] text-black font-black uppercase tracking-[0.2em] py-5 rounded-3xl shadow-[0_15px_30px_rgba(212,175,55,0.3)] hover:brightness-110 hover:shadow-[#c8a24a]/40 disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-white/10">
               <Sparkles size={10} />
               <span>Secured by Fajka Bar Infrastructure</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
