"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        <div style={{ padding: '40px', backgroundColor: '#0b0d17', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            <header style={{ marginBottom: '40px' }}>
                <Link href="/spacecraft" style={{ color: '#4cc9f0', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '10px', display: 'inline-block' }}>
                    ← BACK TO HANGAR
                </Link>
                <h1 style={{ color: '#4cc9f0', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>VESSEL REGISTRATION</h1>
                <p style={{ color: '#888', margin: '5px 0 0 0' }}>ADDING NEW ASSETS TO THE COSMOTRACK FLEET</p>
            </header>

            <form onSubmit={handleSubmit} style={{
                maxWidth: '600px',
                backgroundColor: '#161925',
                padding: '40px',
                borderRadius: '12px',
                border: '1px solid #2a2d3e',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
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
                            backgroundColor: '#0b0d17',
                            border: '1px solid #2a2d3e',
                            borderRadius: '6px',
                            padding: '12px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
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
                            backgroundColor: '#0b0d17',
                            border: '1px solid #2a2d3e',
                            borderRadius: '6px',
                            padding: '12px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Initial Fuel Level (%)
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
                            backgroundColor: '#0b0d17',
                            border: '1px solid #2a2d3e',
                            borderRadius: '6px',
                            padding: '12px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Mission Assignment (Optional)
                    </label>
                    <select
                        value={formData.mission_id}
                        onChange={(e) => setFormData({ ...formData, mission_id: e.target.value })}
                        style={{
                            width: '100%',
                            backgroundColor: '#0b0d17',
                            border: '1px solid #2a2d3e',
                            borderRadius: '6px',
                            padding: '12px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            appearance: 'none'
                        }}
                    >
                        <option value="">Unassigned</option>
                        {missions.map(m => <option key={m.mission_id} value={m.mission_id}>{m.mission_name}</option>)}
                    </select>
                </div>

                {error && (
                    <div style={{ color: '#ff4d4d', backgroundColor: 'rgba(255, 77, 77, 0.1)', padding: '15px', borderRadius: '6px', marginBottom: '25px', fontSize: '0.9rem', border: '1px solid #ff4d4d' }}>
                        ⚠️ ERROR: {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        backgroundColor: loading ? '#2a2d3e' : '#4cc9f0',
                        color: '#0b0d17',
                        padding: '15px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    {loading ? 'COMPLETING HANGAR SYNC...' : 'REGISTER VESSEL'}
                </button>
            </form>
        </div>
    );
}
