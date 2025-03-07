import { defineConfig } from 'vite';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    server: {
        port: 3000,
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern',
                additionalData: `@use '@/shared/constants/constants' as *;`,
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@pages': path.resolve(__dirname, 'src/pages'),
            '@assets': path.resolve(__dirname, 'src/assets'),
        }
    }
});
