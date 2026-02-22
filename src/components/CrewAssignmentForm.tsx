"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CrewAssignmentForm({ missionId }: { missionId: number }) {
    const router = useRouter();
    const [personnel, setPersonnel] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState('');
    const [position, setPosition] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/astronauts')
            .then(res => res.json())
            .then(data => setPersonnel(data.filter((p: any) => p.availability === 'Available')))
            .catch(err => console.error("Failed to load personnel:", err));
    }, []);

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedId) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/missions/${missionId}/crew`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    astronaut_id: parseInt(selectedId),
                    position: position
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Assignment failed');
            }

            setSelectedId('');
            setPosition('');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #2a2d3e', borderRadius: '10px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#4cc9f0', textTransform: 'uppercase' }}>Assign New Crew Member</h4>
            <form onSubmit={handleAssign}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        required
                        style={{
                            backgroundColor: '#0b0d17',
                            color: 'white',
                            padding: '8px',
                            border: '1px solid #2a2d3e',
                            borderRadius: '4px',
                            fontSize: '0.85rem'
                        }}
                    >
                        <option value="">Select Available Personnel...</option>
                        {personnel.map(p => (
                            <option key={p.astronaut_id} value={p.astronaut_id}>
                                {p.name} ({p.role})
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Position (e.g. Lead Pilot)"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        style={{
                            backgroundColor: '#0b0d17',
                            color: 'white',
                            padding: '8px',
                            border: '1px solid #2a2d3e',
                            borderRadius: '4px',
                            fontSize: '0.85rem'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={loading || !selectedId}
                        style={{
                            backgroundColor: loading ? '#2a2d3e' : '#4cc9f0',
                            color: '#0b0d17',
                            padding: '10px',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: (loading || !selectedId) ? 'not-allowed' : 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        {loading ? 'ASSIGNING...' : 'ASSIGN TO MISSION'}
                    </button>
                </div>
                {error && <p style={{ color: '#ff4d4d', fontSize: '0.75rem', marginTop: '10px' }}>⚠️ {error}</p>}
            </form>
        </div>
    );
}
