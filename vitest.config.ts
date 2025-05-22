import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
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

    test: {
        globals: true,
        coverage: {
            reporter: ['text', 'html'],
        },
    },
});
