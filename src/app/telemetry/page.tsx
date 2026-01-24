"use client";
import { useEffect, useState } from "react";

export default function TelemetryPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/telemetry")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1>Telemetry</h1>
      <ul>
        {data.map(t => (
          <li key={t.telemetry_id}>
            Mission {t.mission_id} | Fuel: {t.fuel} | Temp: {t.temperature}
          </li>
        ))}
      </ul>
    </div>
  );
}
