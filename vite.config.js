import {defineConfig} from 'vite'
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    plugins: [handlebars()],
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
            '@': '/src',
        }
    }
})
