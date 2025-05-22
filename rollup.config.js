import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/geosquare-grid.js',
            format: 'umd',
            name: 'GeosquareGrid',
            sourcemap: true,
        },
        {
            file: 'dist/geosquare-grid.min.js',
            format: 'umd',
            name: 'GeosquareGrid',
            sourcemap: true,
            plugins: [terser()],
        },
    ],
    plugins: [
        resolve(),
        commonjs(),
    ],
};