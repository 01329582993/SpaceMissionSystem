"use client";

import { useState } from "react";
import CosmoLayout from "@/src/components/CosmoLayout";

export default function RiskAssessmentPage() {
  const [formData, setFormData] = useState({
    mission_id: 1,
    fuel: 80,
    radiation: 0.5,
    health: 95,
    budget: 500000,
    duration: 30
  });
  
  const [result, setResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  const runAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    
    const res = await fetch("/api/risk-assessment", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    
    setTimeout(() => {
      setResult(data);
      setCalculating(false);
    }, 1500); // Visual delay for "AI" feel
  };

  return (
    <CosmoLayout>
      <div style={container}>
        <h1 style={title}>// MISSION_RISK_PREDICTION_SYSTEM</h1>
        
        <div style={grid}>
          {/* INPUT FORM */}
          <section style={panel}>
            <h3 style={label}>PREDICTIVE_PARAMETERS</h3>
            <form onSubmit={runAssessment} style={form}>
              <div style={inputItem}>
                <span>FUEL_LEVEL (%)</span>
                <input type="range" min="0" max="100" value={formData.fuel} onChange={e => setFormData({...formData, fuel: Number(e.target.value)})} />
                <span style={valText}>{formData.fuel}%</span>
              </div>
              
              <div style={inputItem}>
                <span>HEALTH_SCORE (1-100)</span>
                <input type="number" value={formData.health} onChange={e => setFormData({...formData, health: Number(e.target.value)})} />
              </div>

              <div style={inputItem}>
                <span>RAD_LEVEL (mSv)</span>
                <input type="number" step="0.1" value={formData.radiation} onChange={e => setFormData({...formData, radiation: Number(e.target.value)})} />
              </div>

              <button type="submit" style={btn}>EXECUTE_RISK_ANALYSIS</button>
            </form>
          </section>

          {/* AI RESULT DISPLAY */}
          <section style={resultPanel(result?.risk_level)}>
            <h3 style={label}>ANALYSIS_OUTPUT</h3>
            {calculating ? (
              <div style={loader}>RUNNING_HEURISTIC_MODELS...</div>
            ) : result ? (
              <div style={{textAlign: 'center'}}>
                <div style={riskLabel}>PROBABILITY_OF_FAILURE</div>
                <div style={riskScore}>{result.risk_score}%</div>
                <div style={statusBadge}>{result.risk_level}</div>
                
                <div style={details}>
                   <p>UPLINK_TIME: {new Date(result.calculated_at).toLocaleString()}</p>
                   <p>MITIGATION_STRATEGY: {result.risk_level === 'CRITICAL' ? 'ABORT_MISSION' : 'PROCEED_WITH_CAUTION'}</p>
                </div>
              </div>
            ) : (
              <div style={empty}>WAITING_FOR_UPLINK...</div>
            )}
          </section>
        </div>
      </div>
    </CosmoLayout>
  );
}

/* --- NASA STYLES --- */
const container: any = { padding: '50px', background: '#000', minHeight: '100vh', color: '#FFF', fontFamily: 'monospace' };
const title = { fontSize: '1.5rem', letterSpacing: '4px', marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '10px' };
const grid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' };
const panel = { background: '#080808', border: '1px solid #1a1a1a', padding: '30px' };
const label = { fontSize: '0.7rem', color: '#444', marginBottom: '20px', letterSpacing: '2px' };
const form = { display: 'flex', flexDirection: 'column' as const, gap: '20px' };
const inputItem = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#000', padding: '10px' };
const valText = { color: '#00ffd5', fontWeight: 'bold' as const };
const btn = { background: '#00ffd5', color: '#000', padding: '15px', border: 'none', fontWeight: 'bold' as const, cursor: 'pointer', marginTop: '20px' };

const resultPanel = (level: string) => ({
  ...panel,
  borderColor: level === 'CRITICAL' ? '#ff0055' : level === 'LOW' ? '#00ffd5' : '#1a1a1a',
  display: 'flex', flexDirection: 'column' as const, justifyContent: 'center'
});

const riskLabel = { fontSize: '0.8rem', color: '#666' };
const riskScore = { fontSize: '5rem', fontWeight: 900, margin: '10px 0' };
const statusBadge = { padding: '5px 20px', background: '#FFF', color: '#000', fontSize: '1rem', fontWeight: 'bold' as const };
const details = { marginTop: '30px', fontSize: '0.7rem', color: '#444', lineHeight: '1.8' };
const loader = { fontSize: '1rem', color: '#00ffd5', textAlign: 'center' as const };
const empty = { color: '#222', textAlign: 'center' as const };