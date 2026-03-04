"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function GlobalHeader() {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  // 1. Always call Hooks at the top level
  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("COSMO_USER");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    checkAuth();
    
    // Listen for storage changes in other tabs
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("COSMO_USER");
    setUser(null);
    router.push("/login");
  };

  // 2. Conditional check for visibility happens AFTER all hooks
  if (pathname === "/" || pathname === "/login") return null;

  return (
    <header style={headerStyle}>
      <div style={brandSection}>
        <div style={logoIcon}>N</div>
        <div style={brandText}>COSMO_TRACK // SYS_v2.0</div>
      </div>

      {user ? (
        <div 
          style={userBadge} 
          onClick={handleLogout} 
          title="DISCONNECT_SESSION"
        >
          <div style={statusIndicator} />
          <div style={userInfo}>
            {/* Displays real name from Google Auth */}
            <span style={userText}>OPERATOR: {user.name}</span>
            <span style={rankText}>
              {user.role || "FIELD_OFFICER"} // {user.access_level || "LVL_1"}
            </span>
          </div>
          
          {/* Real Google Avatar Support */}
          <div style={avatarBox}>
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="Profile" 
                style={avatarImg} 
                referrerPolicy="no-referrer"
              />
            ) : (
              user.name ? user.name[0] : "?"
            )}
          </div>
        </div>
      ) : (
        <div style={warningBadge}>
          <span style={blink}>!</span> UNAUTHORIZED_ACCESS // GUEST_SESSION
        </div>
      )}
    </header>
  );
}

/* --- COMMAND CENTER STYLING --- */
const headerStyle: React.CSSProperties = { 
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
  padding: '12px 30px', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', 
  borderBottom: '1px solid #1a1a1a', color: '#fff', 
  fontFamily: 'JetBrains Mono, monospace', position: 'sticky', top: 0, zIndex: 1000 
};

const brandSection = { display: 'flex', alignItems: 'center', gap: '15px' };
const logoIcon = { width: '24px', height: '24px', border: '1px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold' };
const brandText = { letterSpacing: '3px', fontWeight: 900, fontSize: '0.7rem', opacity: 0.8 };

const userBadge: React.CSSProperties = { 
  display: 'flex', alignItems: 'center', gap: '12px', background: '#080808', 
  padding: '6px 14px', border: '1px solid #222', cursor: 'pointer',
  transition: 'all 0.2s ease'
};

const statusIndicator = { 
  width: '8px', height: '8px', borderRadius: '50%', background: '#00ffd5', 
  boxShadow: '0 0 10px #00ffd5' // Matches Ground Station active nodes
};

const userInfo = { display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end' };
const userText = { color: '#00ffd5', fontWeight: 'bold', fontSize: '0.75rem', letterSpacing: '1px' };
const rankText = { color: '#444', fontSize: '0.5rem', letterSpacing: '1px', marginTop: '2px' };

const avatarBox: React.CSSProperties = { 
  width: '32px', height: '32px', background: '#111', display: 'flex', 
  alignItems: 'center', justifyContent: 'center', border: '1px solid #333', 
  fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', overflow: 'hidden' 
};

const avatarImg: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const warningBadge = { color: '#ff4d4d', fontSize: '0.6rem', fontWeight: 'bold', letterSpacing: '1px' };
const blink = { animation: 'blink 1s infinite' }; // You can add this keyframe in globals.css