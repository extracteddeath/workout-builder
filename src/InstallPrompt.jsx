import React, { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   Install prompt — lives only in the self-hosted PWA build (never in the editor
   preview). Handles both worlds:
     • Android / Chrome / Edge → captures the `beforeinstallprompt` event and shows
       a one-tap "Install" button that fires the real OS install dialog.
     • iOS / iPadOS Safari → never fires that event, so we show the manual
       "Share → Add to Home Screen" instructions with the share glyph.
   It hides itself when the app is already installed (standalone display-mode) and
   stays quiet for a couple of weeks after the user dismisses it.
   ──────────────────────────────────────────────────────────────────────────── */

const DISMISS_KEY = "wpb:install-dismissed";
const DISMISS_DAYS = 14;
const ACCENT = "#C6F24E";
const CARD = "#17161B";
const BORDER = "#2A2930";
const TEXT = "#F4F4F2";
const MUTED = "#A1A1AA";

const standalone = () =>
  (window.matchMedia && (window.matchMedia("(display-mode: standalone)").matches
    || window.matchMedia("(display-mode: window-controls-overlay)").matches
    || window.matchMedia("(display-mode: fullscreen)").matches))
  || window.navigator.standalone === true;

const isIOS = () => {
  const ua = navigator.userAgent || "";
  return /iphone|ipad|ipod/i.test(ua)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); // iPadOS reports as Mac
};
const isSafari = () => {
  const ua = navigator.userAgent || "";
  return /safari/i.test(ua) && !/crios|fxios|edgios|chrome|android/i.test(ua);
};

const recentlyDismissed = () => {
  try {
    const t = parseInt(localStorage.getItem(DISMISS_KEY) || "0", 10);
    return t > 0 && Date.now() - t < DISMISS_DAYS * 86400000;
  } catch { return false; }
};
const remember = () => { try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {} };

function ShareGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "-3px" }}>
      <path d="M12 16V4" /><path d="m8 8 4-4 4 4" /><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" />
    </svg>
  );
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [mode, setMode] = useState(null);   // "android" | "ios"
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (standalone() || recentlyDismissed()) return;

    const onBIP = (e) => { e.preventDefault(); setDeferred(e); setMode("android"); setShow(true); };
    const onInstalled = () => { setShow(false); remember(); setDone(true); setTimeout(() => setDone(false), 3800); };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);

    // iOS Safari can't be prompted programmatically — surface instructions after a
    // short browse so it doesn't slam the user the instant they land.
    let t;
    if (isIOS() && isSafari() && !window.navigator.standalone) {
      t = setTimeout(() => { setMode("ios"); setShow(true); }, 3000);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
      if (t) clearTimeout(t);
    };
  }, []);

  const dismiss = () => { setShow(false); remember(); };
  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    try { await deferred.userChoice; } catch {}
    setDeferred(null);
    setShow(false);
  };

  if (done) {
    return (
      <div style={wrap}>
        <div style={{ ...banner, justifyContent: "center", gap: 8 }}>
          <span style={{ color: ACCENT, fontWeight: 800 }}>✓</span>
          <span style={{ color: TEXT, fontWeight: 600, fontSize: 14 }}>Installed — find it on your home screen</span>
        </div>
      </div>
    );
  }
  if (!show) return null;

  return (
    <div style={wrap}>
      <div style={banner}>
        <div style={iconBox}>
          {/* dumbbell mark */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0C0B0E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6.5 6.5 11 11" /><path d="m21 21-1-1" /><path d="m3 3 1 1" /><path d="m18 22 4-4" /><path d="m2 6 4-4" /><path d="m3 10 7-7" /><path d="m14 21 7-7" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: TEXT, fontWeight: 800, fontSize: 14.5, lineHeight: 1.2 }}>Install Workout Builder</div>
          {mode === "ios" ? (
            <div style={{ color: MUTED, fontSize: 12.5, marginTop: 3, lineHeight: 1.35 }}>
              Tap <ShareGlyph /> then <b style={{ color: TEXT }}>Add to Home Screen</b> for full-screen, offline access.
            </div>
          ) : (
            <div style={{ color: MUTED, fontSize: 12.5, marginTop: 3, lineHeight: 1.35 }}>
              Add it to your home screen — full-screen and works offline.
            </div>
          )}
        </div>
        {mode === "android" && (
          <button onClick={install} style={cta}>Install</button>
        )}
        <button onClick={dismiss} aria-label="Dismiss" style={closeBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MUTED} strokeWidth="2.4" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}

const wrap = {
  position: "fixed", left: 0, right: 0, top: 0, zIndex: 99999,
  display: "flex", justifyContent: "center",
  padding: "calc(env(safe-area-inset-top, 0px) + 8px) 10px 0",
  pointerEvents: "none",
};
const banner = {
  pointerEvents: "auto",
  width: "100%", maxWidth: 460,
  display: "flex", alignItems: "center", gap: 12,
  background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
  padding: "11px 12px",
  boxShadow: "0 10px 30px rgba(0,0,0,.45)",
  animation: "wpbInstallIn .45s cubic-bezier(.2,.7,.3,1)",
};
const iconBox = {
  flexShrink: 0, width: 38, height: 38, borderRadius: 11,
  background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center",
};
const cta = {
  flexShrink: 0, background: ACCENT, color: "#0C0B0E", border: "none",
  borderRadius: 11, padding: "9px 16px", fontWeight: 800, fontSize: 14, cursor: "pointer",
};
const closeBtn = {
  flexShrink: 0, background: "none", border: "none", cursor: "pointer",
  padding: 6, display: "flex", alignItems: "center", justifyContent: "center",
};

// keyframes (injected once)
if (typeof document !== "undefined" && !document.getElementById("wpb-install-kf")) {
  const s = document.createElement("style");
  s.id = "wpb-install-kf";
  s.textContent = "@keyframes wpbInstallIn{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}";
  document.head.appendChild(s);
}
