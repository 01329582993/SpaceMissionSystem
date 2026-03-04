"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ role: "ai", text: "SYSTEM ONLINE. READY FOR COMMANDS." }]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.toUpperCase();
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.text.toUpperCase() }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "SIGNAL INTERRUPTED." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* THE BUTTON - Fixed to bottom left corner */}
      <div className="fixed bottom-6 left-6 z-[99999]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-black border-2 border-cyan-500 rounded-full flex items-center justify-center text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-110 transition-all font-black text-xl"
        >
          {isOpen ? "×" : "N"}
        </button>
      </div>

      {/* THE CHAT WINDOW - Fixed and forced to top layer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-6 w-80 sm:w-96 h-[500px] bg-[#0a0a0a] border border-cyan-500/40 flex flex-col z-[99999] shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-lg overflow-hidden pointer-events-auto"
          >
            <div className="bg-cyan-500 text-black p-3 font-black text-[10px] tracking-[0.3em] flex justify-between">
              <span>COSMO_INTEL_V1</span>
              <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[11px] space-y-4 bg-black/50">
              {messages.map((m, i) => (
                <div key={i} className={`${m.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`inline-block p-2 border ${m.role === "user" ? "border-white/20 bg-white/5 text-white" : "border-cyan-500/20 bg-cyan-500/5 text-cyan-400"}`}>
                    <div className="opacity-30 text-[8px] mb-1">{m.role === "user" ? "// COMMANDER" : "// AI_CORE"}</div>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-cyan-500 animate-pulse font-mono text-[10px]">_ DECRYPTING_RESPONSE...</div>}
            </div>

            <form onSubmit={sendMessage} className="p-3 border-t border-cyan-500/20 bg-black">
              <input 
                autoFocus 
                className="w-full bg-transparent border border-cyan-500/30 p-3 text-white font-mono text-xs outline-none focus:border-cyan-500 transition-colors"
                placeholder="ENTER_COMMAND..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}