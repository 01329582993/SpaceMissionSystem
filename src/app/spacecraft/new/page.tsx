"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CosmoLayout from '@/src/components/CosmoLayout';

export default function NewSpacecraftPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', model: '', fuel_level: 100, mission_id: '' });
    const [missions, setMissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/missions')
            .then(res => res.json())
            .then(data => setMissions(Array.isArray(data) ? data : [])) // Ensure array
            .catch(err => console.error("Failed to load missions:", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/spacecraft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    mission_id: formData.mission_id ? parseInt(formData.mission_id) : null
                })
            });
            if (!res.ok) throw new Error('Failed to register spacecraft');
            router.push('/spacecraft');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CosmoLayout>
            <div style={pageContainer}>
                <header style={headerStyle}>
                    <h1 style={titleStyle}>VESSEL_REGISTRATION</h1>
                    <p style={subTitleStyle}>ENROLLING_ASSETS // SECTOR_7_HANGAR</p>
                </header>

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={gridRow}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>SPACECRAFT_NAME</label>
                            <input
                                type="text"
                                required
                                placeholder="E.G. TITAN_IV"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>MODEL_CLASS</label>
                            <input
                                type="text"
                                required
                                placeholder="E.G. MK-SERIES"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={gridRow}>
                        <div style={inputGroup}>
                            <label style={labelStyle}>INITIAL_FUEL_%</label>
                            <input
                                type="number"
                                min="0" max="100"
                                required
                                value={formData.fuel_level}
                                onChange={(e) => setFormData({ ...formData, fuel_level: parseInt(e.target.value) })}
                                style={inputStyle}
                            />
                        </div>
                        <div style={inputGroup}>
                            <label style={labelStyle}>MISSION_ASSIGNMENT</label>
                            <select
                                value={formData.mission_id}
                                onChange={(e) => setFormData({ ...formData, mission_id: e.target.value })}
                                style={selectStyle}
                            >
                                <option value="">STAY_IN_HANGAR</option>
                                {missions.map(m => (
                                    <option key={m.mission_id} value={m.mission_id}>
                                        {/* Added Optional Chaining to prevent crash */}
                                        {m.mission_name?.toUpperCase() || `MISSION_${m.mission_id}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && <div style={errorBox}>⚠️ ERROR: {error.toUpperCase()}</div>}

                    <button type="submit" disabled={loading} className="submit-btn" style={submitBtnStyle}>
                        {loading ? 'TRANSMITTING...' : 'FINALIZE_REGISTRATION'}
                    </button>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&family=Orbitron:wght@700;900&display=swap');
                .submit-btn:hover { background: #00ffd5 !important; color: #000 !important; box-shadow: 0 0 30px #00ffd5; }
                input:focus, select:focus { border-color: #00ffd5 !important; outline: none; }
            `}} />
        </CosmoLayout>
    );
}

/* --- FORM STYLES --- */
const pageContainer: React.CSSProperties = { padding: "60px", backgroundColor: "#000", minHeight: "100vh", color: "#FFF", fontFamily: "'JetBrains Mono', monospace" };
const headerStyle = { marginBottom: '50px', borderBottom: '1px solid #222', paddingBottom: '30px' };
const titleStyle = { color: '#FFF', fontSize: '2rem', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px' };
const subTitleStyle = { color: '#00ffd5', fontSize: '0.7rem', fontWeight: 800, marginTop: '5px' };
const formStyle = { maxWidth: '900px', background: '#080808', padding: '40px', border: '1px solid #1a1a1a' };
const gridRow = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' };
const inputGroup = { display: 'flex', flexDirection: 'column' as const };
const labelStyle = { fontSize: '0.65rem', color: '#555', fontWeight: 800, marginBottom: '10px', letterSpacing: '1px' };
const inputStyle = { backgroundColor: '#000', border: '1px solid #333', padding: '15px', color: '#FFF', fontSize: '0.9rem', fontFamily: "'JetBrains Mono', monospace" };
const selectStyle = { backgroundColor: '#000', border: '1px solid #333', padding: '15px', color: '#FFF', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace" };
const errorBox = { color: '#ff0055', border: '1px solid #ff0055', padding: '15px', marginBottom: '30px', fontSize: '0.8rem', fontWeight: 800 };
const submitBtnStyle = { width: '100%', backgroundColor: '#FFF', color: '#000', padding: '20px', border: 'none', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '2px' };