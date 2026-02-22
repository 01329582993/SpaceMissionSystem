"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket } from 'lucide-react';

export default function LaunchButton({ missionId, status }: { missionId: number, status: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (status !== 'Planned') return null;

    const handleLaunch = async () => {
        if (!confirm("ALERT: Are you sure you want to initialize the launch sequence? This will engage all systems and deploy the mission.")) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/missions/${missionId}/launch`, { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Launch sequence failed');

            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <button
                onClick={handleLaunch}
                disabled={loading}
                style={{
                    width: '100%',
                    backgroundColor: loading ? '#2a2d3e' : '#f72585',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: loading ? 'none' : '0 0 15px rgba(247, 37, 133, 0.4)'
                }}
            >
                <Rocket size={18} />
                {loading ? 'Executing Sequence...' : 'Initialize Launch Sequence'}
            </button>
            {error && (
                <p style={{
                    color: '#ff4d4d',
                    backgroundColor: 'rgba(255, 77, 77, 0.1)',
                    padding: '10px',
                    borderRadius: '4px',
                    marginTop: '10px',
                    fontSize: '0.75rem',
                    border: '1px solid #ff4d4d'
                }}>
                    ⚠️ COMMAND ERROR: {error}
                </p>
            )}
        </div>
    );
}
