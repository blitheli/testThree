import { defineConfig } from 'vite'

export default defineConfig({
    root: 'src/',
    base: './',
    publicDir: '../static/',
    assetsInclude: ['**/*.glsl'],
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