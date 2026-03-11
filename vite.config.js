import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return

                    if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) {
                        return 'recharts-vendor'
                    }

                    if (
                        id.includes('react-dom') ||
                        id.includes('react/') ||
                        id.includes('@inertiajs') ||
                        id.includes('scheduler')
                    ) {
                        return 'react-vendor'
                    }

                    return 'vendor'
                }
            }
        }
    }
});
