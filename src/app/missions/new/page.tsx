"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CosmoLayout from '@/src/components/CosmoLayout';

export default function NewMissionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        objective: '',
        commander: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/missions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create mission');
            }

            router.push('/missions');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <CosmoLayout>
            <div style={{ padding: '60px', color: 'white', fontFamily: 'sans-serif' }}>
                <header style={{ marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                    <h1 style={{ color: '#4cc9f0', fontSize: '2.5rem', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>INITIALIZE MISSION</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>ESTABLISHING NEW OPERATIONAL PARAMETERS</p>
                </header>

                <form onSubmit={handleSubmit} style={{
                    maxWidth: '800px',
                    backgroundColor: 'rgba(27, 29, 41, 0.7)',
                    backdropFilter: 'blur(10px)',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.75rem', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Mission Designation
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="OPERATIONAL CODENAME"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{
                                width: '100%',
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                padding: '16px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.75rem', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Mission Commander
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="OFFICER IN CHARGE"
                            value={formData.commander}
                            onChange={(e) => setFormData({ ...formData, commander: e.target.value })}
                            style={{
                                width: '100%',
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                padding: '16px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.75rem', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Primary Objective
                        </label>
                        <textarea
                            required
                            rows={4}
                            placeholder="DETAILED MISSION PARAMETERS..."
                            value={formData.objective}
                            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                            style={{
                                width: '100%',
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                padding: '16px',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none',
                                resize: 'vertical',
                                minHeight: '120px'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            color: '#f72585',
                            backgroundColor: 'rgba(247, 37, 133, 0.1)',
                            padding: '20px',
                            borderRadius: '10px',
                            marginBottom: '30px',
                            fontSize: '0.9rem',
                            border: '1px solid rgba(247, 37, 133, 0.3)',
                            fontWeight: 'bold'
                        }}>
                            ⚠️ TELEMETRY ERROR: {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            backgroundColor: loading ? 'rgba(255,255,255,0.1)' : '#4cc9f0',
                            color: loading ? 'rgba(255,255,255,0.3)' : '#0b0d17',
                            padding: '18px',
                            borderRadius: '12px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            boxShadow: loading ? 'none' : '0 10px 30px rgba(76, 201, 240, 0.3)'
                        }}
                    >
                        {loading ? 'SYNCING WITH COMMAND...' : 'INITIALIZE MISSION'}
                    </button>
                </form>
            </div>
        </CosmoLayout>
    );
}

