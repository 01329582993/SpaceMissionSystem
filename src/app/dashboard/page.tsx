"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  Radar,
  Orbit,
  Activity,
  AlertTriangle,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020b2e] to-[#000814] text-slate-100 px-6 py-10">

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-10 flex items-center justify-between"
      >
        <h1 className="text-3xl font-bold tracking-wide">
          <span className="text-cyan-400">Cosmo</span>Track Dashboard
        </h1>

        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-slate-400">System Online</span>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">

        <StatCard
          icon={<Rocket />}
          title="Active Missions"
          value="03"
          color="cyan"
        />

        <StatCard
          icon={<Orbit />}
          title="Orbiting"
          value="01"
          color="indigo"
        />

        <StatCard
          icon={<Radar />}
          title="Telemetry Streams"
          value="128"
          color="purple"
        />

        <StatCard
          icon={<AlertTriangle />}
          title="Warnings"
          value="0"
          color="green"
        />
      </div>

      {/* MAIN GRID */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Mission Status */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl bg-[#020617]/70 border border-slate-800 p-6 backdrop-blur-md"
        >
          <h2 className="mb-4 text-xl font-semibold text-cyan-400">
            Mission Status
          </h2>

          <div className="space-y-4">
            <StatusRow name="Apollo-X" status="Cruising" />
            <StatusRow name="Nova-3" status="Orbiting" />
            <StatusRow name="Helios-7" status="Launch Prep" />
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-[#020617]/70 border border-slate-800 p-6 backdrop-blur-md"
        >
          <h2 className="mb-4 text-xl font-semibold text-purple-400">
            System Health
          </h2>

          <HealthBar label="Propulsion" value={92} />
          <HealthBar label="Navigation" value={96} />
          <HealthBar label="Communication" value={88} />
          <HealthBar label="Power" value={94} />
        </motion.div>
      </div>

      {/* ACTIVITY LOG */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-10 rounded-2xl bg-[#020617]/70 border border-slate-800 p-6 backdrop-blur-md"
      >
        <h2 className="mb-4 text-xl font-semibold text-indigo-400">
          Live Activity
        </h2>

        <div className="space-y-3 text-sm text-slate-400">
          <Log text="Telemetry stream synced (Apollo-X)" />
          <Log text="Orbit correction executed (Nova-3)" />
          <Log text="All subsystems nominal" />
        </div>
      </motion.div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ icon, title, value, color }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-[#020617]/70 border border-slate-800 p-5 backdrop-blur-md hover:scale-105 transition"
    >
      <div className={`mb-3 text-${color}-400`}>{icon}</div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </motion.div>
  );
}

function StatusRow({ name, status }: any) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-black/20 px-4 py-3">
      <span>{name}</span>
      <span className="text-sm text-cyan-400">{status}</span>
    </div>
  );
}

function HealthBar({ label, value }: any) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between text-sm text-slate-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}

function Log({ text }: any) {
  return (
    <div className="flex items-center gap-2">
      <Activity size={14} className="text-green-400" />
      <span>{text}</span>
    </div>
  );
}
