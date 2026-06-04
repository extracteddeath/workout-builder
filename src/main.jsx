import React from "react";
import { createRoot } from "react-dom/client";
import App from "./WorkoutProgramBuilder.jsx";
import "./styles.css";

// ─────────────────────────────────────────────────────────────────────────────
// Persistence shim
// The app saves/loads through an async key/value store at `window.storage`
// (provided automatically in some hosts). In this self-hosted build we don't
// have that, so we back it with localStorage — your data then persists on the
// device, survives reloads, and works offline. The shape matches what the app
// expects: get() -> { value } | null, set(), delete(), list() -> { keys }.
// ─────────────────────────────────────────────────────────────────────────────
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const v = localStorage.getItem(key);
      return v == null ? null : { key, value: v };
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value };
    },
    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true };
    },
    async list(prefix = "") {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!prefix || (k && k.startsWith(prefix))) keys.push(k);
      }
      return { keys };
    },
  };
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
