import Link from 'next/link';

async function getPersonnel() {

  const res = await fetch('http://localhost:3000/api/astronauts', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function AstronautsPage() {
  const staff = await getPersonnel();

  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#0b0d17', 
      minHeight: '100vh', 
      color: 'white', 
      fontFamily: 'sans-serif',
      paddingBottom: '100px' 
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800' }}>PERSONNEL ROSTER</h1>
          <p style={{ color: '#4cc9f0', margin: '5px 0 0 0' }}>ACTIVE DUTY OFFICERS: {staff.length}</p>
        </div>
        <Link href="/dashboard" style={{ 
          padding: '10px 20px', 
          border: '1px solid #4cc9f0', 
          color: '#4cc9f0', 
          textDecoration: 'none', 
          borderRadius: '4px' 
        }}>
          RETURN TO COMMAND
        </Link>
      </header>

      <div style={{ backgroundColor: '#161925', borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#1b1d29', borderBottom: '2px solid #2a2d3e' }}>
              <th style={{ padding: '20px', color: '#4cc9f0' }}>OFFICER NAME</th>
              <th style={{ padding: '20px', color: '#4cc9f0' }}>ROLE</th>
              <th style={{ padding: '20px', color: '#4cc9f0' }}>STATUS</th>
              <th style={{ padding: '20px', textAlign: 'right', color: '#4cc9f0' }}>ID</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((a: any) => (
              <tr key={a.astronaut_id} style={{ borderBottom: '1px solid #2a2d3e' }}>
                <td style={{ padding: '20px', fontWeight: 'bold' }}>{a.name.toUpperCase()}</td>
                <td style={{ padding: '20px', color: '#ccc' }}>{a.role}</td>
                <td style={{ padding: '20px' }}>
                  <span style={{ 
                   
                    color: a.availability ? '#10b981' : '#f72585',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ 
                      width: '8px', height: '8px', borderRadius: '50%', 
                      backgroundColor: a.availability ? '#10b981' : '#f72585',
                      boxShadow: `0 0 8px ${a.availability ? '#10b981' : '#f72585'}`
                    }}></span>
                    {a.availability ? 'AVAILABLE' : 'ON MISSION'}
                  </span>
                </td>
                <td style={{ padding: '20px', textAlign: 'right', color: '#555' }}>
                  #{a.astronaut_id}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}