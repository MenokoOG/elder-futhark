import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Card } from "../../../../../packages/ui/src/components/Card";
import { ELDER_FUTHARK } from "../../../../../packages/shared/src";

type Pick = { key: string; name: string; glyph: string; meaning: string[]; notes: string } | null;

function Stone({
  x,
  z,
  rune,
  onPick
}: {
  x: number;
  z: number;
  rune: any;
  onPick: (r: any) => void;
}) {
  return (
    <group position={[x, 0, z]} onClick={() => onPick(rune)}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.5, 1.2]} />
        <meshStandardMaterial roughness={0.9} metalness={0.1} />
      </mesh>
      <Text position={[0, 0.45, 0]} fontSize={0.55} color="white">
        {rune.glyph}
      </Text>
    </group>
  );
}

export function StonesPage() {
  const [pick, setPick] = React.useState<Pick>(null);

  const runes = ELDER_FUTHARK;
  const positions = React.useMemo(() => {
    const pts: Array<{ x: number; z: number; r: any }> = [];
    const radius = 4.0;
    for (let i = 0; i < runes.length; i++) {
      const ang = (i / runes.length) * Math.PI * 2;
      pts.push({ x: Math.cos(ang) * radius, z: Math.sin(ang) * radius, r: runes[i]! });
    }
    return pts;
  }, []);

  return (
    <div className="grid gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">3D Rune Stones</h2>
        <p className="text-sm text-white/60">
          Free-tier friendly: all 3D is client-side. Click a stone to inspect rune details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.6fr_1fr]">
        <Card className="h-[520px] p-0 overflow-hidden">
          <Canvas shadows camera={{ position: [0, 7, 10], fov: 45 }}>
            <ambientLight intensity={0.35} />
            <directionalLight position={[6, 10, 6]} intensity={1.2} castShadow />
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[50, 50]} />
              <meshStandardMaterial />
            </mesh>

            {positions.map((p) => (
              <Stone key={p.r.key} x={p.x} z={p.z} rune={p.r} onPick={setPick} />
            ))}

            <OrbitControls enablePan={false} />
          </Canvas>
        </Card>

        <Card>
          <div className="text-xs text-white/60 font-mono">inspection</div>
          {!pick ? (
            <div className="mt-3 text-white/60">Click a stone.</div>
          ) : (
            <div className="mt-3 grid gap-2">
              <div className="text-5xl rune-glow">{pick.glyph}</div>
              <div className="text-lg font-bold">{pick.name}</div>
              <div className="flex flex-wrap gap-2">
                {pick.meaning.map((m) => (
                  <span key={m} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
                    {m}
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/75">{pick.notes}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}