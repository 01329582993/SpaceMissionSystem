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
            backgroundColor: '#1b1d29',
            padding: '20px',
            borderRadius: '15px',
            height: '350px',
            marginTop: '20px',
            border: '1px solid #2a2d3e'
        }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#4cc9f0', fontSize: '1rem', textTransform: 'uppercase' }}>
                Live Telemetry Stream
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#252525" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#666"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#666"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#161925', border: '1px solid #2a2d3e', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Line
                        type="monotone"
                        dataKey="temp"
                        name="Temp (°C)"
                        stroke="#4cc9f0"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="radiation"
                        name="Rad (mSv)"
                        stroke="#f72585"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
