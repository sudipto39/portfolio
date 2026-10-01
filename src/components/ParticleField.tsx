import { Component, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

type Pointer = { x: number; y: number };

function Starfield({ pointer }: { pointer: RefObject<Pointer> }) {
  const ref = useRef<THREE.Points>(null);
  const [positions] = useState(() => {
    const count = 4000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.7 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  });

  useFrame((_, delta) => {
    const pts = ref.current;
    if (!pts) return;
    pts.rotation.x -= delta / 20;
    pts.rotation.y -= delta / 28;
    const p = pointer.current;
    pts.position.x = THREE.MathUtils.lerp(pts.position.x, p.x * 0.06, 0.04);
    pts.position.y = THREE.MathUtils.lerp(pts.position.y, p.y * 0.06, 0.04);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial transparent color="#fb923c" size={0.0045} sizeAttenuation depthWrite={false} opacity={0.85} />
      </Points>
    </group>
  );
}

/** WebGL can be unavailable (old GPUs, privacy modes) — fail silently instead of crashing the page. */
class SilentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function ParticleField({ active = true }: { active?: boolean }) {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <SilentBoundary>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <Starfield pointer={pointer} />
      </Canvas>
    </SilentBoundary>
  );
}
