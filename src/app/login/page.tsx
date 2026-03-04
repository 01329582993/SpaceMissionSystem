"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Firebase Integration
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// --- VERIFIED FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyCWtWjptzLiSbmHFJfPdYpGKMSswkFbRyg",
  authDomain: "cosmotrack-e15ee.firebaseapp.com",
  projectId: "cosmotrack-e15ee",
  storageBucket: "cosmotrack-e15ee.firebasestorage.app",
  messagingSenderId: "1089620062668",
  appId: "1:1089620062668:web:ff4a3e024f1142fc302d69",
  measurementId: "G-RMD6PQYL5Q"
};

// Singleton pattern prevents "Firebase App already exists" errors
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function MissionLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsProcessing(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        name: user.displayName?.toUpperCase() || "OPERATOR_IDENTIFIED",
        email: user.email,
        avatar: user.photoURL, // Captures real Google avatar
        role: "MISSION_COMMANDER",
        access_level: "LEVEL_5",
        auth_method: "GOOGLE_SSO"
      };

      localStorage.setItem("COSMO_USER", JSON.stringify(userData));
      router.push("/ground_station");
    } catch (error) {
      console.error("Authentication Link Failed:", error);
      setIsProcessing(false);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      const userData = {
        name: email.split('@')[0].toUpperCase(),
        role: "FIELD_OPERATOR",
        access_level: "LEVEL_1",
        avatar: null
      };
      localStorage.setItem("COSMO_USER", JSON.stringify(userData));
      router.push("/ground_station");
    }, 1500);
  };

  return (
    <div style={container}>
      <div style={bgGrid} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        style={loginBox}
      >
        <div style={content}>
          <h2 style={title}>IDENTITY_VERIFICATION</h2>
          <p style={subtitle}>SECURE_UPLINK // {isProcessing ? "HANDSHAKE_IN_PROGRESS" : "AWAITING_CREDENTIALS"}</p>
          
          <form onSubmit={handleEmailLogin} style={form}>
            <div style={inputGroup}>
              <label style={label}>OPERATOR_IDENTIFIER</label>
              <input 
                type="email" required style={input} 
                placeholder="name@cosmotrack.gov"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={inputGroup}>
              <label style={label}>ACCESS_KEY</label>
              <input 
                type="password" required style={input} 
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" style={submitBtn} disabled={isProcessing}>
              {isProcessing ? "VERIFYING..." : "AUTHORIZE_SESSION"}
            </button>
            <div style={divider}>
              <div style={line} />
              <span style={dividerText}>OR</span>
              <div style={line} />
            </div>
            <button type="button" onClick={handleGoogleLogin} style={googleBtn} disabled={isProcessing}>
              <div style={googleIconWrapper}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <span style={googleText}>Continue with Google</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// --- STYLES: Resolved 'flexDirection' and 'textAlign' Type Errors ---
const container: React.CSSProperties = { height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'JetBrains Mono, monospace', overflow: 'hidden', position: 'relative' };
const bgGrid: React.CSSProperties = { position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '50px 50px' };
const loginBox: React.CSSProperties = { width: '420px', background: '#080808', border: '1px solid #1a1a1a', position: 'relative', zIndex: 10, borderRadius: '4px' };
const content: React.CSSProperties = { padding: '40px' };

const title: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 900, letterSpacing: '2px', margin: 0, textAlign: 'center' as const };
const subtitle: React.CSSProperties = { fontSize: '0.6rem', color: '#00ffd5', marginTop: '10px', textAlign: 'center' as const, letterSpacing: '1px', opacity: 0.8 };
const form: React.CSSProperties = { marginTop: '30px', display: 'flex', flexDirection: 'column' as const, gap: '20px' };
const inputGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column' as const, gap: '8px' };

const label: React.CSSProperties = { fontSize: '0.6rem', color: '#555', fontWeight: 'bold' };
const input: React.CSSProperties = { background: '#000', border: '1px solid #222', padding: '14px', color: '#fff', outline: 'none', fontSize: '0.8rem', borderRadius: '4px' };
const submitBtn: React.CSSProperties = { background: '#fff', color: '#000', border: 'none', padding: '16px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' };
const divider: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '15px', margin: '5px 0' };
const line: React.CSSProperties = { flex: 1, height: '1px', background: '#1a1a1a' };
const dividerText: React.CSSProperties = { fontSize: '0.6rem', color: '#333' };
const googleBtn: React.CSSProperties = { background: '#ffffff', color: '#3c4043', border: '1px solid #dadce0', padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: '500', fontFamily: 'Roboto, arial, sans-serif', borderRadius: '4px' };
const googleIconWrapper = { marginRight: '12px', display: 'flex', alignItems: 'center' };
const googleText = { letterSpacing: 'normal' as const };