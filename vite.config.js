import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    loader: 'tsx',
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Server configuration for localhost + external browser access
  server: {
    // Bind to all network interfaces (0.0.0.0) for external browser access
    host: '0.0.0.0',
    // Default development port
    port: 5173,
    // Don't increment port if 5173 is busy - fail fast so you know there's a conflict
    strictPort: false,
    // CRITICAL: Open in Chrome ONLY, NOT in VS Code preview
    open: 'http://localhost:5173',
    // Enable HMR (Hot Module Replacement) for external browsers
    hmr: {
      // Point to localhost for HMR websocket connections
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },
  },
})
