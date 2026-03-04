"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterStation() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Active"); // Default status
    const router = useRouter();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (typeof window === "undefined") return;

        // 1. Get existing stations
        const saved = localStorage.getItem('COSMO_STATIONS');
        const stations = saved ? JSON.parse(saved) : [];

        // 2. Create new station object
        const newStation = {
            station_id: 100 + stations.length + 1,
            name: name.toUpperCase().replace(/\s+/g, '_'),
            location: location.toUpperCase(),
            status: status, // Matches "Active" or "Maintenance"
            signal_integrity: status === "Active" ? 100 : 0, // 0% for Maintenance nodes
            last_ping: new Date().toISOString()
        };

        // 3. Save to LocalStorage
        const updatedStations = [...stations, newStation];
        localStorage.setItem('COSMO_STATIONS', JSON.stringify(updatedStations));

        // 4. Redirect to the network dashboard
        router.push("/ground_station");
    };

    return (
        <div style={formContainer}>
            <div style={glassBox}>
                <h2 style={headerStyle}>REGISTER_NEW_NODE</h2>
                <form onSubmit={handleRegister} style={formStyle}>
                    
                    <label style={labelStyle}>STATION_IDENTIFIER</label>
                    <input 
                        required 
                        style={inputStyle} 
                        placeholder="e.g. HOUSTON_CORE" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    
                    <label style={labelStyle}>GEOGRAPHIC_SECTOR</label>
                    <input 
                        required 
                        style={inputStyle} 
                        placeholder="e.g. USA" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <label style={labelStyle}>OPERATIONAL_STATUS</label>
                    <select 
                        style={selectStyle} 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="Active">ACTIVE_UPLINK</option>
                        <option value="Maintenance">SYSTEM_MAINTENANCE</option>
                    </select>

                    <button type="submit" style={submitBtn}>INITIATE_UPLINK</button>
                    <Link href="/ground_station" style={cancelBtn}>ABORT_REGISTRATION</Link>
                </form>
            </div>
        </div>
    );
}

/* --- STYLES --- */
const formContainer: React.CSSProperties = { 
    height: '100vh', 
    backgroundColor: '#000', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    color: '#FFF', 
    fontFamily: 'JetBrains Mono, monospace' 
};

const glassBox: React.CSSProperties = { 
    padding: '40px', 
    border: '1px solid #1a1a1a', 
    background: '#080808', 
    width: '420px',
    boxShadow: '0 0 30px rgba(0, 255, 213, 0.05)'
};

const headerStyle = { 
    fontFamily: 'Orbitron, sans-serif', 
    letterSpacing: '3px', 
    fontSize: '1.2rem',
    marginBottom: '30px',
    borderBottom: '1px solid #222',
    paddingBottom: '10px'
};

const formStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' };

const labelStyle = { 
    fontSize: '0.65rem', 
    color: '#00ffd5', 
    marginBottom: '8px', 
    letterSpacing: '1px',
    fontWeight: 'bold' 
};

const inputStyle = { 
    background: '#000', 
    border: '1px solid #333', 
    padding: '12px', 
    color: '#FFF', 
    marginBottom: '25px', 
    fontSize: '0.85rem',
    outline: 'none'
};

const selectStyle = { 
    background: '#000', 
    border: '1px solid #333', 
    padding: '12px', 
    color: '#FFF', 
    marginBottom: '30px', 
    fontSize: '0.85rem',
    cursor: 'pointer',
    outline: 'none'
};

const submitBtn = { 
    background: '#00ffd5', 
    color: '#000', 
    border: 'none', 
    padding: '15px', 
    fontWeight: 900, 
    cursor: 'pointer', 
    marginBottom: '15px',
    letterSpacing: '1px',
    transition: '0.2s'
};

const cancelBtn: React.CSSProperties = { 
    textAlign: 'center' as const, 
    fontSize: '0.65rem', 
    color: '#444', 
    textDecoration: 'none',
    letterSpacing: '1px'
};