import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.js'], // Ensure this points to your entry file
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  outDir: 'dist',
  // Add these options for JavaScript source files
  target: 'es2018',
  noExternal: ['@turf/turf'],
});
