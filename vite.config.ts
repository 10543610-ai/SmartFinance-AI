
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 確保在 GitHub Pages 的子目錄路徑下仍能正確讀取資源，避免白色畫面
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 確保輸出的資源路徑正確
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'recharts', 'firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
});
