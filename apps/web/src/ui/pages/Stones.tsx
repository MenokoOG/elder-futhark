import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { ELDER_FUTHARK } from "@efa/shared";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

function Fallback({ reason }: { reason: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-3">
      <h1 className="text-xl font-semibold">Stones</h1>
      <p className="opacity-80">{reason}</p>

      <div className="rounded-md border border-white/10 bg-black/20 p-4 text-sm opacity-90 space-y-2">
        <div className="font-semibold">Quick recovery steps</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Refresh the page.</li>
          <li>Close other GPU-heavy tabs (YouTube, other 3D demos).</li>
          <li>If dev mode: remove React StrictMode (it double-mounts).</li>
          <li>Try Chrome “Use hardware acceleration” on/off.</li>
        </ul>
      </div>
    </div>
  );
}

type Stone = { glyph: string; color: string; name: string };

function StonesScene({ stones }: { stones: Stone[] }) {
  const groupRef = React.useRef<THREE.Group>(null);
  // create GPU objects once
  const geo = React.useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const mat = React.useMemo(
    () => new THREE.MeshStandardMaterial({ metalness: 0.15, roughness: 0.7, color: "#d9d2c7" }),
    []
  );

  // slow spin so stones don't feel static
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  React.useEffect(() => {
    return () => {
      geo.dispose();
      mat.dispose();
    };
  }, [geo, mat]);

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 5, 2]} intensity={1.0} />
      <group ref={groupRef}>
        {stones.map((s, i) => {
          const angle = (i / stones.length) * Math.PI * 2;
          const radius = 3;
          const pos: [number, number, number] = [Math.cos(angle) * radius, 0, Math.sin(angle) * radius];
          return (
            <group key={`${s.name}-${i}`} position={pos}>
            <mesh geometry={geo} material={mat}>
              <meshStandardMaterial color={s.color} metalness={0.2} roughness={0.65} />
            </mesh>
            <Text
              position={[0, 0, 1.05]}
              fontSize={0.9}
              color="#f7f1e8"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.02}
              outlineColor="black"
            >
              {s.glyph}
              <meshStandardMaterial />
            </Text>
            </group>
          );
        })}
      </group>
      <OrbitControls enableDamping />
    </>
  );
}

export function StonesPage() {
  const [contextLost, setContextLost] = React.useState(false);
  const palette = React.useMemo(() => ["#d9b26f", "#c68e5f", "#b6714d", "#b19882", "#d3c0a8", "#9f7f63"], []);

  const pickStones = React.useCallback((): Stone[] => {
    const shuffled = [...ELDER_FUTHARK].sort(() => Math.random() - 0.5);
    const count = 6;
    const picks = shuffled.slice(0, count);
    return picks.map((r, i) => ({ glyph: r.glyph, name: r.name, color: palette[i % palette.length] }));
  }, [palette]);

  const [stones, setStones] = React.useState<Stone[]>(() => pickStones());

  // Refresh stones every few seconds to keep the scene lively
  React.useEffect(() => {
    const id = setInterval(() => setStones(pickStones()), 7000);
    return () => clearInterval(id);
  }, [pickStones]);

  if (!hasWebGL()) {
    return <Fallback reason="WebGL is unavailable in this browser/device." />;
  }

  if (contextLost) {
    return <Fallback reason="The 3D renderer lost its GPU context. This happens in dev when canvases mount/unmount quickly or the GPU is busy." />;
  }

  return (
    <div className="h-[calc(100vh-64px)] w-full">
      <Canvas
        dpr={1}
        // Use continuous render; demand mode can leave a blank canvas with no invalidation
        frameloop="always"
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
          depth: true,
          stencil: false
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;

          const onLost = (e: Event) => {
            e.preventDefault();
            setContextLost(true);
          };

          canvas.addEventListener("webglcontextlost", onLost as any, { passive: false });

          // cleanup
          return () => {
            canvas.removeEventListener("webglcontextlost", onLost as any);
            try {
              gl.dispose();
            } catch {}
          };
        }}
      >
        <StonesScene stones={stones} />
      </Canvas>
    </div>
  );
}