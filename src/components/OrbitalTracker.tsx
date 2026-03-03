"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import * as THREE from "three";

function GlobalAesthetic() {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={meshRef}>
      <mesh>
        <sphereGeometry args={[2.5, 40, 40]} />
        <meshBasicMaterial color="#00ffd5" wireframe transparent opacity={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.48, 40, 40]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function FleetPings({ ships }: { ships: any[] }) {
  const pings = useMemo(() => {
    return ships.map((s, i) => {
      const phi = Math.acos(-1 + (Math.random() * 2));
      const theta = Math.random() * Math.PI * 2;
      const radius = 2.7;
      return {
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        id: s.spacecraft_id,
        status: s.health_status
      };
    });
  }, [ships]);

  return (
    <>
      {pings.map((p) => (
        <Float key={p.id} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={p.status === 'Operational' ? "#00ffd5" : "#ff0055"} />
          </mesh>
          <pointLight position={[p.x, p.y, p.z]} color={p.status === 'Operational' ? "#00ffd5" : "#ff0055"} intensity={0.8} distance={1.5} />
        </Float>
      ))}
    </>
  );
}

export default function OrbitalTracker({ ships }: { ships: any[] }) {
  return (
    <div style={{ height: '400px', width: '100%', background: '#050505', border: '1px solid #222', marginBottom: '40px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ fontSize: '0.6rem', color: '#00ffd5', border: '1px solid #00ffd544', padding: '5px 10px', background: '#000000aa', fontWeight: 800 }}>
          LIVE_ORBITAL_TELEMETRY // {ships.length} ASSETS_DETECTED
        </div>
      </div>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <GlobalAesthetic />
        <FleetPings ships={ships} />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}