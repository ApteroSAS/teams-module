import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import multiEntry from '@rollup/plugin-multi-entry';
import { visualizer } from "rollup-plugin-visualizer";
import json from '@rollup/plugin-json'; // Import the JSON plugin

const config = [
    {
        input: 'src/lib/index.ts',
        output: [
            { file: 'dist/index.cjs', format: 'cjs', sourcemap: true },
            { file: 'dist/index.mjs', format: 'esm', sourcemap: true }
        ],
        plugins: [
            json(),
            multiEntry(),
            resolve({
                browser: true, // Tells the plugin to prefer 'browser' field in package.json for packages
                preferBuiltins: false,
            }),
            typescript({ tsconfig: './tsconfig.json' }),
            commonjs({
                transformMixedEsModules: true,
            }),
            visualizer(),
        ],
        treeshake: true
    }
];

export default config;
