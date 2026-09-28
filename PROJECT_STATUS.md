# ProducerDashboard – PROJECT STATUS

*Last updated: 2026-09-28 (manifest bumped to 1.1.0, zip rebuilt for the Store update) · Extension version in manifest: 1.1.0 · Repo: github.com/sambitomanagment-lab/producer-dashboard (public)*

Read this first when reopening the project. Newest entry on top of "Changelog".

**State of the working copy right now:** category layout, the 2026-09-24 polish pass (Ambient LED, search fix, animations) and the cursor-light removal are done and tested but **NOT committed / NOT pushed** (`README.md`, `index.html`, `script.js`, `style.css`, `manifest.json`, `PROJECT_STATUS.md`). `manifest.json` is now **1.1.0** (bumped 2026-09-28) and `Prova\producer-dashboard-1.1.0.zip` was rebuilt from this working copy for the Store update — the git repo itself has not moved.

---

## 1. What this is

A Manifest V3 browser extension (Brave / Chrome) that **replaces the new tab page** with a private launcher dashboard for music producers.
Vanilla HTML/CSS/JS, **no build step, no dependencies, no backend, no accounts**. Everything a user sets up is stored locally.
Developed by SambitoStudios (footer credit links to instagram.com/2somebeats).

## 2. Where things live (IMPORTANT – folders were reorganized on 2026-09-23)

