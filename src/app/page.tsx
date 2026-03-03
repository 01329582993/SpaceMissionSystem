"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const REDIRECT_DELAY_MS = 4000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center h-screen w-full bg-black overflow-hidden text-white font-sans">
      
      {/* BACKGROUND GRID */}
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* RADIAL GLOW CENTER */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_70%)]" />

      {/* MAIN CONTENT */}
      <div className="relative z-30 flex flex-col items-center text-center px-6 w-full max-w-[95vw]">

        {/* MASSIVE GLOWING TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-[80px] md:text-[160px] font-[900] uppercase tracking-[25px] md:tracking-[40px] leading-none mb-6"
          style={{
            textShadow: `
              0 0 20px #ffffff,
              0 0 40px #ffffff,
              0 0 80px rgba(255,255,255,0.6)
            `,
          }}
        >
          COSMO TRACK
        </motion.h1>

        {/* ULTRA-WIDE GLOW LINE */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "90%", opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="h-[3px] bg-white mb-12 shadow-[0_0_35px_white]"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="text-2xl md:text-4xl font-light tracking-[15px] md:tracking-[25px] text-white opacity-80 uppercase"
        >
          Mission Management Interface
        </motion.p>

        {/* ULTRA-WIDE HORIZONTAL BUTTON */}
        {!loading && (
          <motion.button
            initial={{ opacity: 0, scaleX: 0.5 }}
            animate={{ opacity: 1, scaleX: 1 }}
            whileHover={{ 
                scale: 1.05,
                backgroundColor: "#ffffff",
                boxShadow: "0 0 100px rgba(255,255,255,0.7)"
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dashboard")}
            className="mt-32 px-24 md:px-64 py-12 text-4xl md:text-5xl font-black uppercase tracking-[15px] bg-white text-black rounded-full transition-all duration-500 cursor-pointer shadow-[0_0_60px_rgba(255,255,255,0.5)] min-w-[300px] md:min-w-[800px]"
          >
            Launch System
          </motion.button>
        )}
      </div>

      {/* 🚀 SVG ROCKET ANIMATION */}
      <motion.div
        initial={{ y: "120vh", opacity: 0 }}
        animate={{ y: "-120vh", opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="absolute flex justify-center w-full z-10 pointer-events-none"
      >
        <svg
          width="120"
          height="200"
          viewBox="0 0 100 200"
          className="drop-shadow-[0_0_30px_rgba(255,255,255,1)]"
        >
          <path d="M50 10 L70 60 L30 60 Z" fill="white" />
          <rect x="35" y="60" width="30" height="80" fill="white" />
          <circle cx="50" cy="90" r="7" fill="black" />
          <path d="M35 110 L10 145 L35 135 Z" fill="white" />
          <path d="M65 110 L90 145 L65 135 Z" fill="white" />
          <motion.path
            d="M40 140 L50 180 L60 140 Z"
            fill="white"
            animate={{ scaleY: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            style={{ originY: 0 }}
          />
        </svg>
      </motion.div>

      <style jsx global>{`
        body {
          margin: 0;
          background: black;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}