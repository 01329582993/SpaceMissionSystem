"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function GlobalAesthetic() {
  const meshRef = useRef<THREE.Group>(null);
  
  // Slow orbital rotation
  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={meshRef}>
      {/* The "Holographic" Wireframe Globe */}
      <mesh>
        <sphereGeometry args={[2.5, 30, 30]} />
        <meshBasicMaterial 
          color="#00ffd5" 
          wireframe 
          transparent 
          opacity={0.1} 
        />
      </mesh>
      
      {/* Inner Solid Core for depth */}
      <mesh>
        <sphereGeometry args={[2.45, 32, 32]} />
        <meshBasicMaterial color="#050505" transparent opacity={0.8} />
      </mesh>

      {/* Atmospheric Glow Layer */}
      <mesh>
        <sphereGeometry args={[2.6, 32, 32]} />
        <meshBasicMaterial 
          color="#00ffd5" 
          transparent 
          opacity={0.03} 
          side={THREE.BackSide} 
        />
      </mesh>
    </group>
  );
}

function FleetPings({ ships }: { ships: any[] }) {
  // We useMemo so positions don't jump around on every re-render
  const pings = useMemo(() => {
    return ships.map((s) => {
      // Spherical coordinates conversion
      const phi = Math.acos(-1 + (Math.random() * 2));
      const theta = Math.random() * Math.PI * 2;
      const radius = 2.75; 

      // Support both "Operational" (Ships) and "Active" (Ground Stations)
      const isActive = s.health_status === 'Operational' || s.status === 'Active';

      return {
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        id: s.spacecraft_id || s.station_id,
        statusColor: isActive ? "#00ffd5" : "#ff0055"
      };
    });
  }, [ships]);

  return (
    <>
      {pings.map((p) => (
        <Float key={p.id} speed={3} rotationIntensity={1} floatIntensity={1}>
          <mesh position={p.position}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color={p.statusColor} />
          </mesh>
          {/* Subtle glow around the ping */}
          <pointLight 
            position={p.position} 
            color={p.statusColor} 
            intensity={1.2} 
            distance={2} 
            decay={2}
          />
        </Float>
      ))}
    </>
  );
}

interface OrbitalTrackerProps {
  ships: any[];
  fullScreen?: boolean;
}

export default function OrbitalTracker({ ships, fullScreen = false }: OrbitalTrackerProps) {
  return (
    <div style={{ 
      height: fullScreen ? '100vh' : '400px', 
      width: '100%', 
      background: '#000', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* UI Overlay Labels */}
      <div style={labelOverlay}>
        <div style={glitchText}>
          LIVE_SIGNAL_ARRAY // {ships.length} NODES_ENCRYPTED
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 7], fov: 40 }}>
        <color attach="background" args={["#000"]} />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.2} />
        
        {/* Visual Elements */}
        <GlobalAesthetic />
        <FleetPings ships={ships} />
        
        {/* Camera Interaction */}
        <OrbitControls 
          enablePan={false} 
          enableZoom={fullScreen} 
          autoRotate 
          autoRotateSpeed={0.8} 
          minDistance={5}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}

/* --- TACTICAL STYLES --- */
const labelOverlay: React.CSSProperties = {
  position: 'absolute',
  top: '30px',
  left: '30px',
  zIndex: 10,
  pointerEvents: 'none',
  fontFamily: "'JetBrains Mono', monospace"
};

const glitchText: React.CSSProperties = {
  fontSize: '0.65rem',
  color: '#00ffd5',
  borderLeft: '2px solid #00ffd5',
  padding: '8px 15px',
  background: 'rgba(0, 0, 0, 0.7)',
  fontWeight: 800,
  letterSpacing: '2px',
  textTransform: 'uppercase'
};