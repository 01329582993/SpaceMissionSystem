"use client";

import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function MissionTelemetryChart({ missionId }: { missionId: number }) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/telemetry?mission_id=${missionId}`);
                const result = await res.json();

                // Formulate for chart (newest first from API, so reverse for timeline)
                const formatted = result.reverse().map((t: any) => ({
                    time: new Date(t.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    temp: parseFloat(t.temperature),
                    fuel: parseFloat(t.fuel_level),
                    radiation: parseFloat(t.radiation)
                }));

                setData(formatted);
            } catch (err) {
                console.error("Chart Fetch Error:", err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000); // Update every 5s
        return () => clearInterval(interval);
    }, [missionId]);

    return (
        <div style={{
            backgroundColor: 'rgba(27, 29, 41, 0.7)',
            backdropFilter: 'blur(10px)',
            padding: '30px',
            borderRadius: '20px',
            height: '450px',
            marginTop: '40px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <h3 style={{ margin: '0 0 25px 0', color: '#4cc9f0', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '800' }}>
                Live Telemetry Stream
            </h3>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4cc9f0" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#4cc9f0" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorRad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f72585" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#f72585" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="rgba(255,255,255,0.3)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.3)"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(22, 25, 37, 0.95)',
                            border: '1px solid rgba(76, 201, 240, 0.3)',
                            borderRadius: '12px',
                            color: '#fff',
                            backdropFilter: 'blur(10px)',
                            padding: '15px'
                        }}
                        itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                    />
                    <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', paddingBottom: '20px' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="temp"
                        name="Temp (°C)"
                        stroke="#4cc9f0"
                        strokeWidth={3}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={1000}
                    />
                    <Line
                        type="monotone"
                        dataKey="radiation"
                        name="Rad (mSv)"
                        stroke="#f72585"
                        strokeWidth={3}
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={1000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

