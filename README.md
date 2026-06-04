# Workout Builder — install on your phone & update from GitHub

This folder turns the `WorkoutProgramBuilder.jsx` app into a real **installable web app (PWA)**:

- Add it to your phone's home screen — it opens full-screen with its own icon, no browser bars.
- It works **offline** and stores all your data **on your device** (via `localStorage`).
- You **update it by pushing to GitHub** — the next time you open the app it quietly updates itself.

You don't need to be a developer to follow this. Total time: ~15 minutes the first time.

---

## What's in here

```
pwa/
├─ index.html                      # page shell
├─ package.json                    # dependencies + build scripts
├─ vite.config.js                  # build + PWA/offline config  ← set your repo name here
├─ src/
│  ├─ main.jsx                     # boots the app + localStorage persistence shim
│  ├─ styles.css                   # full-screen mobile styling
│  └─ WorkoutProgramBuilder.jsx    # your app (a current copy is already included)
├─ public/
│  ├─ favicon.ico
│  ├─ apple-touch-icon.png
│  └─ icons/ (192, 512, maskable, svg)   # app icons — replace with your own if you like
└─ .github/workflows/deploy.yml    # auto-build & publish on every push
```

---

## Step 1 — Your app file is already here

A current copy of `WorkoutProgramBuilder.jsx` is already in **`src/`**, so the kit is ready to build as-is. **When you change the app later**, replace `src/WorkoutProgramBuilder.jsx` with your new version and push (see "Updating the app later").

The file ends with `export default function App(...)`, which is what `main.jsx` imports — no edits needed. (If a future version of yours ends with just `function App()` instead, add `export default App;` at the very bottom.)

> The app reads and writes through `window.storage`. `src/main.jsx` already installs a small shim that points `window.storage` at the browser's `localStorage`, so your programs, history, body metrics and settings persist on the device and survive reloads. You don't have to change anything in the app file.

---

## Step 2 — Try it on your computer first (optional but reassuring)

Install [Node.js](https://nodejs.org) (LTS), then in this folder:

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173). You should see the app. `Ctrl+C` to stop.

---

## Step 3 — Put it on GitHub

1. Create a new repository on GitHub, e.g. **`workout-builder`** (public is fine and required for free Pages).
2. Open **`vite.config.js`** and set `REPO` to that exact name:
   ```js
   const REPO = "workout-builder";
   ```
   (If you later use a custom domain or a `you.github.io` user-site repo, set `REPO = ""`.)
3. Upload this folder's contents to the repo. Either drag-and-drop the files in GitHub's "Add file → Upload files" (make sure `.github/workflows/deploy.yml` comes along), or with git:
   ```bash
   git init
   git add .
   git commit -m "Workout Builder PWA"
   git branch -M main
   git remote add origin https://github.com/<your-username>/workout-builder.git
   git push -u origin main
   ```

---

## Step 4 — Turn on GitHub Pages

In your repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

That's it. The included workflow (`.github/workflows/deploy.yml`) builds the app and publishes it every time you push. Watch progress under the **Actions** tab; the first run takes a minute or two.

When it finishes, your app is live at:

```
https://<your-username>.github.io/workout-builder/
```

---

## Step 5 — Install it on your phone

Open that URL on your phone. The app now shows its own **install prompt**:

- **Android (Chrome/Edge):** a banner slides down with an **Install** button — one tap fires the native install dialog. (You can also use the browser menu ⋮ → **Install app**.)
- **iPhone/iPad (Safari):** Safari can't trigger install automatically, so the banner shows the steps — tap the **Share** button → **Add to Home Screen** → Add.

The prompt hides itself once the app is installed and won't reappear for two weeks if you dismiss it. You'll get an icon on your home screen that launches the app full-screen, like a native app, and it keeps working with no signal.

> The install banner lives only in this self-hosted build (`src/InstallPrompt.jsx`), so it never shows up inside the editor preview.

---

## Updating the app later

Whenever you change the app — paste a new `WorkoutProgramBuilder.jsx`, tweak anything — just push the change (or upload the file again on GitHub). The Action rebuilds and republishes automatically.

The app is configured with `registerType: "autoUpdate"`, so installed copies pick up the new version **in the background** and switch to it the next time they're opened (occasionally it takes one extra reopen). Your saved data is untouched by updates.

> Want an explicit "tap to update" prompt instead of silent updates? Change `registerType: "autoUpdate"` to `"prompt"` in `vite.config.js` and add the small `registerSW` prompt snippet from the [vite-plugin-pwa docs](https://vite-pwa-org.netlify.app/). Silent auto-update is simplest and is the default here.

---

## Your data

- Everything lives in your browser's `localStorage` on each device, under the key `wpb:v1`. It is **not** uploaded anywhere.
- Because it's per-device, installs on your phone and laptop are separate. Use the app's **Settings → Backup & restore → Export** to move data between devices, and the CSV exports for Health/Fit or spreadsheets.
- Clearing the site's data in your browser, or deleting the installed app, clears that device's log — export first if you care about it.

---

## Troubleshooting

- **Blank page after deploy.** The `REPO` name in `vite.config.js` must match your repository name exactly (it controls the sub-path). Fix it, push again.
- **Old version keeps showing.** Fully close the installed app and reopen, or pull-to-refresh in the browser tab. Auto-update can need one extra launch.
- **"Add to Home Screen" missing on iPhone.** It only appears in **Safari**, not Chrome/Firefox on iOS.
- **Action failed on `npm ci`.** Make sure `package.json` was uploaded and you didn't also commit `node_modules` (it's in `.gitignore`).
- **Want a different icon?** Replace the files in `public/icons/` (keep the names/sizes) and `public/apple-touch-icon.png`.
