import React, { useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

function Orb({ glyph }) {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial metalness={0.4} roughness={0.5} />
      </mesh>

      <Text position={[0, 0, 1.21]} fontSize={1.0} anchorX="center" anchorY="middle">
        {glyph}
      </Text>
    </group>
  );
}

export function RuneOrb({ glyph }) {
  const [contextLost, setContextLost] = useState(false);

  const handleCreated = useCallback(({ gl }) => {
    const canvas = gl.domElement;

    const onLost = (e) => {
      e.preventDefault();
      setContextLost(true);
    };

    canvas.addEventListener("webglcontextlost", onLost, false);

    // NOTE: we intentionally do NOT try to restore the context automatically.
    // If it happens, we show a lightweight fallback instead.
  }, []);

  if (contextLost) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-white/10 bg-black/30">
        <span className="text-6xl">{glyph}</span>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "low-power" }}
      onCreated={handleCreated}
      frameloop="demand"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1.1} />
      <Orb glyph={glyph} />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
