import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Card } from "@efa/ui";

function Scene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />

      {/* simple “rune stone” */}
      <mesh rotation={[0.2, 0.4, 0]}>
        <cylinderGeometry args={[1, 1.1, 0.6, 32]} />
        <meshStandardMaterial roughness={0.9} metalness={0.05} />
      </mesh>

      <OrbitControls enablePan={false} />
    </>
  );
}

export function StonesPage() {
  const [webglDead, setWebglDead] = React.useState(false);

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">3D Rune Stones</h2>
        <p className="text-sm text-white/60">
          If WebGL crashes in dev (hot reload), refresh once. This page is tuned to avoid context loss.
        </p>
      </div>

      <Card>
        <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {webglDead ? (
            <div className="grid h-full place-items-center text-white/60">
              WebGL context lost. Refresh the page.
            </div>
          ) : (
            <Canvas
              dpr={[1, 1.5]}
              frameloop="demand"
              gl={{ antialias: true, powerPreference: "high-performance" }}
              onCreated={({ gl }) => {
                const canvas = gl.domElement;

                const onLost = (e: Event) => {
                  e.preventDefault();
                  setWebglDead(true);
                };

                canvas.addEventListener("webglcontextlost", onLost, { passive: false });
              }}
            >
              <Scene />
            </Canvas>
          )}
        </div>
      </Card>
    </div>
  );
}