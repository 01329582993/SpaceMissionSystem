"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CosmoLayout from '@/src/components/CosmoLayout';

export default function NewPersonnelPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', role: '', rank: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const roles = [
        'Commander', 'Pilot', 'Mission Specialist', 'Payload Specialist',
        'Flight Engineer', 'Medical Officer', 'Science Officer'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/astronauts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to register officer');
            }

            router.push('/personnel');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CosmoLayout>
            <div style={containerStyle}>
                <header style={headerStyle}>
                    <h1 style={titleStyle}>OFFICER_ENLISTMENT</h1>
                    <p style={subTitleStyle}>CREATE_NEW_SERVICE_RECORD // ALPHA_SECTOR</p>
                </header>

                <form onSubmit={handleSubmit} style={formBoxStyle}>
                    <div style={fieldMargin}>
                        <label style={labelStyle}>FULL_NAME_IDENTIFIER</label>
                        <input
                            type="text"
                            required
                            placeholder="E.G. COMMANDER_SHEPARD"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={inputStyle}
                        />
                    </div>

                    <div style={gridStyle}>
                        <div>
                            <label style={labelStyle}>PRIMARY_DESIGNATION</label>
                            <select
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                style={selectStyle}
                            >
                                <option value="" disabled>SELECT_ROLE...</option>
                                {roles.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>CURRENT_COMMISSION_RANK</label>
                            <input
                                type="text"
                                required
                                placeholder="E.G. LIEUTENANT"
                                value={formData.rank}
                                onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {error && (
                        <div style={errorBox}>
                            ⚠️ UPLINK_ERROR: {error.toUpperCase()}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="enlist-btn"
                        style={submitBtnStyle(loading)}
                    >
                        {loading ? 'UPLOADING_RECORDS...' : 'CONFIRM_ENLISTMENT'}
                    </button>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@900&display=swap');
                .enlist-btn:hover { background: #00ffd5 !important; color: #000 !important; box-shadow: 0 0 30px #00ffd5; }
                input:focus, select:focus { border-color: #00ffd5 !important; outline: none; }
            `}} />
        </CosmoLayout>
    );
}

/* --- THEME STYLES --- */
const containerStyle: React.CSSProperties = { padding: '60px', backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: "'JetBrains Mono', monospace" };
const headerStyle = { marginBottom: '50px', borderBottom: '1px solid #222', paddingBottom: '30px' };
const titleStyle = { color: '#fff', fontSize: '2rem', fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: '2px' };
const subTitleStyle = { color: '#00ffd5', fontSize: '0.75rem', fontWeight: 700, marginTop: '10px' };
const formBoxStyle = { maxWidth: '800px', background: '#080808', padding: '40px', border: '1px solid #1a1a1a' };
const fieldMargin = { marginBottom: '30px' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' };
const labelStyle = { display: 'block', color: '#555', fontSize: '0.65rem', fontWeight: 800, marginBottom: '12px', letterSpacing: '2px' };
const inputStyle = { width: '100%', backgroundColor: '#000', border: '1px solid #333', padding: '16px', color: '#fff', fontSize: '0.9rem', fontFamily: "'JetBrains Mono', monospace", boxSizing: 'border-box' as const };
const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none' as const };
const errorBox = { color: '#ff0055', border: '1px solid #ff0055', padding: '20px', marginBottom: '30px', fontSize: '0.8rem', fontWeight: 800 };
const submitBtnStyle = (loading: boolean) => ({ width: '100%', backgroundColor: loading ? '#222' : '#fff', color: '#000', padding: '20px', border: 'none', fontSize: '0.9rem', fontWeight: 900, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '2px', transition: '0.3s' });