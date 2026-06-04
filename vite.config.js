import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    open: false,
    host: true,
    allowedHosts: true,
    cors: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  optimizeDeps: {
    exclude: ['@met4citizen/talkinghead/modules/lipsync-en.mjs'],
  },
});
