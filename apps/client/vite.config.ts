import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), pages()],
  resolve: {
    alias: {
      src: path.join(__dirname, 'src'),
    },
  },
})
