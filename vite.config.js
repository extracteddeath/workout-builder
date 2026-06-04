import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// ─────────────────────────────────────────────────────────────────────────────
// Relative base ("./") — the bulletproof setup for GitHub Project Pages.
// Everything (assets, manifest, service worker, icons) is referenced relative to
// wherever index.html is served, so the app installs correctly whether it lives
// at https://you.github.io/workout-builder/ or a custom domain at the root —
// with NO repo-name configuration required. This is what makes the "Install app"
// option appear on Android (the service worker + manifest must resolve cleanly).
// ─────────────────────────────────────────────────────────────────────────────
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",          // new deploys install in the background
      includeAssets: ["icons/icon.svg", "favicon.ico", "apple-touch-icon.png"],
      manifest: {
        id: "./",
        name: "Workout Builder",
        short_name: "Workouts",
        description: "Evidence-based program builder & logger with autoregulation.",
        start_url: "./",
        scope: "./",
        display: "standalone",
        display_override: ["standalone", "minimal-ui"],
        orientation: "portrait",
        lang: "en",
        background_color: "#0C0B0E",
        theme_color: "#0C0B0E",
        categories: ["fitness", "health", "sports"],
        prefer_related_applications: false,
        icons: [
          { src: "./icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "./icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "./icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          { src: "./icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        navigateFallback: "index.html",
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
