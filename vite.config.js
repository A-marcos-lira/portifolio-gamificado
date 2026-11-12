import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Base configurada para o repositório 'portifolio-gamificado' no GitHub Pages
  base: '/portifolio-gamificado/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});

