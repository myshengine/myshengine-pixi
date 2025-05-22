import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    base: './',
    plugins: [dts({ rollupTypes: true })],

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@app': fileURLToPath(new URL('./src/app', import.meta.url)),
            '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
            '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
            '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
            '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
        },
    },

    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'GamzixPixi',
            fileName: 'index',
        },
        rollupOptions: {
            external: ['@gamzix/hemi-core', 'pixi.js', 'pixi-spine', '@pixi/particle-emitter', '@pixi/layers'],
        },
    },
});
