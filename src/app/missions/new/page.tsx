"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
        <div style={{ padding: '40px', backgroundColor: '#0b0d17', minHeight: '100vh', color: 'white', fontFamily: 'sans-serif' }}>
            <header style={{ marginBottom: '40px' }}>
                <Link href="/missions" style={{ color: '#4cc9f0', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '10px', display: 'inline-block' }}>
                    ← BACK TO DIRECTORY
                </Link>
                <h1 style={{ color: '#4cc9f0', fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>INITIALIZE NEW MISSION</h1>
                <p style={{ color: '#888', margin: '5px 0 0 0' }}>ESTABLISHING NEW OPERATIONAL PARAMETERS</p>
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
                        Mission Name
                    </label>
                    <input
                        type="text"
                        required
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
                            outline: 'none',
                            transition: 'border-color 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4cc9f0'}
                        onBlur={(e) => e.target.style.borderColor = '#2a2d3e'}
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', color: '#4cc9f0', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Mission Commander
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.commander}
                        onChange={(e) => setFormData({ ...formData, commander: e.target.value })}
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
                        Primary Objective
                    </label>
                    <textarea
                        required
                        rows={4}
                        value={formData.objective}
                        onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                        style={{
                            width: '100%',
                            backgroundColor: '#0b0d17',
                            border: '1px solid #2a2d3e',
                            borderRadius: '6px',
                            padding: '12px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            resize: 'vertical'
                        }}
                    />
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
                    onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = '#6ee7ff')}
                    onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = '#4cc9f0')}
                >
                    {loading ? 'TRANSMITTING...' : 'INITIALIZE MISSION'}
                </button>
            </form>
        </div>
    );
}
