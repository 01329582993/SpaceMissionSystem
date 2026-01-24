"use client";
import { useEffect, useState } from "react";

export default function AstronautsPage() {
  const [astronauts, setAstronauts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/astronauts")
      .then(res => res.json())
      .then(setAstronauts);
  }, []);

  return (
    <div>
      <h1>Astronauts</h1>
      <ul>
        {astronauts.map(a => (
          <li key={a.astronaut_id}>
            {a.name} — {a.role} — {a.availability}
          </li>
        ))}
      </ul>
    </div>
  );
}
