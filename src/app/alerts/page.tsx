"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CosmoLayout from "@/src/components/CosmoLayout";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevAlertCount = useRef(0);

  // 🔊 The "Master Play" function for alert.wav
  const playAlertFull = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch(() => console.log("Audio blocked: Click Initialize"));
    }
  };

  // 🗣 Native Voice Synthesis
  const speakAlert = (message: string) => {
    if (!isMuted && typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Critical Alert: ${message}`);
      utterance.rate = 0.85;
      utterance.pitch = 0.5; // Deeper tone for criticals
      window.speechSynthesis.speak(utterance);
    }
  };

  // 🚨 Fetch alerts and handle Auto-Trigger for Criticals
  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/alerts");
      if (!res.ok) return;
      const data = await res.json();

      // NEW ALERT LOGIC
      if (data.length > prevAlertCount.current) {
        const newestAlert = data[0];
        
        // 🔥 ONLY TRIGGER SOUND IF TYPE IS CRITICAL
        if (!isMuted && newestAlert?.type === "critical") {
          playAlertFull();
          setTimeout(() => speakAlert(newestAlert.message), 800);
        }
      }

      setAlerts(data);
      prevAlertCount.current = data.length;
    } catch (err) {
      console.error("DATA_LINK_ERROR", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, [isMuted]);

  return (
    <CosmoLayout>
      <audio ref={audioRef} src="/alert.wav" preload="auto" />

      <div style={containerStyle}>
        <header style={headerStyle}>
          <div>
            <h1 style={titleStyle}>THREAT_DETECTION_MATRIX</h1>
            <p style={subTitleStyle}>
              <span style={statusDot(isMuted)}></span>
              CRITICAL_AUDIO: {isMuted ? "DISABLED" : "ARMED"}
            </p>
          </div>

          <button
            onClick={() => {
              setIsMuted(!isMuted);
              if (isMuted) {
                playAlertFull(); // Unlock browser audio
                speakAlert("Critical monitoring active.");
              }
            }}
            style={muteBtnStyle(isMuted)}
          >
            {isMuted ? "INITIALIZE_CRITICAL_LINK" : "SILENCE_SYSTEM"}
          </button>
        </header>

        <div style={gridStyle}>
          {alerts.length === 0 ? (
            <div style={noAlertsStyle}>SYSTEMS_NOMINAL // NO_THREATS</div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.alert_id} 
                style={alertCardStyle(alert.type)}
                onClick={() => {
                  // 🔥 ONLY PLAY SOUND ON CLICK IF TYPE IS CRITICAL
                  if (alert.type === "critical") {
                    playAlertFull();
                  }
                }}
              >
                <div style={cardHeader}>
                  <span style={tagStyle(alert.type)}>
                    {alert.type.toUpperCase()}
                  </span>
                  <span style={timeStyle}>
                    {new Date(alert.created_at).toLocaleTimeString()}
                  </span>
                </div>

                <h3 style={msgStyle}>{alert.message.toUpperCase()}</h3>

                <div style={actionRow}>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <Link href="/personnel" style={linkStyle} onClick={(e) => e.stopPropagation()}>
                      DEPLOY_UNITS {" >"}
                    </Link>
                    <Link href="/spacecraft" style={linkStyle} onClick={(e) => e.stopPropagation()}>
                      NAV_FLEET {" >"}
                    </Link>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fetch("/api/alerts", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ alert_id: alert.alert_id }),
                      }).then(fetchAlerts);
                    }}
                    style={resolveBtnStyle}
                  >
                    RESOLVE [X]
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@900&display=swap');
        @keyframes pulse-red {
          0% { border-color: #ff0055; box-shadow: 0 0 5px #ff0055; }
          50% { border-color: #220008; box-shadow: 0 0 25px #ff0055; }
          100% { border-color: #ff0055; box-shadow: 0 0 5px #ff0055; }
        }
      `}} />
    </CosmoLayout>
  );
}

/* --- STYLES --- */
const containerStyle: React.CSSProperties = { padding: "60px", backgroundColor: "#000", minHeight: "100vh", color: "#fff", fontFamily: "'JetBrains Mono', monospace" };
const headerStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "1px solid #111", paddingBottom: "20px" };
const titleStyle = { fontSize: "1.8rem", fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: "2px" };
const subTitleStyle = { color: "#00ffd5", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "10px" };
const statusDot = (muted: boolean) => ({ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: muted ? "#555" : "#ff0055" });
const muteBtnStyle = (muted: boolean) => ({ padding: "12px 24px", backgroundColor: muted ? "transparent" : "#ff0055", border: "1px solid #ff0055", color: muted ? "#ff0055" : "#000", cursor: "pointer", fontWeight: "bold" });
const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "20px" };

const alertCardStyle = (type: string): React.CSSProperties => ({
  backgroundColor: "#050505",
  border: `1px solid ${type === "critical" ? "#ff0055" : "#222"}`,
  padding: "25px",
  animation: type === "critical" ? "pulse-red 2s infinite" : "none",
  cursor: type === "critical" ? "pointer" : "default" // Change cursor only for critical
});

const cardHeader = { display: "flex", justifyContent: "space-between", marginBottom: "15px" };
const tagStyle = (type: string) => ({ backgroundColor: type === "critical" ? "#ff0055" : "#444", color: "#fff", padding: "2px 8px", fontSize: "0.6rem", fontWeight: 900 });
const timeStyle = { color: "#444", fontSize: "0.7rem" };
const msgStyle = { fontSize: "1.1rem", margin: "10px 0 25px 0", fontWeight: 700 };
const actionRow = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const linkStyle = { color: "#666", textDecoration: "none", fontSize: "0.7rem", fontWeight: "bold" };
const resolveBtnStyle = { background: "none", border: "none", color: "#ff0055", cursor: "pointer", fontSize: "0.7rem", fontWeight: "bold" };
const noAlertsStyle = { textAlign: "center" as const, padding: "100px", color: "#222", fontSize: "1.2rem", letterSpacing: "5px" };