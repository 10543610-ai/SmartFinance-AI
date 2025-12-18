import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 使用相對路徑基底，這是解決 GitHub Pages 白色畫面的最重要設定
  base: './', 
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // 確保資源檔案夾名稱固定
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // 增加雜湊碼以避免瀏覽器快取舊版的錯誤檔案
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
        manualChunks: {
          vendor: ['react', 'react-dom', 'recharts', 'firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  }
});