import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pages from 'vite-plugin-pages'
import dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), pages()],
  resolve: {
    alias: {
      src: path.join(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '^/api/.*': {
        target: `${process.env.CORE_API}`,
      },
    },
  },
})
