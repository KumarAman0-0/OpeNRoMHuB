# GovermentOS — Open ROM Hub

A community-maintained custom ROM registry and directory for locked institutional and government-issued devices. Zero database, zero server — static JSON architecture deployed on GitHub Pages or Vercel.

## ✨ Features

- **Device Directory:** Catalogs community-tested custom ROMs, flashing instructions, and status tags (`unlock-verified`, `in-progress`, `requested`).
- **Light & Dark Mode:** Built-in seamless theme switcher with system preference detection and localStorage persistence.
- **Interactive Device Request Form (`/request`):** Requester form with instant validation, one-click feature chips, and pre-formatted GitHub Issue generator.
- **Secret Admin Panel (Easter Egg):**
  - **Click Trigger:** Click 5 times on the **`OPEN ROM HUB`** logo in the header.
  - **Hotkey Trigger:** Press **`Ctrl + Shift`** (or `Ctrl + Shift + A`).
  - Allows listing new custom ROMs on-the-fly, downloading JSON manifests, and opening GitHub PRs.
- **Discussion per Device:** Powered by GitHub Discussions via Giscus.

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build static site:**
   ```bash
   npm run build
   ```
   Generates a static export in `/out` ready for deployment on GitHub Pages, Vercel, or Cloudflare Pages.

## 📂 Project Structure

- `data/devices/*.json`: Device specifications, ROM downloads, flashing steps, and warnings.
- `app/`: Next.js 14 App Router pages (`/`, `/devices`, `/devices/[slug]`, `/request`).
- `components/`: UI components (`ThemeToggle`, `DeviceRequestForm`, `AdminModal`, `AdminWordmark`, `Giscus`).
- `styles/globals.css`: Design tokens and responsive styles.
