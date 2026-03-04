"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Missions", href: "/missions" },
  { name: "Fleet", href: "/spacecraft" },
  { name: "Personnel", href: "/personnel" },
  { name: "Alerts", href: "/alerts" },
  { name: "Logs", href: "/logs" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

export default function CosmoLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname === "/";

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans text-white selection:bg-cyan-500/30">
      
      {/* --- NEW SIDEBAR DESIGN --- */}
      <aside className="relative w-[320px] h-full bg-[#080808] border-r border-white/5 flex-shrink-0 z-30 shadow-2xl">
        
        <motion.div
          className="relative z-10 flex h-full flex-col px-10 pt-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* BRANDING: Stark & Modern */}
          <motion.div variants={itemVariants} className="mb-20">
            <h1 className="text-[32px] font-black tracking-tight leading-none text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-cyan-400 block"></span>
              COSMO_TRACK
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-400/80 uppercase">
              
              </span>
            </div>
          </motion.div>

          {/* NAV LINKS: Added Gap here */}
          <nav className="flex flex-col gap-12"> 
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <Link href={item.href} className="group flex items-center no-underline">
                    <span
                      className={`text-[18px] font-bold tracking-widest transition-all duration-200 block uppercase ${
                        isActive 
                          ? "text-white scale-110 origin-left" 
                          : "text-neutral-600 group-hover:text-neutral-300"
                      }`}
                      style={{ color: isActive ? '#ffffff' : undefined }} // Forced override for purple bugs
                    >
                      {item.name}
                    </span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="activeDot"
                        className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* SYSTEM METRICS FOOTER */}
          <motion.div variants={itemVariants} className="mt-auto pb-10">
             <div className="p-4 border border-white/5 bg-white/[0.02] rounded-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest"></span>
                  <span className="text-[9px] font-mono text-cyan-400"></span>
                </div>
                <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                   <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 w-1/2 bg-cyan-400/50"
                   />
                </div>
             </div>
          </motion.div>
        </motion.div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="relative flex-1 h-full overflow-hidden bg-black flex flex-col">
        
        {/* HEADER BAR */}
        <div className="h-16 border-bottom border-white/5 flex items-center px-12 justify-between bg-[#050505] z-20">
           <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.3em]">
             Sector: 07 // {pathname.replace('/', '') || 'root'}
           </span>
           <div className="flex items-center gap-6">
              <span className="text-[10px] font-mono text-neutral-500">24.0049° N, 38.2201° E</span>
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
           </div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 w-full h-full overflow-y-auto bg-black p-12 scroll-smooth">
          {children}
        </div>

      </main>

      {/* GLOBAL CSS OVERRIDES */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: black;
          color: white;
        }

        /* Prevent that purple link behavior */
        a, a:visited, a:active {
          color: inherit;
          text-decoration: none;
        }

        /* Custom scrollbar to keep it stealthy */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #1a1a1a;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #333;
        }
      `}</style>
    </div>
  );
}