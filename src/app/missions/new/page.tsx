"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CosmoLayout from "@/src/components/CosmoLayout";

interface User { user_id: number; username: string; role: string; }
interface Spacecraft { spacecraft_id: number; name: string; }

export default function NewMissionPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    commander_id: "",
    pilot_id: "",
    engineer_id: "",
    analyst_id: "",
    spacecraft_id: "", 
    objective: "",
    status: "Planned",
    launch_date: ""
  });

  const [usersByRole, setUsersByRole] = useState<{ [role: string]: User[] }>({});
  const [spacecrafts, setSpacecrafts] = useState<Spacecraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = ["Commander", "Pilot", "Engineer", "Analyst"];

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Users by Role
        const result: { [role: string]: User[] } = {};
        for (const role of roles) {
          const res = await fetch(`/api/users?role=${role}`);
          const data = await res.json();
          result[role] = data.users || [];
        }
        setUsersByRole(result);

        // Fetch available Spacecraft Assets
        const shipRes = await fetch("/api/fuel/spacecrafts");
        const shipData = await shipRes.json();
        setSpacecrafts(shipData || []);
      } catch (err) {
        console.error("Failed to fetch dependencies", err);
      }
    }
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create mission");

      router.push("/missions");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", 
    padding: "14px", 
    borderRadius: "8px", 
    border: "1px solid #333",
    backgroundColor: "#111", 
    color: "#fff", 
    fontSize: "0.95rem", 
    outline: "none"
  };

  return (
    <CosmoLayout>
      <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", padding: "60px 20px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "10px", letterSpacing: '-1px' }}>CREATE_NEW_MISSION</h1>
          <p style={{ color: "#555", marginBottom: "40px", fontSize: '0.9rem' }}>LOG_NEW_ENTRY_INTO_CENTRAL_REGISTRY</p>
          
          <form onSubmit={handleSubmit} style={{ backgroundColor: "#0d0d0d", padding: "40px", borderRadius: "12px", border: "1px solid #222" }}>
            
            {/* Mission Name */}
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#555", fontSize: '0.7rem', fontWeight: 'bold' }}>MISSION_NAME</label>
              <input name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. APOLLO_RECON" style={inputStyle} />
            </div>

            {/* Spacecraft Selection */}
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#3b82f6", fontSize: '0.7rem', fontWeight: 'bold' }}>ASSIGN_SPACECRAFT_ASSET</label>
              <select name="spacecraft_id" required value={formData.spacecraft_id} onChange={handleChange} style={{...inputStyle, border: '1px solid #3b82f6'}}>
                <option value="">-- SELECT SPACECRAFT --</option>
                {spacecrafts.map((s) => (
                  <option key={s.spacecraft_id} value={s.spacecraft_id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Crew Roles */}
            {roles.map((role) => (
              <div key={role} style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "#555", fontSize: '0.7rem', fontWeight: 'bold' }}>{role.toUpperCase()}</label>
                <select name={role.toLowerCase() + "_id"} required={role === "Commander"} value={(formData as any)[role.toLowerCase() + "_id"]} onChange={handleChange} style={inputStyle}>
                  <option value="">Select {role}</option>
                  {(usersByRole[role] || []).map((user) => (
                    <option key={user.user_id} value={user.user_id}>{user.username}</option>
                  ))}
                </select>
              </div>
            ))}

            {/* Date and Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "#555", fontSize: '0.7rem', fontWeight: 'bold' }}>LAUNCH_DATE</label>
                    <input type="date" name="launch_date" required value={formData.launch_date} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: "8px", color: "#555", fontSize: '0.7rem', fontWeight: 'bold' }}>MISSION_STATUS</label>
                    <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                        <option value="Planned">Planned</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {/* Objective */}
            <div style={{ marginBottom: "30px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#555", fontSize: '0.7rem', fontWeight: 'bold' }}>MISSION_OBJECTIVE</label>
              <textarea name="objective" required rows={3} value={formData.objective} onChange={handleChange} placeholder="Define primary mission goals..." style={inputStyle} />
            </div>

            {error && (
              <div style={{ color: '#ff4d4d', fontSize: '0.8rem', marginBottom: '20px', padding: '10px', border: '1px solid #ff4d4d', borderRadius: '4px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "16px", borderRadius: "8px", border: "none", backgroundColor: loading ? "#222" : "#fff", color: "#000", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: '1rem' }}>
              {loading ? "INITIALIZING_REGISTRY..." : "DEPLOY_MISSION_ENTRY"}
            </button>
          </form>
        </div>
      </div>
    </CosmoLayout>
  );
}