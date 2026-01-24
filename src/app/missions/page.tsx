"use client";
import { useEffect, useState } from "react";

export default function MissionsPage() {
  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/missions")
      .then(res => res.json())
      .then(data => setMissions(data));
  }, []);

  return (
    <div>
      <h1>Missions</h1>
      <ul>
        {missions.map(m => (
          <li key={m.mission_id}>
            {m.name} — {m.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
