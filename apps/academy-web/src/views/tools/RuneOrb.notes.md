# RuneOrb

Keep `RuneOrb.jsx` as it is — the redesign only changes its container (see `OrbLab.jsx`).

Two optional tweaks to match the Organic palette:

```jsx
// sphere material: sage rather than default white
<meshStandardMaterial color="#8fa073" metalness={0.25} roughness={0.6} />

// glyph text: cream
<Text position={[0, 0, 1.21]} fontSize={1.0} color="#f9f4ed" anchorX="center" anchorY="middle">
  {glyph}
</Text>
```

The context-lost fallback should use the warm ground too:

```jsx
<div className="grid h-full w-full place-items-center rounded-lg bg-neutral-200">
  <span className="text-6xl text-neutral-700">{glyph}</span>
</div>
```
