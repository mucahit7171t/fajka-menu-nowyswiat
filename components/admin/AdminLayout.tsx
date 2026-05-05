"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUp } from "lucide-react";
import Sidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;

    const handleScroll = () => {
      setShowScrollTop(mainElement.scrollTop > 300);
    };

    mainElement.addEventListener("scroll", handleScroll);
    return () => mainElement.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    mainRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Main Content */}
      <main 
        ref={mainRef}
        className="flex-1 relative overflow-y-auto h-screen custom-scrollbar"
      >
        {/* Mobile Header */}
        <header className="lg:hidden p-4 glass flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-lg font-serif font-black italic tracking-tighter">
            FAJKA<span className="text-[#c8a24a]">ADMIN</span>
          </h2>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all outline-none"
          >
            <Menu size={20} />
          </button>
        </header>

        <div className="p-2.5 md:p-12 lg:p-20 max-w-7xl mx-auto">{children}</div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-10 right-10 z-50 w-14 h-14 bg-[#c8a24a] text-black rounded-2xl shadow-2xl shadow-[#c8a24a]/20 flex items-center justify-center hover:brightness-110 active:scale-95 transition-all group lg:bottom-12 lg:right-12"
              title="Scroll to Top"
            >
              <ArrowUp size={24} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </main>

      <aside className="hidden lg:block w-[350px] shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] z-50 lg:hidden"
            >
              <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
