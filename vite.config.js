import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: set REPO to your GitHub repository name.
// GitHub Project Pages are served from https://<you>.github.io/<REPO>/, so the
// site needs to know it lives in that sub-folder. If you use a custom domain or
// a <you>.github.io user-site repo instead, set REPO = "" (served from root).
// ─────────────────────────────────────────────────────────────────────────────
const REPO = "workout-builder";
const base = REPO ? `/${REPO}/` : "/";

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",          // new deploys install in the background
      includeAssets: ["icons/icon.svg", "favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Workout Builder",
        short_name: "Workouts",
        description: "Evidence-based program builder & logger with autoregulation.",
        start_url: base,
        scope: base,
        display: "standalone",
        display_override: ["standalone", "minimal-ui"],
        orientation: "portrait",
        background_color: "#0C0B0E",
        theme_color: "#0C0B0E",
        categories: ["fitness", "health", "sports"],
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          { src: "icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: base,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
