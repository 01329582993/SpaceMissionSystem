"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Missions", href: "/missions" },
  { name: "Telemetry", href: "/telemetry" },
  { name: "Alerts", href: "/alerts" },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, 
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
};

export default function CosmoLayout() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans">

    
      <aside className="relative w-[480px] h-full bg-[#050b18] border-r border-white/5">
        
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(59,130,246,0.1),transparent_70%)]" />

  
        <motion.div 
          className="relative z-10 flex h-full flex-col pl-24 pt-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

        
          <motion.div variants={itemVariants} className="mb-24">
            <h1 className="text-[72px] font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-[#6ee7ff] via-[#3b82f6] to-[#9333ea]">
              CosmoTrack
            </h1>
            
            <p className="mt-4 text-[20px] font-light tracking-wide text-white/70" style={{ color: "white" }}>
              Mission control & space telemetry platform
            </p>
          </motion.div>

          <nav className="flex flex-col gap-12">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <motion.div 
                  key={item.name} 
                  variants={itemVariants}
                  whileHover={{ x: 12 }} 
                  whileTap={{ scale: 0.98 }} 
                >
                  <Link 
                    href={item.href}
                    className="group relative inline-block no-underline"
                  >
                   
                    <span 
                      className={`
                        text-[32px] 
                        font-semibold
                        tracking-tight
                        transition-all
                        duration-500
                        ease-out
                        block
                      `}
                      style={{ 
                        color: isActive ? "#6ee7ff" : "white",
                        textShadow: isActive ? "0 0 25px rgba(110, 231, 255, 0.5)" : "none"
                      }} 
                    >
                      {item.name}
                      
                    
                      <motion.span 
                        className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-[#6ee7ff] to-transparent"
                        initial={{ width: 0 }}
                        animate={{ width: isActive ? "100%" : 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.4 }}
                      />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </motion.div>
      </aside>

      
      <div className="relative flex-1 h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/cosmo.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/60 to-transparent" />
      </div>
    </div>
  );
}