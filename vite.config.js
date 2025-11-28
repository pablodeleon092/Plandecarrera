import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {

            host: 'localhost', // 👈 importante: accesible desde el navegador
            port: 5173,
            protocol: 'ws',
        },
        // Enable CORS for the dev server and allow the server to echo back
        // the incoming Origin. This is necessary when your browser loads the
        // page from a different machine (host) than the VM/container running
        // the Vite dev server.
        cors: {
            origin: true, // echo request origin
            credentials: true,
        },
    },
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
