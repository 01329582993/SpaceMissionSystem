"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CosmoLayout from '@/src/components/CosmoLayout';

export default function NewSpacecraftPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        model: '',
        fuel_level: 100,
        mission_id: ''
    });
    const [missions, setMissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/missions')
            .then(res => res.json())
            .then(data => setMissions(data))
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

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to register spacecraft');
            }

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
            <div style={{ padding: '60px', color: 'white', fontFamily: 'sans-serif' }}>
                <header style={{ marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                    <h1 style={{ color: '#4cc9f0', fontSize: '2.5rem', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>VESSEL REGISTRATION</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: '5px 0 0 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>ADDING NEW ASSETS TO THE COSMOTRACK FLEET</p>
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.75rem', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Spacecraft Name
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Discovery-7"
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
                                    outline: 'none'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.75rem', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Model / Class
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Mk.4 Surveyor"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
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
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.75rem', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Initial Fuel Reserves (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                required
                                value={formData.fuel_level}
                                onChange={(e) => setFormData({ ...formData, fuel_level: parseInt(e.target.value) })}
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

                        <div>
                            <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.75rem', fontWeight: '800', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Mission Assignment
                            </label>
                            <select
                                value={formData.mission_id}
                                onChange={(e) => setFormData({ ...formData, mission_id: e.target.value })}
                                style={{
                                    width: '100%',
                                    backgroundColor: 'rgba(11, 13, 23, 0.9)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px',
                                    padding: '16px',
                                    color: 'white',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    appearance: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">STAY IN HANGAR (UNASSIGNED)</option>
                                {missions.map(m => <option key={m.mission_id} value={m.mission_id}>{m.mission_name.toUpperCase()}</option>)}
                            </select>
                        </div>
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
                            ⚠️ REGISTRATION FAILED: {error}
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
                        {loading ? 'TRANSMITTING DESIGNATION...' : 'REGISTER VESSEL'}
                    </button>
                </form>
            </div>
        </CosmoLayout>
    );
}

