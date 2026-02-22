"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VesselAssignmentForm({ missionId }: { missionId: number }) {
    const router = useRouter();
    const [vessels, setVessels] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch all spacecraft and filter for unassigned ones
        fetch('/api/spacecraft')
            .then(res => res.json())
            .then(data => setVessels(data.filter((v: any) => v.mission_id === null)))
            .catch(err => console.error("Failed to load vessels:", err));
    }, []);

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedId) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/missions/${missionId}/vessels`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spacecraft_id: parseInt(selectedId)
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Vessel assignment failed');
            }

            setSelectedId('');
            router.refresh();

            // Re-fetch vessels to update the list
            const updatedRes = await fetch('/api/spacecraft');
            const updatedData = await updatedRes.json();
            setVessels(updatedData.filter((v: any) => v.mission_id === null));

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            marginTop: '30px',
            padding: '25px',
            backgroundColor: 'rgba(255,255,255,0.02)',
            borderRadius: '15px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#4cc9f0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Deploy Unassigned Vessel
            </h4>
            <form onSubmit={handleAssign}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        required
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            color: 'white',
                            padding: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">Select Hangar Asset...</option>
                        {vessels.map(v => (
                            <option key={v.spacecraft_id} value={v.spacecraft_id}>
                                {v.name} ({v.model}) - FUEL: {v.fuel_level}%
                            </option>
                        ))}
                        {vessels.length === 0 && <option disabled>No unassigned vessels available</option>}
                    </select>

                    <button
                        type="submit"
                        disabled={loading || !selectedId}
                        style={{
                            backgroundColor: loading ? 'rgba(76, 201, 240, 0.2)' : '#4cc9f0',
                            color: '#0b0d17',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: (loading || !selectedId) ? 'not-allowed' : 'pointer',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {loading ? 'DEPLOYING...' : 'CONFIRM DEPLOYMENT'}
                    </button>
                </div>
                {error && <p style={{ color: '#f72585', fontSize: '0.8rem', marginTop: '12px', fontWeight: 'bold' }}>⚠️ {error}</p>}
            </form>
        </div>
    );
}
