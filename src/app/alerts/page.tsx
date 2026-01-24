"use client";
import { useEffect, useState } from "react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/alerts")
      .then(res => res.json())
      .then(setAlerts);
  }, []);

  return (
    <div>
      <h1>Alerts</h1>
      <ul>
        {alerts.map(a => (
          <li key={a.alert_id}>
            [{a.level}] {a.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
