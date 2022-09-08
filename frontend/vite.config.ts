import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    build: {
        outDir: 'dist',
    },
    server: {
        /* Required for FFmpeg but disallows external scripts */
        headers: {
            'Cross-Origin-Embedder-Policy': 'require-corp',
            'Cross-Origin-Opener-Policy': 'same-origin',
        },
        host: '0.0.0.0',
        port: 3000,
        open: false,
        cors: true,
    },
    envDir: '..',
});
