import { defineConfig } from 'vite';
import react from '@vitejs/plugin-re

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
});