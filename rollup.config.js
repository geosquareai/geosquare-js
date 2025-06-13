import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    // UMD build for browsers and CDNs
    {
      file: 'dist/geosquare.js',
      format: 'umd',
      name: 'GeosquareGrid',
      sourcemap: true,
      globals: {
        '@turf/turf': 'turf'
      }
    },
    // Minified UMD build
    {
      file: 'dist/geosquare.min.js',
      format: 'umd',
      name: 'GeosquareGrid',
      sourcemap: true,
      plugins: [terser()],
      globals: {
        '@turf/turf': 'turf'
      }
    },
    // ESM build for modern environments
    {
      file: 'dist/geosquare.esm.js',
      format: 'esm',
      sourcemap: true
    }
  ],
  external: ['@turf/turf'],
  plugins: [
    nodeResolve(),
    commonjs({
      transformMixedEsModules: true
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**'
    })
  ],
  onwarn(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY' && 
        warning.message.includes('d3-voronoi')) {
      return;
    }
    warn(warning);
  }
};