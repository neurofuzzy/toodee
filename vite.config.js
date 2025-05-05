// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // ...other configurations
  build: {
    sourcemap: false,
  },
  define: {
    global: {},
  },
  optimizeDeps: {
    esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
            global: 'globalThis',
        },
    },
},
});