"use client";
import React, { useEffect } from "react";
import useSound from "use-sound";

export default function HeartbeatVisualizer() {
  // Replace with your actual sound file in /public/
  const [play, { stop }] = useSound("/hum.mp3", { volume: 0.2, loop: true });

  useEffect(() => {
    // Note: Browsers require user interaction before playing sound
    const startAudio = () => play();
    window.addEventListener("click", startAudio);
    return () => {
      window.removeEventListener("click", startAudio);
      stop();
    };
  }, [play, stop]);

  return (
    <div className="mt-auto pt-6 border-t border-white/10 w-full px-4 pb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">System_Heartbeat</span>
        <span className="text-[9px] text-cyan-400 font-mono animate-pulse underline">LIVE</span>
      </div>
      
      {/* Waveform Visualizer */}
      <div className="flex items-end gap-[2px] h-8 w-full overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-cyan-400/40"
            style={{
              animation: `oscillate ${1 + Math.random()}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes oscillate {
          0%, 100% { height: 10%; opacity: 0.2; }
          50% { height: 80%; opacity: 1; }
        }
      `}</style>
    </div>
  );
}