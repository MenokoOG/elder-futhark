import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  clean: true,
  dts: true,
  sourcemap: true,
  format: ["esm", "cjs"],
  target: "es2022",
  splitting: false,
  treeshake: true,
  external: ["zod"]
});
