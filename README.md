# ProducerDashboard

A private, no-account **new tab page for music producers**: every site and tool you use, one click away.
Built for Brave, Chrome and other Chromium browsers (Manifest V3).

<sub>🇮🇹 La nuova scheda pensata per i producer: tutti i siti e gli strumenti che usi, a un click. Nessun account, nessun server.</sub>

## Features

- Categories and cards you fully control: add, rename, reorder (drag & drop), recolor
- Muted background color picker, dark and light themes
- Search with your browser's **default search engine**
- Keyboard shortcuts: `/` search · `E` edit · `1–9` open your first nine cards
- Backup: export / import your setup as a JSON file
- English and Italian, picked automatically from the browser language
- First-run guide, shown once

## Privacy

Nothing leaves your device: no analytics, no accounts, no servers, no remote code.
Your setup is stored locally in the browser (`chrome.storage.local`).
Permissions: `storage` (save your settings) and `search` (run your searches with the default engine).
Full policy: [PRIVACY.md](PRIVACY.md)

## Install from source

1. Download or clone this repository.
2. Open `chrome://extensions` (Brave: `brave://extensions`) and turn on **Developer mode**.
3. Click **Load unpacked** and select this folder.
4. Open a new tab.

## Project layout

| File | Purpose |
|---|---|
| `manifest.json` | Extension manifest (MV3, replaces the new tab page) |
| `index.html`, `style.css`, `script.js` | The page: markup, styles, logic (vanilla, no dependencies) |
| `theme-init.js` | Applies theme and background before the first paint |
| `icons/` | Extension icons |
| `fonts/` | Inter (variable), SIL Open Font License |

## Credits

Developed by [SambitoStudios](https://instagram.com/2somebeats/).
Font: [Inter](https://github.com/rsms/inter) © The Inter Project Authors, SIL OFL 1.1 (`fonts/OFL.txt`).
