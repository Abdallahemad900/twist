import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [tailwindcss()],
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname.replace(/^\/(\w:)/, '$1') } },
  build: {
    chunkSizeWarningLimit: 1600,
    rolldownOptions: {
      onwarn(warning, defaultHandler) {
        // This is a client-only Vite app: dependency RSC directives have no runtime meaning.
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        defaultHandler(warning)
      },
    },
  },
})
