import { defineConfig } from 'vite'

export default defineConfig({
    root: 'src/',
    base: './',
    publicDir: '../static/',
    server: {
        host: true,
        port: 3000,
        open: true,
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true,
    },
})