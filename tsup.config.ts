import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: [
    "src/index.tsx",
    "src/buildMap.ts",
    "src/bext.ts",
    "src/run.ts",
  ],
  format: ["esm"],
  target: "es2022",
  dts: true,
  clean: true,
  skipNodeModulesBundle: true,
  sourcemap: true,
  outDir: "dist",
  splitting: false,
});