| Path (under `C:\Users\matte\Desktop\Sito\Everyday Homepage\`) | What it is |
|---|---|
| `Prova\brave-newtab\` | **Working copy + git repo (source of truth).** Edit here. |
| `producer-dashboard-main\` | A plain download of the GitHub repo (no `.git`). **Not updated automatically** – it goes stale after every change. If it is the folder loaded in Brave (`brave://extensions`), reload from `Prova\brave-newtab` or re-download. |
| `Prova\store-assets\`, `Prova\store-listing.md`, `Prova\producer-dashboard-1.0.0.zip` | Chrome Web Store material (screenshots 1280×800, promo tiles, copy-paste texts, upload package). The zip is **1.0.0 and does NOT contain anything added after it was built** (see §6). |
| `Prova\test-harness\` | The automated tests used for the 2026-09-24 polish pass (headless Edge driven over DevTools Protocol, Python standard library only). Not part of the extension. How to run: its `README.md` and §9 below. |

## 3. File map (in the repo)

| File | Role |
|---|---|
| `manifest.json` | MV3. Permissions: `storage`, `search`. `chrome_url_overrides.newtab`. Icons 16/32/48/128. `minimum_chrome_version` 111 (uses `color-mix()`). |
| `index.html` | Markup only: icon sprite, toolbar (theme + edit; other buttons are injected by JS), header (search = `#searchTrigger` button + `#searchInput`), `#sections`, footer. No inline scripts/handlers (CSP-safe). |
| `style.css` | All styling. Design tokens on `:root` (+ `:root[data-theme="light"]`). One shared glass recipe (`backdrop-filter: blur(20px)`). Sections in order: tokens · **Ambient LED** · search · categories · pickers/popovers (+ LED panel) · cards · toolbar/edit mode (+ entry animations) · footer · first-run guide (+ animations) · responsive/reduced-motion. |
| `script.js` | All logic (config + i18n, state/storage, rendering, edit mode, pickers, search, theme, background, layout, keyboard, **Ambient LED**, init). |
| `theme-init.js` | Tiny synchronous script in `<head>`: applies saved theme + custom background **before first paint** (chrome.storage is async). |
| `icons/`, `fonts/` | Extension icons; Inter variable font (SIL OFL, licence in `fonts/OFL.txt`). |
| `PRIVACY.md`, `README.md` | Public docs. Privacy policy URL used for the Store: `…/blob/main/PRIVACY.md`. |
| `PROJECT_STATUS.md` | This file. Not shipped in the Store zip. |

## 4. Architecture (the parts you need to know)

**State** (`state` in `script.js`, persisted as ONE object):
```
{ version: 1, name: "", onboarded: false, bg: null | "#rrggbb", columns: 1 | 3,
  ambient: { on: bool, color: null | "#rrggbb", intensity: 0-100, spread: 0-100 },
  categories: [ { key, label, color: null|"#rrggbb", links: [ {name,url,desc} ] } ] }
```
- `sanitizeState()` / `sanitizeAmbient()` / `sanitizeCategory()` / `sanitizeLink()` normalize everything on load, on import and on cross-tab updates (only http(s) links, only hex colors, `columns` must be exactly 3 else 1, `ambient` fields clamped / defaulted: a state saved before the LED existed simply gets `{on:true, color:null, intensity:48, spread:50}`). Corrupt data never crashes the page. `version` stays 1 (the change is additive).
- Storage adapter `store`: `chrome.storage.local` in the extension, `localStorage` when the page is opened as a normal website (dev server). Keys: `producerdashboard-state`; theme and the pre-computed background are also cached in `localStorage` (`producerdashboard-theme`, `producerdashboard-bg`) only so `theme-init.js` can read them synchronously.
- `chrome.storage.onChanged` keeps several open new tabs in sync (own writes are ignored by comparing JSON).

**Rendering:** `render()` rebuilds `#sections` from `state` every time (single `.cat-grid` containing one `.cat` per category, then the "add category" row). Every mutation = change `state` → `saveState()` → `render()`.

**Edit mode:** `body.edit-mode`. Toolbar (left→right): **Category layout** · Background color · **Ambient LED** · Theme · Edit. The first three are popovers anchored to the toolbar (siblings of their button, NOT children: a `backdrop-filter` element becomes the containing block of its descendants). Footer buttons (guide / export / import / reset) appear only in edit mode. On entering edit mode `body.edit-entering` (~360 ms) fades the new controls in; it is temporary on purpose, because `render()` rebuilds the cards and a permanent animation would replay on every add/remove/reorder.

**Popovers (`.color-pop`):** `.open` = opacity + 4px translate + `scale(.98)`, 160 ms, animated both ways. Closed = `display:none` (no box: not in the tab order, no phantom scroll width next to the window edge). The display flip is animated with `transition-behavior: allow-discrete` + `@starting-style` (Chrome 117+; older versions just show/hide instantly, so `minimum_chrome_version` stays 111). Do not go back to `visibility:hidden`: a hidden box still counts as scrollable overflow (it caused horizontal overflow in edit mode at 768/1024 px with 3 columns). Esc closes them; only one is open at a time.

**Search (two states):** idle = `#searchTrigger`, a button that looks like the field; it takes no focus and no keystrokes, so shortcuts work from the moment the tab opens. Active (`#searchForm.is-active`) = the real `#searchInput`, opened by clicking the pill or pressing `/`. It closes (`deactivateSearch()`: input hidden, cleared, blurred) on Esc, on a finished search, on a click outside (`pointerdown`) and when focus tabs away (`focusout`, ignored when the whole window loses focus so alt-tab keeps what you typed). While idle the input is `display:none`, so it cannot receive a character by accident. On load the code no longer calls `searchInput.focus()`; it focuses `<body>` (best effort, see open items).

**Keyboard (`keydown` on `document`):** ignores anything with Ctrl/Meta/Alt (browser shortcuts), IME composition, and typing targets (`isTypingTarget`: text inputs / textarea / select / contenteditable; sliders, color inputs and buttons do NOT count, so `E` still works while a slider is focused). `1–9` only outside edit mode (unchanged), `e`/`E` toggles edit (not on key repeat), `/` opens the search, Esc closes search + popovers. The guide swallows everything except Esc.

**Ambient LED** (`.ambient-led-layer` > `.ambient-led`, created in JS and prepended to `<body>`; z-index 0, behind `.wrap` z-index 1, `pointer-events:none`):
- JS (`initAmbientLed`) only tracks the pointer's x (as a fraction of the window width), eases toward it (time-based, τ = 420 ms, frame-rate independent, instant under `prefers-reduced-motion`) and writes ONE custom property per frame, `--ambient-led-x`. The loop stops when it arrives; a resting pointer costs nothing; when the LED is off the loop never runs. The centre is kept between 8% and 92% of the width so at the edges the light isn't half cut off.
- CSS draws everything from custom properties on `.ambient-led`: `--ambient-led-x` (px), `--ambient-led-color`, `--ambient-led-opacity` (intensity), `--ambient-led-spread` (0..1 → width 50–120vw, height 28–58vh). The element is exactly the light's bounding box (a wide ellipse centred on the bottom edge, 9-stop eased gradient) and is moved with `transform: translate3d`, so following the pointer never repaints the gradient. **There is no `filter: blur()`**: a blur on a window-sized element is expensive and the eased gradient has no visible edge or banding (measured: 1/255 steps every 3–6px). The `--ambient-led-blur` idea from the brief is therefore expressed by the gradient's falloff curve, not a variable.
- Presence: the layer is invisible until state loads, fades in to a quiet 0.32 (`.is-ready`), and rises to 1 the first time the pointer moves (`.is-awake`); it then stays. Touch screens (no hover) are awake at once. `.is-off` fades out and sets `visibility:hidden` (not painted).
- Colour: like the background, only the **hue** of the picked colour is used (`deriveLedColor`): saturation ≤ 42% (52% light theme), lightness solved so every hue has the **same relative luminance** as the default green (`LED_LUMINANCE`). That makes a neon red a dark maroon, a yellow an ochre, a cyan no brighter than a blue, greys stay grey, and it lets one intensity ceiling be safe for every colour. Re-derived on theme change (`applyTheme` → `applyAmbient`).
- Intensity slider 0–100 → opacity `i/100 × LED_MAX_OPACITY` (**0.38**, the ceiling at which the 13px card description text still has ≥ 4.5:1 contrast, measured at full spread in the dark theme, worst case over 7 hues). Light theme multiplies by `--ambient-led-k` 1.5.
- Edit-mode UI: a fourth toolbar swatch (dot = picked colour, dimmed + dashed ring when off). Its popover reuses `buildColorPicker` (muted presets, custom colour, default) and adds `head` = title + on/off switch and `foot` = Intensity + Spread sliders (`keepOpen`: the panel stays open after choosing a preset). Sliders apply live on `input` and are stored on `change`. Touching any control while the LED is off switches it back on.

**Animation rules (learned the hard way, keep them):** never animate `opacity`/`filter` on an *ancestor* of a frosted (`backdrop-filter`) element: the glass then blurs only that ancestor's own (empty) content and pops to the real blur when the animation ends. Fade the glass element itself, and fade scrims through their background alpha (`.welcome` scrim vs `.welcome-card`). No scale on glass surfaces (re-rasterises the blur, shimmers). Entry animations are `@keyframes` with `both` fill and a `from` only, so the first frame is already the start state.

**Shared color picker:** `buildColorPicker()` is used by category colors and by the background. Background: only the *hue* of the picked color is used; saturation/lightness come from the UI's muted range (`deriveBackground()`), so any pick stays dark and desaturated.

**Cursor light: REMOVED** (2026-09-24, owner's request: "togliamo l'effetto sul puntatore"). There is no longer anything drawn around the mouse pointer. The only pointer-reactive effect left is the Ambient LED at the bottom edge (it follows only the pointer's x). If it ever comes back: it was 4 blur-free radial gradients in a `position:fixed` layer behind the content (z-index 0, `.wrap` 1), trailing the pointer with a per-segment ease; see git history / `Prova\producer-dashboard-1.0.0.zip`, which still has it.

**i18n:** `I18N` object in `script.js` (en / it), language from `navigator.language`; static text via `data-i18n*` attributes.

## 5. Features (current)

Categories & cards (add / rename / delete / drag-reorder / per-category color) · **category layout: "Colonne" (3 columns) or "Orizzontale" (1 column, original)** · producer name in header · background color (muted, hue-only) · **Ambient LED (colour, intensity, spread, on/off)** · dark/light theme · search via the browser's default engine (`chrome.search`), opened by click or `/` · shortcuts `/` search, `E` edit, `1–9` open first nine cards · first-run guide · export/import JSON backup (includes layout + LED) · EN/IT. (No effect around the mouse pointer: removed 2026-09-24.)

## 6. Changelog

### 2026-09-24 (later) – Cursor light removed

On the owner's request ("togliamo l'effetto sul puntatore") the light that followed the mouse pointer is gone: the `initCursorOrb` block in `script.js`, `.cursor-orb-layer` / `.cursor-orb` and the `--orb-k` token in `style.css`. Nothing else changed: the Ambient LED (bottom edge, follows only the pointer's x) stays. If the owner meant the LED's reaction to the mouse as well, that is a one-line change (drop the `mousemove` listener in `initAmbientLed`; the light would then stay centred).
Also touched: `store-listing.md` (removed "a soft light that follows your cursor"), the test harness (layering/regression/light checks now assert the orb is gone). Re-run after the change, all green: search 44, LED 59, persistence 32, animations 76, real extension 13, regression 46, light/contrast 4, perf 4, monotone 1 (279). Note the 1.0.0 Store zip still contains the cursor light.

### 2026-09-24 – Visual + interaction polish: Ambient LED, search fix, animation pass

No redesign, no new library, no new permission. Architecture notes for everything below are in §4 (Ambient LED, Search, Keyboard, Popovers, Animation rules).

**Added**
- **Ambient LED**: a soft light rising from the bottom edge, drifting toward the pointer's horizontal position with inertia. It paints behind the content only. Barely visible when the page opens, comes up on the first pointer movement, then stays put.
- **Edit Mode**: a new toolbar swatch "Ambient LED" between Background color and Theme (order: layout · background · LED · theme · edit). Popover with: on/off switch, the same muted palette as the other pickers (6 presets, custom, default), **Intensity** and **Spread** sliders. Settings: `on`, `color` (null = built-in green), `intensity` 0–100 (default **48** = opacity 0.18), `spread` 0–100 (default 50). Stored in the same state object / storage as everything else, included in export/import, reset by "Reset to defaults".
- Esc now also closes open popovers. `E` also works with Caps Lock.

**Bugs fixed (all reproduced first, then fixed at the root)**
1. **Search swallowed shortcuts.** Cause: `script.js` called `searchInput.focus()` on load (and again when the guide closed), so `activeElement` was the input and "5" was typed into it. Fix: two-state search (idle = a button that looks like the field; the input is `display:none` until opened by a click or `/`). Closes on Esc / finished search / click outside / Tab away (not on alt-tab). No auto-focus on load any more.
2. **Flash on theme change (light → dark).** Cause: cards animate `background-color` for 250 ms on hover; the same transition ran on a theme switch, so the text turned white instantly while the card faded down from a near-white fill (measured: card alpha 0.55 → 0.07 over ~250 ms with white text). Fix: `html.theme-switching` disables transitions for the switch (measured after: every frame already shows the final colours).
3. **`Ctrl+1…9` / `Ctrl+E` also fired the dashboard's shortcuts** (they are browser shortcuts). Modifier keys and IME composition are now ignored. Focus in a slider/colour input no longer blocks `E`. Holding `E` no longer flickers edit mode.
4. **`.is-off` lost a CSS specificity fight** during development (LED stayed at opacity 1 and vanished abruptly): caught by the tests before release, fixed.
5. **Phantom scroll width in edit mode** at 768/1024 px with 3 columns: caused by my first popover approach (`visibility:hidden` keeps a box); popovers are now `display:none` when closed.
6. **LED brightness varied by hue** (cyan/yellow far brighter than blue/red, description text fell to 3.0:1 at max intensity): lightness is now solved per hue for equal relative luminance and the intensity ceiling capped (`LED_MAX_OPACITY` 0.38). Worst case now 4.52:1 (dark) / 4.78:1 (light) at 100/100 full spread.
7. **LED nudged away from its target on the first frame** (found by reading, then proven: 5.9 px backwards on a pointer jump). Chrome runs `requestAnimationFrame` in the same frame as the input event that scheduled it, so the frame timestamp can be earlier than the `performance.now()` stored in the handler and `dt` went negative. `dt` is now clamped at 0 (`t_monotone.py` fails on the old line, passes on the new: 0.000 px).

**Animations (audit result)**
- Before: popovers, add-card / add-category forms, edit-mode controls, first-run guide all appeared instantly (`display:none → flex`); only hovers were animated.
- Now (all fade + ≤ 8px translate, ≤ 280 ms, `--ease` curve, no bounce; none on glass ancestors): popovers open **and close** (160 ms, + `scale(.98)`), forms fade-up (200 ms), edit-mode controls fade in once on entering (200–220 ms), guide: scrim fades via its background alpha and card via its own opacity, open 240–280 ms / close 180 ms (removed after 200 ms). Not animated on purpose: leaving edit mode, layout switch, list re-render (each would need delayed removal / FLIP for no real gain).
- All of it is off under `prefers-reduced-motion` (`transition:none; animation:none`; the LED then follows the pointer without inertia).
- No flash/artifact found beyond items 2 and 5 above. Checked: opacity/transform/backdrop-filter/box-shadow/gradients/overflow/z-index/compositing paths, first frame of every animation (sampled per frame: all start at the "from" state), glass blur kept during the guide and form animations.

**Files modified:** `script.js`, `style.css`, `index.html` (search markup), `PROJECT_STATUS.md`, `README.md`. New outside the repo: `Prova\test-harness\` (tests), `Prova\store-listing.md` updated. `manifest.json`, `theme-init.js`, `PRIVACY.md` unchanged (nothing new is collected or transmitted; permissions still `storage` + `search`).

**Key decisions**
- LED as one transformed element + eased gradient (no `filter: blur`, no big element repainting per frame). `--ambient-led-blur` from the brief is intentionally not a variable (see §4).
- LED colour derives from the hue only, at equal luminance across hues → "muted" is guaranteed, not hoped for.
- Popover `keepOpen` for the LED panel (it holds sliders), unlike the plain palettes that close after a pick.
- `@starting-style` / `allow-discrete` for popovers: needs Chrome 117 for the animation only; older versions degrade to instant show/hide, so `minimum_chrome_version` stays 111.
- Default intensity moved 30 → 48 when the ceiling was lowered from 0.6 to 0.38, so the default looks exactly as first calibrated (opacity 0.18).

**Tested** (headless Edge over DevTools Protocol, scripts in `Prova\test-harness\`; 279 automated checks, all passing on the final code, plus visual review of screenshots):
- Search/keyboard 44: fresh open, shortcuts 1/2/5/9/0, E (also capital), edit-mode digit rule, Ctrl+5 / Ctrl+E ignored, `/`, typing digits/e into search, Esc, click outside, Tab away, alt-tab keeps text, empty Enter, completed search (`chrome.search.query`), Enter on the focused button, popover Esc, slider focus + E, first-run guide swallowing keys, console clean.
- LED 59 (+1 monotonic-motion check): opens near-invisible, no loop while idle, left→centre→right, inertia (no jump at 60 ms, glides at 300 ms, arrives), 240 rapid events (≤ 1 write per frame, never leaves 8–92%, no big steps), still pointer (0 writes), pointer leaves window, edges, OFF (fades, hidden, zero work), intensity 0/48/100, spread 0/50/100 (exact sizes), 6 presets + 9 neon/edge colours + default, dragging vs release persistence, layering + pointer-events, console clean.
- Persistence 32: change → reload → browser restart (same profile) with storage mock; 6 corrupt/old shapes; export/import (also an old backup without `ambient`)/reset; cross-tab sync; own writes ignored.
- Animations 76 (+ same with reduced-motion): per-frame sampling of theme switch, 4 popover kinds open/close, edit-mode entry (and no replay on re-render), add-card form, guide open/close, glass blur kept.
- **Real extension 13**: the unpacked extension loaded in Edge (`--load-extension`, real `chrome.storage.local`, real CSP): settings written, browser restart keeps them, own write ignored, `chrome://newtab` override, `/` + Esc, console clean.
- Regression 46: no horizontal overflow and all cards 104px high at 390/768/1024/1440/1920 × both layouts × edit on/off; layout switch + persistence; add/rename/remove category and card; card edit; drag & drop of categories and cards; category and background colour; theme; cursor light really gone (no orb layer in the DOM); brand name.
- Performance 4: 96 glass cards, pointer moving: LED adds ≈ 0.3 points of script CPU, frame rate unchanged (~240 fps headless), idle cost ≈ 0 (loop stops).
- Pixels: LED alone at default is subtle (bottom-edge pixel ≈ rgb(9,19,13) on black); contrast sweep 7 hues × 3 intensities × 2 themes ≥ 4.5:1.
- Layout 390px: LED panel and toolbar (5 buttons) fit; no horizontal scroll.

**Still to check / known**
- **Real Brave** (not Edge) with the extension loaded: everything above ran in Edge headless. Same Chromium extension APIs, but nothing was run in Brave itself. Also **who owns the keyboard when a new tab opens**: the code now focuses `<body>` (no text field). If the browser keeps focus in the address bar on new tabs, digits go to the address bar until the page is clicked; that is browser behaviour, not something the page can override. Worth a 10-second check in Brave (`brave://extensions` → reload → Ctrl+T → press 5).
- The Ambient LED was tuned on a 1440×900 headless screenshot; look at it on the real monitor (bottom-of-screen brightness depends on the display) and adjust the default `intensity` (48) or `LED_MAX_OPACITY` if wanted.
- `producer-dashboard-main` (stale copy) and the Store zip do not include any of this; see §7.

### 2026-09-24 – Category layout (new feature)

**What was added:** from Edit mode (new first button in the toolbar, grid icon) the user picks how categories are laid out. Popover "Layout categorie / Visualizzazione" with **two options, each with a small icon of its grid**:
- **Colonne** → 3 category columns side by side (`columns: 3`)
- **Orizzontale** → categories stacked, cards in horizontal rows = the original layout (`columns: 1`, the default)

Saved with the rest of the settings (persists across reload / tab close / browser restart; included in export/import; "Reset to defaults" returns to Orizzontale).

**History of this feature (same day):** first built with chips 1–6 + Auto and a live preview; on the owner's request **reduced to only these two layouts** ("2 4 5 6 and Auto are useless for now"). The chips/preview/auto-resize code was removed. The engine underneath is still generic (`--cols`, `applyLayout()`, `effectiveColumns()`), so adding another option later = one entry in `buildLayoutPicker()` + allowing the value in `sanitizeState()`.

**Files modified:** `script.js`, `style.css`, `index.html` (new `i-layout` icon symbol), `PROJECT_STATUS.md` (new), `README.md` (feature line).

**How it works / key decisions**
- Categories are now cells of one CSS grid: `.cat-grid { grid-template-columns: repeat(auto-fill, minmax(max(200px, (100% − gaps)/N − .5px), 1fr)) }`. All columns are equal, so **every card in every category has the same size**; card height stays 104px, radius/padding/type untouched.
- **Effective columns = min(chosen, number of categories)** (`effectiveColumns()`): 2 categories on "Colonne" spread over 2 wide columns instead of leaving one empty; adding/removing a category updates the layout immediately (`applyLayout()` runs at the end of every `render()`).
- **Responsive:** the 200px minimum column width makes the CSS drop columns by itself when the window is narrow (3 → 2 → 1 on phones).
- **Page width:** `.wrap` max-width is `var(--wrap-max)`: 900px for 1 column (identical to before), `N×300 + gaps` for more, so wide screens are actually used.
- **Default = Orizzontale = the previous layout.** Settings saved before this feature have no `columns` field and load as 1 (verified with an "old user" state: same 900px page, 272px cards, colors kept). Any other stored value (0, 2, 4, 5, 6, 99, text) also loads as 1.
- Reading order = DOM order = data order, so **shortcuts 1–9, drag & drop and numbering** keep working unchanged across columns.
- Narrow columns: category names get an ellipsis; the color popover opens leftwards when it would leave the window (`.is-flipped`).
- Removed `.cat{margin-bottom}`; spacing is now `row-gap`/`margin-bottom` on `.cat-grid` (same 52px as before).

**Bugs fixed along the way:** none in existing behaviour. (Color popover overflowing the window in right-hand columns was prevented, not a pre-existing bug.)

**Tested (test browser, emulated viewports):**
- First version (chips 1–6 + Auto): 35 combinations × 6 viewports (1920 / 1440 / 1280 / 1024 / 768 / 390) = 210 scenarios, all passed.
- Final version (2 options): 1, 2, 3, 5, 10, 20 categories × {1, 3} columns = 12 scenarios at 1920, 1440, 1024, 768 and two real pane widths (935, 974): no horizontal overflow, no clipped cards, every card same width and height 104px, category rows aligned, effective column count as expected, shortcut order intact. (390 was not re-run in the final round because the pane resized; the layout engine/CSS it depends on is unchanged since the 390 pass above.)
- Also: persistence through a reload with a `chrome.storage` mock, cross-tab sync, legacy values (5 → 1), export/import/reset, drag & drop of categories and cards, add/rename/delete category and card, background color, color popover in the last column, one popover open at a time, popover fixed size (248×171), no movement of header/search/grid/first row when entering edit mode, console clean, dark + light theme, custom background.

**Testing gotcha:** the in-app test browser pane can be *hidden*; then `requestAnimationFrame` never fires and any test awaiting it hangs and keeps running in the background, corrupting later runs (this produced false "rows misaligned" failures once). Use `setTimeout` + reading `offsetHeight`, and reload the page after a timeout.

**Still to verify**
- In real Brave with the extension loaded (only the test browser + a storage mock were used): layout persistence after a full browser restart, real-screen look at 1920+/ultrawide.
- Entering edit mode adds "Add" tiles, so rows *below the first row* move down (one extra card row per category above them) – content, not a bug (the header, search, grid start and first row do not move).
- `producer-dashboard-main` and the Store zip are outdated (see §2).

### 2026-09-23 – Release preparation (summary of earlier work)
- Converted the dashboard into an MV3 extension; `chrome.storage.local` with `localStorage` fallback; first-run guide; producer name; IT/EN; export/import backup; footer credit; privacy policy; README.
- Full audit: cursor light moved behind the content (root cause of the "light bands"), idle animation loop removed (was ~238 rAF/s), shadows kept inside the card gap, hover lift only (no scale), consistent sizes/alignment, focus ring, contrast bump for tertiary text, background-color picker, layout-shift fixes.
- Logo redrawn cleanly (Inter Bold "S" on a symmetric squircle) → icons 16/32/48/128.
- Store package + assets prepared (`Prova\`), repo made public.

## 7. Chrome Web Store status

Package `producer-dashboard-1.0.0.zip` built and listing texts/assets prepared (`Prova\store-listing.md`, `Prova\store-assets\`). As of 2026-09-23 the listing was being filled in; **submission/approval status not recorded here – update this line.**
If 1.0.0 was already uploaded, **the next upload must use a higher `version` in `manifest.json`** (e.g. 1.1.0 for the layout feature + the 2026-09-24 polish pass) and a rebuilt zip. Not done yet. The Store description in `Prova\store-listing.md` already mentions the two layouts and the Ambient LED; the privacy answers do not change (still no data collected; permissions unchanged).

## 8. Open items / ideas

- Commit + push the uncommitted work (layout + polish pass), decide version bump (1.1.0) and rebuild the zip.
- Real-Brave check of the new-tab keyboard focus and of the LED on the real monitor (see the 2026-09-24 polish entry, "Still to check").
- Ideas not done: animate the layout switch / leaving edit mode; an LED "follow vertical position" option; a per-theme LED colour.
- Add an open-source licence (none yet: code is public but not reusable by others).
- GitHub repo description still reads "la mia tab internet".
- Optional: 4-column default card grid inside a single-column category (currently 3 cards per row at 900px, leaving one card alone on the 2nd row for categories with 4 links) – left as is on purpose.

## 9. How to test locally

0. **Automated tests:** `Prova\test-harness\README.md` (headless Edge over DevTools Protocol; `python -m http.server 8765` in `brave-newtab`, then e.g. `python t_search.py`). Use these for anything involving animation, pointer movement, focus or `prefers-reduced-motion`: the Claude in-app browser pane is normally hidden (0×0, no `requestAnimationFrame`, reduced-motion on) and cannot show them. `t_ext.py` loads the real unpacked extension in Edge.
1. `brave://extensions` → Developer mode → **Load unpacked** → select `Prova\brave-newtab` (reload the extension after every change).
2. Or as a web page: `python -m http.server` in the folder, open `http://localhost:8000` (uses `localStorage` instead of `chrome.storage`; `chrome.search` falls back to Brave Search).
3. Reset everything: in Edit mode → "Reset to defaults", or clear the extension's storage.
