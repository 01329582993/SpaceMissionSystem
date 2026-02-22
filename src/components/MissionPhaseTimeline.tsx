"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowRightCircle } from 'lucide-react';

export default function MissionPhaseTimeline({ missionId }: { missionId: number }) {
    const [phases, setPhases] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPhases = async () => {
        try {
            const res = await fetch(`/api/missions/${missionId}/phases`);
            const data = await res.json();
            setPhases(data);
        } catch (err) {
            console.error("Failed to load phases:", err);
        }
    };

    useEffect(() => {
        fetchPhases();
    }, [missionId]);

    const advancePhase = async () => {
        const activeIndex = phases.findIndex(p => p.status === 'Active');
        if (activeIndex === -1) return;

        setLoading(true);
        try {
            // Mark current as Completed
            await fetch(`/api/missions/${missionId}/phases`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phase_id: phases[activeIndex].phase_id, status: 'Completed' })
            });

            // Mark next as Active if exists
            if (activeIndex + 1 < phases.length) {
                await fetch(`/api/missions/${missionId}/phases`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phase_id: phases[activeIndex + 1].phase_id, status: 'Active' })
                });
            }

            await fetchPhases();
        } catch (err) {
            console.error("Advance Phase Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#161925', padding: '25px', borderRadius: '15px', border: '1px solid #2a2d3e', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#4cc9f0', fontSize: '1.2rem' }}>MISSION TIMELINE</h3>
                <button
                    onClick={advancePhase}
                    disabled={loading || !phases.some(p => p.status === 'Active')}
                    style={{
                        backgroundColor: 'transparent',
                        color: '#4cc9f0',
                        border: '1px solid #4cc9f0',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(76, 201, 240, 0.1)'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    {loading ? 'SYNCING...' : 'ADVANCE PHASE →'}
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {/* Connection Line */}
                <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', backgroundColor: '#2a2d3e', zIndex: 0 }} />

                {phases.map((phase, idx) => {
                    const isActive = phase.status === 'Active';
                    const isCompleted = phase.status === 'Completed';

                    return (
                        <div key={phase.phase_id} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60px' }}>
                            <div style={{
                                backgroundColor: '#0b0d17',
                                color: isActive ? '#4cc9f0' : (isCompleted ? '#10b981' : '#444'),
                                marginBottom: '10px'
                            }}>
                                {isCompleted ? <CheckCircle2 size={30} /> : (isActive ? <ArrowRightCircle size={30} /> : <Circle size={30} />)}
                            </div>
                            <span style={{
                                fontSize: '0.65rem',
                                textAlign: 'center',
                                fontWeight: isActive ? 'bold' : 'normal',
                                color: isActive ? '#4cc9f0' : (isCompleted ? '#fff' : '#666'),
                                textTransform: 'uppercase'
                            }}>
                                {phase.phase_name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
