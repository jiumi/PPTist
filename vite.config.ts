import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    vue(),
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://server.pptist.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/mpc': {
        target: 'http://127.0.0.1:6543',
        changeOrigin: true,
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import '@/assets/styles/variable.scss';
          @import '@/assets/styles/mixin.scss';
        `
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: resolve(__dirname, '../../webapp/public/pptx'),
  }
})
