"use client";

import { motion } from "framer-motion";
import { Rocket, Orbit, Radar } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-slate-100 bg-gradient-to-br from-[#020617] via-[#020b2e] to-[#000814]">

      {/* soft animated glow blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[120px]"
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-700/20 blur-[140px]"
        animate={{ x: [0, -100, 0], y: [0, -60, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* subtle star dust */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle,#1e293b_1px,transparent_1px)] bg-[length:120px_120px] opacity-25"
        animate={{ backgroundPosition: ["0px 0px", "200px 200px"] }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      />

      {/* floating rocket */}
      <motion.div
        className="absolute left-1/2 top-1/3 -translate-x-1/2"
        animate={{ y: [0, -25, 0], rotate: [0, 1, -1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Rocket
          size={88}
          className="text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.7)]"
        />
      </motion.div>

      {/* content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="text-5xl md:text-7xl font-bold tracking-wide"
        >
          <span className="text-cyan-400">Cosmo</span>Track
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 max-w-2xl text-slate-400"
        >
          Space Mission Control & Telemetry Management System
        </motion.p>

        {/* cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-20 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3"
        >
          <div className="rounded-2xl bg-[#020617]/70 border border-slate-800 p-6 backdrop-blur-md shadow-lg hover:scale-105 transition">
            <Orbit className="mb-4 text-cyan-400" size={36} />
            <h3 className="text-xl font-semibold">Mission Tracking</h3>
            <p className="mt-2 text-sm text-slate-400">Launch, orbit, cruise and landing phases.</p>
          </div>

          <div className="rounded-2xl bg-[#020617]/70 border border-slate-800 p-6 backdrop-blur-md shadow-lg hover:scale-105 transition">
            <Radar className="mb-4 text-indigo-400" size={36} />
            <h3 className="text-xl font-semibold">Telemetry Analysis</h3>
            <p className="mt-2 text-sm text-slate-400">Sensor data, alerts and historical trends.</p>
          </div>

          <div className="rounded-2xl bg-[#020617]/70 border border-slate-800 p-6 backdrop-blur-md shadow-lg hover:scale-105 transition">
            <Rocket className="mb-4 text-purple-400" size={36} />
            <h3 className="text-xl font-semibold">System Health</h3>
            <p className="mt-2 text-sm text-slate-400">Subsystem monitoring & anomaly detection.</p>
          </div>
        </motion.div>

        {/* bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    </div>
  );
}
