import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path'
import tailwindcss from '@tailwindcss/vite'


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

// @ts-expect-error process is a nodejs global
const tauriDevHost = process.env.TAURI_DEV_HOST;
// When unset, desktop dev binds to localhost only. When Tauri sets TAURI_DEV_HOST for mobile,
// we must listen on 0.0.0.0 — using the raw IP string (e.g. "10.8.0.2") as `server.host` binds only
// that interface and breaks adb reverse / emulator routing (blank WebView).
const useTauriMobileDev = Boolean(tauriDevHost);

// https://vite.dev/config/
export default defineConfig(async () => ({
  
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

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  optimizeDeps: {
    include: ['maplibre-gl', 'react-map-gl/maplibre'],
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: useTauriMobileDev ? "0.0.0.0" : false,
    hmr: useTauriMobileDev
      ? {
          protocol: "ws",
          host: tauriDevHost,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
