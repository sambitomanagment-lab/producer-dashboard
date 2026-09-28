// ============================================================
// CONFIG — everything you'd want to edit lives here.
// This is only the *seed* used the very first time the page runs;
// after that, each user's setup (categories, cards, name, colors)
// is persisted locally: chrome.storage.local in the extension,
// localStorage when the page is opened as a plain website.
// ============================================================

// Labels and descriptions are { en, it }; names/URLs are proper nouns.
const DEFAULT_CATEGORIES = [
  {
    label: { en: "Production", it: "Produzione" },
    links: [
      { name: "Splice", url: "https://splice.com/", desc: { en: "Samples & loops", it: "Sample e loop" } },
      { name: "BandLab", url: "https://www.bandlab.com/", desc: { en: "Browser DAW", it: "DAW nel browser" } },
      { name: "Freesound", url: "https://freesound.org/", desc: { en: "Free sound library", it: "Suoni gratuiti" } },
      { name: "Samplette", url: "https://samplette.io/", desc: { en: "Sample discovery", it: "Scoperta di sample" } },
    ],
  },
  {
    label: { en: "Tools", it: "Strumenti" },
    links: [
      { name: "LANDR", url: "https://www.landr.com/", desc: { en: "Mastering", it: "Mastering" } },
      { name: "ChatGPT", url: "https://chatgpt.com/", desc: { en: "AI assistant", it: "Assistente AI" } },
      { name: "Claude", url: "https://claude.ai/", desc: { en: "AI assistant", it: "Assistente AI" } },
    ],
  },
  {
    label: { en: "Management", it: "Gestione" },
    links: [
      { name: "Gmail", url: "https://mail.google.com/", desc: { en: "Inbox", it: "Posta" } },
      { name: "Google Drive", url: "https://drive.google.com/", desc: { en: "Files", it: "File" } },
      { name: "DistroKid", url: "https://distrokid.com/", desc: { en: "Distribution", it: "Distribuzione" } },
      { name: "BeatStars", url: "https://www.beatstars.com/", desc: { en: "Sell beats", it: "Vendi beat" } },
    ],
  },
];

// Fallback used only when the page runs outside the extension (dev server).
// Inside the extension, searches go through chrome.search (the user's own
// default search engine).
const SEARCH_URL = "https://search.brave.com/search?q=";
const STORAGE_KEY = "producerdashboard-state";
const THEME_KEY = "producerdashboard-theme";
const BG_KEY = "producerdashboard-bg"; // pre-computed background, read by theme-init.js before first paint
const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const STATE_VERSION = 1;
const MAX_NAME = 30;

// Category layout: how many category columns the page uses. Only two options
// are offered for now: 1 ("horizontal", the original layout) and 3 ("columns").
// The layout engine itself works for any number of columns (see applyLayout).
const LAYOUT_COLUMNS = 3;
const COL_TARGET = 300;      // comfortable column width; sets how wide the page may grow
const CAT_GAP = 32;          // must match --cat-gap in the CSS

// Ambient LED: a soft light rising from the bottom edge of the window. intensity
// and spread are 0–100 sliders; color null = the built-in green.
const LED_DEFAULT_COLOR = "#7fb896";
function defaultAmbient() {
  return { on: true, color: null, intensity: 48, spread: 50 };
}
const APP_NAME = "ProducerDashboard";
const CATEGORY_MIME = "application/x-producerdashboard-category";

// ---------- i18n (auto-detected from the browser language) ----------

const LANG = (navigator.language || "en").toLowerCase().startsWith("it") ? "it" : "en";

const I18N = {
  en: {
    toggleTheme: "Toggle theme",
    edit: "Edit",
    editTitle: "Edit (E)",
    backgroundColor: "Background color",
    layoutLabel: "Category layout",
    layoutHint: "Display",
    layoutColumns: "Columns",
    layoutHorizontal: "Horizontal",
    ambientLed: "Ambient LED",
    ambientIntensity: "Intensity",
    ambientSpread: "Spread",
    searchPlaceholder: "Search the web…",
    searchLabel: "Search the web",
    showGuide: "Show guide",
    exportBackup: "Export backup",
    importBackup: "Import backup",
    confirmImport: "Replace your current categories and cards with this backup?",
    importInvalid: "This file isn't a valid ProducerDashboard backup.",
    resetDefaults: "Reset to defaults",
    emptyState: "No categories yet — add one below.",
    categoryColor: "Category color",
    customColor: "Custom color",
    defaultColor: "Default",
    removeCategory: "Remove category",
    removeCategoryNamed: (n) => `Remove ${n} category`,
    removeNamed: (n) => `Remove ${n}`,
    confirmRemoveCategory: (n) => `Remove "${n}" and all its cards?`,
    confirmReset: "Reset categories, cards, background, layout and ambient LED to the defaults? Your name is kept.",
    add: "Add",
    addCategory: "Add category",
    categoryName: "Category name",
    saveCategory: "Save category",
    name: "Name",
    url: "URL",
    descOptional: "Description (optional)",
    cancel: "Cancel",
    save: "Save",
    yourName: "Your name",
    welcomeTitle: `Welcome to ${APP_NAME}`,
    welcomeLead: "Your new tab, built for producers: every site and tool you use, one click away.",
    welcomeNameLabel: "What should the dashboard call you?",
    welcomeNamePlaceholder: "Producer name",
    welcomeStart: "Get started",
    tips: [
      ["Press ", "E", " or click the pencil to edit: add, rename, recolor and drag categories and cards."],
      ["Press ", "/", " to search the web with your browser's default search engine."],
      ["Press ", "1–9", " to open your first nine shortcuts instantly."],
      ["", "", "Everything is saved only in this browser. No account, no server, nothing leaves your device."],
    ],
  },
  it: {
    toggleTheme: "Cambia tema",
    edit: "Modifica",
    editTitle: "Modifica (E)",
    backgroundColor: "Colore sfondo",
    layoutLabel: "Layout categorie",
    layoutHint: "Visualizzazione",
    layoutColumns: "Colonne",
    layoutHorizontal: "Orizzontale",
    ambientLed: "LED ambientale",
    ambientIntensity: "Intensità",
    ambientSpread: "Diffusione",
    searchPlaceholder: "Cerca sul web…",
    searchLabel: "Cerca sul web",
    showGuide: "Mostra guida",
    exportBackup: "Esporta backup",
    importBackup: "Importa backup",
    confirmImport: "Sostituire le categorie e le card attuali con questo backup?",
    importInvalid: "Questo file non è un backup valido di ProducerDashboard.",
    resetDefaults: "Ripristina predefiniti",
    emptyState: "Nessuna categoria — aggiungine una qui sotto.",
    categoryColor: "Colore categoria",
    customColor: "Colore personalizzato",
    defaultColor: "Predefinito",
    removeCategory: "Rimuovi categoria",
    removeCategoryNamed: (n) => `Rimuovi la categoria ${n}`,
    removeNamed: (n) => `Rimuovi ${n}`,
    confirmRemoveCategory: (n) => `Rimuovere "${n}" e tutte le sue card?`,
    confirmReset: "Ripristinare categorie, card, sfondo, layout e LED ambientale ai valori predefiniti? Il tuo nome viene mantenuto.",
    add: "Aggiungi",
    addCategory: "Aggiungi categoria",
    categoryName: "Nome categoria",
    saveCategory: "Salva categoria",
    name: "Nome",
    url: "URL",
    descOptional: "Descrizione (facoltativa)",
    cancel: "Annulla",
    save: "Salva",
    yourName: "Il tuo nome",
    welcomeTitle: `Benvenuto in ${APP_NAME}`,
    welcomeLead: "La tua nuova scheda, pensata per i producer: tutti i siti e gli strumenti che usi, a un click.",
    welcomeNameLabel: "Come deve chiamarti la dashboard?",
    welcomeNamePlaceholder: "Nome del producer",
    welcomeStart: "Inizia",
    tips: [
      ["Premi ", "E", " o clicca la matita per modificare: aggiungi, rinomina, colora e trascina categorie e card."],
      ["Premi ", "/", " per cercare sul web con il motore di ricerca predefinito del browser."],
      ["Premi ", "1–9", " per aprire subito i tuoi primi nove collegamenti."],
      ["", "", "Tutto viene salvato solo in questo browser. Nessun account, nessun server, niente lascia il tuo dispositivo."],
    ],
  },
};

const t = (key, ...args) => {
  const v = I18N[LANG][key];
  return typeof v === "function" ? v(...args) : v;
};
const pick = (obj) => (obj && typeof obj === "object" ? obj[LANG] || obj.en : obj);

function applyStaticI18n() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t(el.dataset.i18nTitle); });
}
applyStaticI18n();

// Muted, on-brand presets — keeps category tinting tasteful even if you
// never touch the custom picker. All chosen at similar low saturation/lightness.
const PRESET_COLORS = ["#7fb896", "#c98f6b", "#7c98b3", "#c98a95", "#c9b384", "#8b93a0"];

// ============================================================
// State
// ============================================================

function genKey(label) {
  const slug = (label || "cat").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${slug || "cat"}-${Math.random().toString(36).slice(2, 7)}`;
}

function seedCategories() {
  return DEFAULT_CATEGORIES.map((c) => {
    const label = pick(c.label);
    return {
      key: genKey(label),
      label,
      color: null,
      links: c.links.map((l) => ({ name: l.name, url: l.url, desc: pick(l.desc) })),
    };
  });
}

function seedState() {
  return { version: STATE_VERSION, name: "", onboarded: false, bg: null, columns: 1, ambient: defaultAmbient(), categories: seedCategories() };
}

// Backups can come from other people, so only well-formed data gets through:
// http(s) links only (no javascript: etc.) and hex colors only.
function sanitizeLink(l) {
  if (!l || typeof l.name !== "string" || typeof l.url !== "string") return null;
  if (!/^https?:\/\//i.test(l.url.trim())) return null;
  return { name: l.name, url: l.url.trim(), desc: typeof l.desc === "string" ? l.desc : "" };
}

function sanitizeCategory(c) {
  if (!c || typeof c !== "object") return null;
  const label = typeof c.label === "string" && c.label.trim() ? c.label : "Untitled";
  return {
    key: typeof c.key === "string" && c.key ? c.key : genKey(label),
    label,
    color: typeof c.color === "string" && HEX_COLOR.test(c.color) ? c.color : null,
    links: Array.isArray(c.links) ? c.links.map(sanitizeLink).filter(Boolean) : [],
  };
}

// Anything missing or malformed falls back to the default, so settings saved
// before the Ambient LED existed simply get it switched on, softly.
function sanitizeAmbient(raw) {
  const d = defaultAmbient();
  if (!raw || typeof raw !== "object") return d;
  const pct = (v, fallback) => (typeof v === "number" && Number.isFinite(v) ? Math.min(100, Math.max(0, Math.round(v))) : fallback);
  return {
    on: typeof raw.on === "boolean" ? raw.on : d.on,
    color: typeof raw.color === "string" && HEX_COLOR.test(raw.color) ? raw.color : null,
    intensity: pct(raw.intensity, d.intensity),
    spread: pct(raw.spread, d.spread),
  };
}

// Returns a clean state object, or null if `raw` isn't usable at all.
function sanitizeState(raw) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.categories)) return null;
  return {
    version: STATE_VERSION,
    name: typeof raw.name === "string" ? raw.name.trim().slice(0, MAX_NAME) : "",
    onboarded: raw.onboarded === true,
    bg: typeof raw.bg === "string" && HEX_COLOR.test(raw.bg) ? raw.bg : null,
    // Only two layouts exist: 3 ("columns") or 1 (horizontal, the original).
    // Settings saved before this option existed have no `columns` and keep 1.
    columns: raw.columns === LAYOUT_COLUMNS ? LAYOUT_COLUMNS : 1,
    ambient: sanitizeAmbient(raw.ambient),
    categories: raw.categories.map(sanitizeCategory).filter(Boolean),
  };
}

// Storage adapter: chrome.storage.local inside the extension (survives
// "clear site data", shared by every new tab), localStorage when the page is
// opened as a normal website during development.
const hasChromeStorage = typeof chrome !== "undefined" && !!chrome.storage && !!chrome.storage.local;

const store = {
  async get() {
    if (hasChromeStorage) {
      const res = await chrome.storage.local.get(STORAGE_KEY);
      return res[STORAGE_KEY];
    }
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return undefined; }
  },
  async set(value) {
    if (hasChromeStorage) return chrome.storage.local.set({ [STORAGE_KEY]: value });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
};

async function loadState() {
  try {
    return sanitizeState(await store.get()) || seedState();
  } catch (e) {
    console.error("Could not read saved settings, using defaults.", e);
    return seedState();
  }
}

let state = seedState(); // replaced by loadState() in init() before the first render
let editingLink = null; // { catKey, index } | null
const shortcuts = []; // flat list of urls in render order, index 0 -> key "1"

function saveState() {
  store.set(state).catch((e) => console.error("Could not save settings.", e));
}

// ============================================================
// Rendering
// ============================================================

const sectionsEl = document.getElementById("sections");
const resetBtn = document.getElementById("resetLinks");
const guideBtn = document.getElementById("guideBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const footActions = document.getElementById("footActions");

function icon(id, extraClass) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", extraClass ? `icon ${extraClass}` : "icon");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#${id}`);
  svg.appendChild(use);
  return svg;
}

function normalizeUrl(raw) {
  const v = raw.trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

function isEditMode() {
  return document.body.classList.contains("edit-mode");
}

// Cancel + save buttons, shared by the card form and the add-category form.
function buildFormActions(className, saveLabel, onCancel) {
  const actions = document.createElement("div");
  actions.className = className;

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.setAttribute("aria-label", t("cancel"));
  cancel.appendChild(icon("i-x"));
  cancel.addEventListener("click", onCancel);

  const save = document.createElement("button");
  save.type = "submit";
  save.className = "save-btn";
  save.setAttribute("aria-label", saveLabel);
  save.appendChild(icon("i-check"));

  actions.append(cancel, save);
  return actions;
}

// ---------- Color picker (shared by category colors and the background) ----------

// Single delegated listener (not one per picker — registering one per
// render() call would leak a listener on every add/remove/reorder).
document.addEventListener("click", (e) => {
  document.querySelectorAll(".color-pop.open").forEach((pop) => {
    if (!pop.closest(".color-picker").contains(e.target)) pop.classList.remove("open");
  });
});

// A swatch that opens the muted preset palette, with a native picker for
// custom colors and a reset. Callers decide what a color means. `head` / `foot`
// add extra rows above / below the palette (the Ambient LED's switch and
// sliders); `keepOpen` leaves that panel open after a preset is chosen.
function buildColorPicker({ label, color, toolbar = false, head = null, foot = null, keepOpen = false, onPreview, onSelect, onReset }) {
  const el = document.createElement("span");
  el.className = toolbar ? "color-picker color-picker--toolbar" : "color-picker";

  const swatch = document.createElement("button");
  swatch.type = "button";
  swatch.className = toolbar ? "color-swatch toolbar-btn" : "color-swatch";
  swatch.title = label;
  swatch.setAttribute("aria-label", label);

  const input = document.createElement("input");
  input.type = "color";
  input.className = "color-input";
  input.setAttribute("aria-label", t("customColor"));
  input.value = color || PRESET_COLORS[0];

  const pop = document.createElement("div");
  pop.className = toolbar ? "color-pop color-pop--end" : "color-pop";

  // With extra rows the palette gets its own row inside a column-shaped panel.
  const panel = !!(head || foot);
  const dots = panel ? document.createElement("div") : pop;
  if (panel) {
    dots.className = "color-dots";
    pop.classList.add("color-pop--panel");
    pop.append(...[head, dots, foot].filter(Boolean));
  }

  const closePop = () => pop.classList.remove("open");
  const afterPick = () => { if (!keepOpen) closePop(); };
  const dot = (cls, title, onClick, background) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `color-dot ${cls}`.trim();
    b.title = title;
    b.setAttribute("aria-label", title);
    if (background) b.style.background = background;
    b.addEventListener("click", onClick);
    dots.appendChild(b);
  };

  PRESET_COLORS.forEach((hex) => dot("", hex, () => { onSelect(hex); afterPick(); }, hex));
  dot("color-dot-custom", t("customColor"), () => { closePop(); input.click(); });
  dot("color-dot-reset", t("defaultColor"), () => { onReset(); afterPick(); });

  swatch.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".color-pop.open").forEach((p) => { if (p !== pop) p.classList.remove("open"); });
    const open = pop.classList.toggle("open");
    // In the right-hand columns the popover would run off the screen: open it
    // leftwards instead. (offsetWidth, not the bounding box: the popover is
    // mid-transition here and its transform would skew the measurement.)
    pop.classList.remove("is-flipped");
    if (open && pop.getBoundingClientRect().left + pop.offsetWidth > innerWidth - 8) pop.classList.add("is-flipped");
  });
  input.addEventListener("input", () => onPreview && onPreview(input.value));
  input.addEventListener("change", () => onSelect(input.value));

  const setColor = (c) => {
    swatch.classList.toggle("is-default", !c);
    if (c) el.style.setProperty("--swatch", c);
    else el.style.removeProperty("--swatch");
  };
  setColor(color);

  el.append(swatch, pop, input);
  return { el, swatch, setColor };
}

function render() {
  sectionsEl.innerHTML = "";
  shortcuts.length = 0;

  // Categories are cells of one grid; how many columns it has is the "category
  // layout" (see applyLayout). Cell order = DOM order = shortcut order.
  const catGrid = document.createElement("div");
  catGrid.className = "cat-grid";
  state.categories.forEach((cat, catIndex) => {
    catGrid.appendChild(buildCategorySection(cat, catIndex));
  });
  sectionsEl.appendChild(catGrid);

  sectionsEl.appendChild(buildAddCategoryRow());

  if (state.categories.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("emptyState");
    sectionsEl.insertBefore(empty, sectionsEl.lastChild);
  }

  assignShortcuts();
  applyLayout();
}

function applyCatColor(section, color) {
  if (color) {
    section.style.setProperty("--cat-accent", color);
    section.style.setProperty("--cat-border", `color-mix(in srgb, ${color} 45%, var(--glass-border) 55%)`);
    section.style.setProperty("--cat-border-hover", `color-mix(in srgb, ${color} 65%, var(--glass-border-hover) 35%)`);
    section.style.setProperty("--cat-glass", `color-mix(in srgb, ${color} 10%, var(--glass-bg) 90%)`);
    section.style.setProperty("--cat-glass-hover", `color-mix(in srgb, ${color} 16%, var(--glass-bg-hover) 84%)`);
  } else {
    section.style.removeProperty("--cat-accent");
    section.style.removeProperty("--cat-border");
    section.style.removeProperty("--cat-border-hover");
    section.style.removeProperty("--cat-glass");
    section.style.removeProperty("--cat-glass-hover");
  }
}

function buildCategorySection(cat, catIndex) {
  const section = document.createElement("section");
  section.className = "cat";
  section.dataset.key = cat.key;
  applyCatColor(section, cat.color);

  const head = document.createElement("div");
  head.className = "cat-head";

  const grip = icon("i-grip", "cat-grip");

  const num = document.createElement("span");
  num.className = "cat-num";
  num.textContent = String(catIndex + 1).padStart(2, "0");

  const name = document.createElement("span");
  name.className = "cat-name";
  name.textContent = cat.label;
  name.addEventListener("click", () => {
    if (!isEditMode()) return;
    startRenameCategory(cat, name);
  });

  const setCatColor = (color) => {
    cat.color = color;
    saveState();
    applyCatColor(section, color);
    picker.setColor(color);
  };
  const picker = buildColorPicker({
    label: t("categoryColor"),
    color: cat.color,
    onPreview: (color) => applyCatColor(section, color),
    onSelect: setCatColor,
    onReset: () => setCatColor(null),
  });

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "cat-remove";
  remove.appendChild(icon("i-x"));
  remove.title = t("removeCategory");
  remove.setAttribute("aria-label", t("removeCategoryNamed", cat.label));
  remove.addEventListener("click", () => {
    if (!confirm(t("confirmRemoveCategory", cat.label))) return;
    state.categories.splice(catIndex, 1);
    saveState();
    render();
  });

  head.append(grip, num, name, picker.el, remove);
  section.appendChild(head);

  // category drag & drop (reorder categories)
  head.draggable = true;
  head.addEventListener("dragstart", (e) => {
    if (!isEditMode()) { e.preventDefault(); return; }
    section.classList.add("dragging-cat");
    e.dataTransfer.setData(CATEGORY_MIME, String(catIndex));
    e.dataTransfer.effectAllowed = "move";
  });
  head.addEventListener("dragend", () => section.classList.remove("dragging-cat"));
  section.addEventListener("dragover", (e) => {
    if (!isEditMode()) return;
    if (!e.dataTransfer.types.includes(CATEGORY_MIME)) return;
    e.preventDefault();
    section.classList.add("drag-over-cat");
  });
  section.addEventListener("dragleave", () => section.classList.remove("drag-over-cat"));
  section.addEventListener("drop", (e) => {
    if (!e.dataTransfer.types.includes(CATEGORY_MIME)) return;
    e.preventDefault();
    section.classList.remove("drag-over-cat");
    const fromIndex = Number(e.dataTransfer.getData(CATEGORY_MIME));
    if (Number.isNaN(fromIndex) || fromIndex === catIndex) return;
    const [moved] = state.categories.splice(fromIndex, 1);
    state.categories.splice(catIndex, 0, moved);
    saveState();
    render();
  });

  const grid = document.createElement("div");
  grid.className = "grid";

  cat.links.forEach((item, index) => {
    grid.appendChild(buildLauncher(cat, item, index));
  });

  const addTile = document.createElement("button");
  addTile.type = "button";
  addTile.className = "launcher add-tile";
  addTile.appendChild(icon("i-plus"));
  addTile.appendChild(document.createTextNode(t("add")));
  addTile.addEventListener("click", () => openLinkForm(cat, null, form));

  const form = buildLinkForm(cat);

  grid.appendChild(addTile);
  grid.appendChild(form);
  section.appendChild(grid);

  return section;
}

function startRenameCategory(cat, nameEl) {
  const input = document.createElement("input");
  input.className = "cat-name-input";
  input.value = cat.label;
  nameEl.replaceWith(input);
  input.focus();
  input.select();

  const commit = () => {
    const v = input.value.trim();
    cat.label = v || cat.label;
    saveState();
    render();
  };

  input.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { e.preventDefault(); render(); }
  });
  input.addEventListener("blur", commit);
}

function buildAddCategoryRow() {
  const row = document.createElement("div");
  row.className = "add-cat-row";

  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "add-cat-tile";
  tile.appendChild(icon("i-plus"));
  tile.appendChild(document.createTextNode(t("addCategory")));

  const form = document.createElement("form");
  form.className = "add-cat-form";
  form.autocomplete = "off";

  const input = document.createElement("input");
  input.placeholder = t("categoryName");
  input.setAttribute("aria-label", t("categoryName"));

  function closeForm() {
    form.classList.remove("active");
    tile.style.display = "";
  }

  form.append(input, buildFormActions("add-cat-form-actions", t("saveCategory"), closeForm));

  tile.addEventListener("click", () => {
    tile.style.display = "none";
    form.classList.add("active");
    input.value = "";
    input.focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const label = input.value.trim();
    if (!label) return;
    state.categories.push({ key: genKey(label), label, color: null, links: [] });
    saveState();
    render();
  });

  form.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Escape") { e.preventDefault(); closeForm(); }
  });

  row.append(tile, form);
  return row;
}

function buildLauncher(cat, item, index) {
  const a = document.createElement("a");
  a.className = "launcher";
  a.href = item.url;
  a.draggable = true;
  a.dataset.cat = cat.key;
  a.dataset.index = String(index);

  const grip = icon("i-grip", "l-grip");

  const keyBadge = document.createElement("span");
  keyBadge.className = "l-key";

  const top = document.createElement("span");
  top.className = "l-top";
  const name = document.createElement("span");
  name.className = "l-name";
  name.textContent = item.name;
  top.appendChild(name);

  const desc = document.createElement("span");
  desc.className = "l-desc";
  desc.textContent = item.desc || "";

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "l-remove";
  remove.tabIndex = -1;
  remove.setAttribute("aria-label", t("removeNamed", item.name));
  remove.appendChild(icon("i-x"));
  remove.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    cat.links.splice(index, 1);
    saveState();
    render();
  });

  a.append(grip, keyBadge, top, desc, remove);

  a.addEventListener("click", (e) => {
    if (isEditMode()) e.preventDefault();
  });

  a.addEventListener("dblclick", (e) => {
    if (!isEditMode()) return;
    e.preventDefault();
    const form = a.parentElement.querySelector(".add-form");
    openLinkForm(cat, index, form, item);
  });

  a.addEventListener("dragstart", (e) => {
    if (!isEditMode()) { e.preventDefault(); return; }
    a.classList.add("dragging");
    e.dataTransfer.setData("text/plain", JSON.stringify({ cat: cat.key, index }));
    e.dataTransfer.effectAllowed = "move";
  });

  a.addEventListener("dragend", () => a.classList.remove("dragging"));

  a.addEventListener("dragover", (e) => {
    if (!isEditMode()) return;
    if (!e.dataTransfer.types.includes("text/plain")) return;
    e.preventDefault();
    e.stopPropagation();
    a.classList.add("drag-over");
  });

  a.addEventListener("dragleave", () => a.classList.remove("drag-over"));

  a.addEventListener("drop", (e) => {
    if (!e.dataTransfer.types.includes("text/plain")) return;
    e.preventDefault();
    e.stopPropagation();
    a.classList.remove("drag-over");
    let data;
    try { data = JSON.parse(e.dataTransfer.getData("text/plain")); } catch (err) { return; }
    if (!data || data.cat !== cat.key) return;
    const list = cat.links;
    const [moved] = list.splice(data.index, 1);
    list.splice(index, 0, moved);
    saveState();
    render();
  });

  return a;
}

function buildLinkForm(cat) {
  const form = document.createElement("form");
  form.className = "add-form";
  form.autocomplete = "off";

  const nameInput = document.createElement("input");
  nameInput.placeholder = t("name");
  nameInput.setAttribute("aria-label", t("name"));
  nameInput.className = "f-name";

  const urlInput = document.createElement("input");
  urlInput.placeholder = t("url");
  urlInput.setAttribute("aria-label", t("url"));
  urlInput.className = "f-url";

  const descInput = document.createElement("input");
  descInput.placeholder = t("descOptional");
  descInput.setAttribute("aria-label", t("descOptional"));
  descInput.className = "f-desc";

  const actions = buildFormActions("add-form-actions", t("save"), () => closeLinkForm(form));
  form.append(nameInput, urlInput, descInput, actions);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const url = normalizeUrl(urlInput.value);
    const desc = descInput.value.trim();
    if (!name || !url) return;

    if (editingLink && editingLink.catKey === cat.key) {
      cat.links[editingLink.index] = { ...cat.links[editingLink.index], name, url, desc };
    } else {
      cat.links.push({ name, url, desc });
    }
    saveState();
    editingLink = null;
    render();
  });

  form.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Escape") { e.preventDefault(); closeLinkForm(form); }
  });

  return form;
}

function openLinkForm(cat, index, form, existing) {
  editingLink = index === null ? null : { catKey: cat.key, index };
  const nameInput = form.querySelector(".f-name");
  nameInput.value = existing ? existing.name : "";
  form.querySelector(".f-url").value = existing ? existing.url : "";
  form.querySelector(".f-desc").value = existing ? existing.desc || "" : "";
  form.classList.add("active");
  nameInput.focus();
}

function closeLinkForm(form) {
  editingLink = null;
  form.classList.remove("active");
}

function assignShortcuts() {
  const launchers = sectionsEl.querySelectorAll(".launcher:not(.add-tile)");
  launchers.forEach((el, i) => {
    if (i < 9) {
      el.querySelector(".l-key").textContent = String(i + 1);
      shortcuts.push(el.href);
    }
  });
}

// ============================================================
// Header: date / clock
// ============================================================

const dateEl = document.getElementById("date");
const clockEl = document.getElementById("clock");
const pad = (n) => String(n).padStart(2, "0");

function tick() {
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: "long", day: "numeric", month: "long",
  });
  clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
tick();
setInterval(tick, 15000);

// ============================================================
// Search
// ============================================================

// Two states. Idle: a button that looks like the field. It takes no focus and
// no keystrokes, so the page's shortcuts (1–9, E, /) work from the moment the
// tab opens. Active: the real text field, opened by a click or "/"; it
// gives the keyboard back on Esc, on a finished search, or when the user
// clicks or tabs away. The input is display:none while idle, so it can't be
// focused (or typed into) by accident.
const searchForm = document.getElementById("searchForm");
const searchTrigger = document.getElementById("searchTrigger");
const searchInput = document.getElementById("searchInput");

const isSearchActive = () => searchForm.classList.contains("is-active");

function activateSearch() {
  searchForm.classList.add("is-active");
  searchInput.focus();
}

function deactivateSearch() {
  if (!isSearchActive()) return;
  searchForm.classList.remove("is-active");
  searchInput.value = "";
  if (document.activeElement === searchInput) searchInput.blur();
}

searchTrigger.addEventListener("click", activateSearch);

// Clicking anywhere outside the pill.
document.addEventListener("pointerdown", (e) => {
  if (isSearchActive() && !searchForm.contains(e.target)) deactivateSearch();
});

// Tabbing away. focusout also fires when the whole window loses focus
// (alt-tab); that must not discard what's being typed, hence hasFocus().
searchForm.addEventListener("focusout", (e) => {
  if (isSearchActive() && !searchForm.contains(e.relatedTarget) && document.hasFocus()) deactivateSearch();
});

const looksLikeUrl = (q) => /^https?:\/\//i.test(q) || /^[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/.test(q);

function runSearch(q) {
  if (looksLikeUrl(q)) {
    window.location.href = normalizeUrl(q);
  } else if (typeof chrome !== "undefined" && chrome.search && chrome.search.query) {
    chrome.search.query({ text: q, disposition: "CURRENT_TAB" });
  } else {
    window.location.href = `${SEARCH_URL}${encodeURIComponent(q)}`;
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (!q) return;
  runSearch(q);
  deactivateSearch();
});

// The page (not the browser's address bar) owns the keyboard on load, without
// putting a text field in the way. Best effort: the browser has the last word.
document.body.tabIndex = -1;
window.focus();
document.body.focus({ preventScroll: true });

// ============================================================
// Theme
// ============================================================

const themeToggle = document.getElementById("themeToggle");
let stateLoaded = false; // the background can only be applied once settings are read

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.querySelector("use").setAttribute("href", theme === "light" ? "#i-sun" : "#i-moon");
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  if (stateLoaded) {
    applyBackground();
    applyAmbient();
  }
}

let currentTheme = "dark";
try {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") currentTheme = saved;
} catch (e) {}
applyTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  // Cards and buttons animate their colors on hover. Left on, that animation
  // also runs on a theme change: going light → dark, the text turns white
  // instantly while the card fades down from a near-white fill for ~250ms
  // (white on white, a visible flash). Switch transitions off for the change.
  const root = document.documentElement;
  root.classList.add("theme-switching");
  applyTheme(currentTheme);
  void root.offsetWidth; // apply the new colors while transitions are off
  setTimeout(() => root.classList.remove("theme-switching"), 80);
});

// ============================================================
// Background color
// ============================================================

// Only the *hue* of the picked color is used. Saturation and lightness come
// from the interface's own muted range, so a yellow becomes a dark olive and a
// red a dark maroon, never a bright color. Greys stay neutral.
function hexToHueSat(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, l = (max + min) / 2;
  if (d === 0) return { h: 0, s: 0 };
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: (h * 60 + 360) % 360, s };
}

// Returns [top glow, base] for the given theme.
function deriveBackground(hex, theme) {
  const { h, s } = hexToHueSat(hex);
  const k = Math.min(1, s / 0.35);
  const [top, base] = theme === "light"
    ? [[30 * k, 97], [22 * k, 90]]
    : [[26 * k, 13], [22 * k, 5]];
  return [top, base].map(([sat, light]) => `hsl(${Math.round(h)} ${sat.toFixed(1)}% ${light}%)`);
}

function applyBackground(hex = state.bg) {
  const root = document.documentElement.style;
  if (!hex) {
    root.removeProperty("--bg-a");
    root.removeProperty("--bg-b");
    return;
  }
  const [top, base] = deriveBackground(hex, currentTheme);
  root.setProperty("--bg-a", top);
  root.setProperty("--bg-b", base);
}

// theme-init.js reads this before the first paint, so a custom background
// doesn't flash the default one while chrome.storage loads.
function cacheBackground() {
  try {
    if (state.bg) {
      localStorage.setItem(BG_KEY, JSON.stringify({
        dark: deriveBackground(state.bg, "dark"),
        light: deriveBackground(state.bg, "light"),
      }));
    } else {
      localStorage.removeItem(BG_KEY);
    }
  } catch (e) {}
}

const bgPicker = buildColorPicker({
  label: t("backgroundColor"),
  color: null,
  toolbar: true,
  onPreview: (hex) => applyBackground(hex),
  onSelect: (hex) => setBackground(hex),
  onReset: () => setBackground(null),
});
document.querySelector(".toolbar").insertBefore(bgPicker.el, themeToggle);

// Re-applies everything derived from state.bg (after load, import, reset or
// a change made in another tab).
function syncBackground() {
  applyBackground();
  cacheBackground();
  bgPicker.setColor(state.bg);
}

function setBackground(hex) {
  state.bg = hex;
  saveState();
  syncBackground();
}

// ============================================================
// Category layout
// ============================================================

// Columns actually used: never more than there are categories (2 categories
// on the 3-column layout spread over 2 wide columns instead of leaving one
// empty). If the window is narrower than the result, the CSS lowers the count
// by itself, down to a single column on phones.
function effectiveColumns() {
  return Math.max(1, Math.min(state.columns, state.categories.length));
}

function applyLayout() {
  const n = effectiveColumns();
  const root = document.documentElement.style;
  root.setProperty("--cols", n);
  // One column keeps the original 900px page. More columns let the page grow
  // so each column stays about COL_TARGET wide.
  root.setProperty("--wrap-max", n === 1 ? "900px" : `${Math.max(900, n * COL_TARGET + (n - 1) * CAT_GAP + 48)}px`);
  layoutPicker.update();
}

// "Layout categorie": two options, each with a small icon of its grid.
// Same toolbar/popover mechanism as the background picker.
function buildLayoutPicker() {
  const el = document.createElement("span");
  el.className = "color-picker color-picker--toolbar";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "toolbar-btn layout-toggle";
  toggle.title = t("layoutLabel");
  toggle.setAttribute("aria-label", t("layoutLabel"));
  toggle.setAttribute("aria-expanded", "false");
  toggle.appendChild(icon("i-layout"));

  const pop = document.createElement("div");
  pop.className = "color-pop color-pop--end layout-pop";

  const title = document.createElement("div");
  title.className = "layout-title";
  title.textContent = t("layoutLabel");
  const hint = document.createElement("div");
  hint.className = "layout-hint";
  hint.textContent = t("layoutHint");

  const options = document.createElement("div");
  options.className = "layout-options";
  options.setAttribute("role", "group");
  options.setAttribute("aria-label", t("layoutHint"));
  const optionEls = [
    [LAYOUT_COLUMNS, "columns", t("layoutColumns")],
    [1, "horizontal", t("layoutHorizontal")],
  ].map(([value, kind, label]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "layout-option";

    const thumb = document.createElement("span");
    thumb.className = `layout-thumb layout-thumb--${kind}`;
    thumb.setAttribute("aria-hidden", "true");
    thumb.append(...Array.from({ length: 3 }, () => document.createElement("i")));

    const text = document.createElement("span");
    text.textContent = label;

    b.append(thumb, text);
    b.addEventListener("click", () => {
      state.columns = value;
      saveState();
      applyLayout();
    });
    options.appendChild(b);
    return [value, b];
  });

  pop.append(title, hint, options);
  el.append(toggle, pop);

  const syncExpanded = () => toggle.setAttribute("aria-expanded", String(pop.classList.contains("open")));
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".color-pop.open").forEach((p) => { if (p !== pop) p.classList.remove("open"); });
    pop.classList.toggle("open");
  });
  // Also follows closes triggered elsewhere (outside click, another popover).
  new MutationObserver(syncExpanded).observe(pop, { attributes: true, attributeFilter: ["class"] });

  function update() {
    optionEls.forEach(([value, b]) => b.setAttribute("aria-pressed", String(value === state.columns)));
  }

  return { el, update };
}

const layoutPicker = buildLayoutPicker();
document.querySelector(".toolbar").insertBefore(layoutPicker.el, bgPicker.el);

// ============================================================
// Edit mode toggle
// ============================================================

const editToggle = document.getElementById("editToggle");
let editEnterTimer = 0;

function setEditMode(on) {
  document.body.classList.toggle("edit-mode", on);
  footActions.hidden = !on;
  // The edit controls fade in only when edit mode is entered. A permanent
  // animation would replay on every render() (which rebuilds the cards).
  clearTimeout(editEnterTimer);
  document.body.classList.toggle("edit-entering", on);
  if (on) editEnterTimer = setTimeout(() => document.body.classList.remove("edit-entering"), 360);
  if (!on) {
    document.querySelectorAll(".add-form.active, .add-cat-form.active").forEach((f) => f.classList.remove("active"));
    editingLink = null;
  }
}

editToggle.addEventListener("click", () => {
  setEditMode(!isEditMode());
});

resetBtn.addEventListener("click", () => {
  if (!confirm(t("confirmReset"))) return;
  state.categories = seedCategories();
  state.bg = null;
  state.columns = 1;
  state.ambient = defaultAmbient();
  saveState();
  syncBackground();
  syncAmbient();
  render();
});

guideBtn.addEventListener("click", showWelcome);

// ---------- Backup: export / import a JSON file (no cloud, no account) ----------

exportBtn.addEventListener("click", () => {
  const backup = { app: APP_NAME, version: STATE_VERSION, name: state.name, bg: state.bg, columns: state.columns, ambient: state.ambient, categories: state.categories };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `producerdashboard-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

importBtn.addEventListener("click", () => importFile.click());

importFile.addEventListener("change", async () => {
  const file = importFile.files[0];
  importFile.value = ""; // lets the same file be chosen again later
  if (!file) return;

  let next = null;
  try {
    next = sanitizeState(JSON.parse(await file.text()));
  } catch (e) {}
  if (!next) { alert(t("importInvalid")); return; }
  if (!confirm(t("confirmImport"))) return;

  state = { ...next, name: next.name || state.name, onboarded: true };
  saveState();
  renderBrand();
  syncBackground();
  syncAmbient();
  render();
});

// ============================================================
// Producer name (header title)
// ============================================================

const brandEl = document.getElementById("brand");

function renderBrand() {
  brandEl.textContent = state.name || APP_NAME;
  document.title = state.name || APP_NAME;
}

function commitName(value) {
  state.name = value.trim().slice(0, MAX_NAME);
  saveState();
  renderBrand();
}

brandEl.addEventListener("click", () => {
  if (!isEditMode() || brandEl.querySelector("input")) return;
  const input = document.createElement("input");
  input.className = "brand-input";
  input.value = state.name;
  input.maxLength = MAX_NAME;
  input.placeholder = t("yourName");
  input.setAttribute("aria-label", t("yourName"));
  brandEl.textContent = "";
  brandEl.appendChild(input);
  input.focus();

  let done = false;
  const finish = (save) => {
    if (done) return;
    done = true;
    if (save) commitName(input.value);
    else renderBrand();
  };
  input.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter") { e.preventDefault(); finish(true); }
    if (e.key === "Escape") { e.preventDefault(); finish(false); }
  });
  input.addEventListener("blur", () => finish(true));
});

// ============================================================
// First-run guide
// ============================================================

let closeWelcome = null; // set while the guide is open

function tipItem([before, key, after]) {
  const li = document.createElement("li");
  li.append(before);
  if (key) {
    const kbd = document.createElement("kbd");
    kbd.textContent = key;
    li.appendChild(kbd);
  }
  li.append(after);
  return li;
}

function showWelcome() {
  if (closeWelcome) return;

  const overlay = document.createElement("div");
  overlay.className = "welcome";

  const card = document.createElement("form");
  card.className = "welcome-card";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-modal", "true");
  card.setAttribute("aria-labelledby", "welcomeTitle");

  const title = document.createElement("h2");
  title.id = "welcomeTitle";
  title.className = "welcome-title";
  title.textContent = t("welcomeTitle");

  const lead = document.createElement("p");
  lead.className = "welcome-lead";
  lead.textContent = t("welcomeLead");

  const label = document.createElement("label");
  label.className = "welcome-label";
  label.textContent = t("welcomeNameLabel");
  const nameInput = document.createElement("input");
  nameInput.className = "welcome-name";
  nameInput.placeholder = t("welcomeNamePlaceholder");
  nameInput.maxLength = MAX_NAME;
  nameInput.value = state.name;
  nameInput.autocomplete = "off";
  label.appendChild(nameInput);

  const tips = document.createElement("ul");
  tips.className = "welcome-tips";
  t("tips").forEach((tip) => tips.appendChild(tipItem(tip)));

  const start = document.createElement("button");
  start.type = "submit";
  start.className = "welcome-cta";
  start.textContent = t("welcomeStart");

  card.append(title, lead, label, tips, start);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  nameInput.focus();

  closeWelcome = () => {
    commitName(nameInput.value);
    state.onboarded = true;
    saveState();
    closeWelcome = null;
    // Fades out (see .welcome.is-closing); the shortcuts are live right away.
    overlay.classList.add("is-closing");
    setTimeout(() => overlay.remove(), 200);
    nameInput.blur();
    document.body.focus({ preventScroll: true });
  };
  card.addEventListener("submit", (e) => { e.preventDefault(); closeWelcome(); });
}

// ============================================================
// Keyboard shortcuts
// ============================================================

// True when the focused element takes typed characters. Sliders, color inputs
// and buttons don't: with a slider focused, "E" must still leave edit mode.
const NON_TEXT_INPUTS = new Set(["range", "color", "checkbox", "radio", "button", "submit", "reset", "file"]);
function isTypingTarget(el) {
  if (!el) return false;
  if (el.isContentEditable || el.tagName === "TEXTAREA" || el.tagName === "SELECT") return true;
  return el.tagName === "INPUT" && !NON_TEXT_INPUTS.has(el.type);
}

document.addEventListener("keydown", (e) => {
  if (closeWelcome) {
    if (e.key === "Escape") closeWelcome();
    return;
  }

  // Esc: give the keyboard back (search) and close any open popover.
  if (e.key === "Escape") {
    deactivateSearch();
    document.querySelectorAll(".color-pop.open").forEach((p) => p.classList.remove("open"));
    return;
  }

  // Browser shortcuts (Ctrl+1 = switch tab, Ctrl+E = search bar...) and typing
  // in a field are never ours.
  if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing || isTypingTarget(document.activeElement)) return;

  if (e.key === "/") {
    e.preventDefault();
    activateSearch();
    return;
  }

  if (e.key === "e" || e.key === "E") {
    if (!e.repeat) setEditMode(!isEditMode());
    return;
  }

  if (/^[1-9]$/.test(e.key) && !isEditMode()) {
    const url = shortcuts[Number(e.key) - 1];
    if (url) window.location.href = url;
  }
});

// ============================================================
// Ambient LED
// ============================================================

// A soft light under the dashboard, rising from the bottom edge. JS only tracks
// the pointer's horizontal position and eases toward it; everything visual is
// CSS (see .ambient-led), driven by these custom properties on the element:
//   --ambient-led-x        centre of the light, in px (updated while it moves)
//   --ambient-led-color    the (muted) color
//   --ambient-led-opacity  how visible it is (the Intensity slider)
//   --ambient-led-spread   0..1, how wide and tall it reaches (the Spread slider)
// It sits behind the page content (the frosted cards show it through their glass).

// The Intensity slider's 100% is this opacity. Above it the light behind a
// card would push the description text under the 4.5:1 contrast ratio (measured
// with the light at full spread, the worst case, in the dark theme).
const LED_MAX_OPACITY = 0.38;

// hsl (h in degrees, s and l in 0..1) -> relative luminance (WCAG).
function hslLuminance(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const chan = (n) => {
    const k = (n + h / 30) % 12;
    const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * chan(0) + 0.7152 * chan(8) + 0.0722 * chan(4);
}

// How bright the light is, per theme: the luminance of the default green.
// Every other hue is matched to it, so a cyan or a yellow (which look far
// brighter than a blue or a red at the same hsl lightness) glow no stronger
// than the green, and one intensity ceiling is safe for all of them.
const LED_LUMINANCE = { dark: hslLuminance(146, 0.344, 0.48), light: hslLuminance(146, 0.426, 0.6) };

// Only the hue of the picked color is used, exactly as for the background:
// saturation and lightness come from the UI's muted range, so a neon red
// becomes a dark, soft red and a yellow a warm, muted one. Greys stay neutral.
function deriveLedColor(hex, theme) {
  const { h, s } = hexToHueSat(hex);
  const k = Math.min(1, s / 0.35);
  const sat = (theme === "light" ? 0.52 : 0.42) * k;
  const target = LED_LUMINANCE[theme === "light" ? "light" : "dark"];
  // Lightness whose luminance equals the target (luminance rises with lightness).
  let lo = 0.15;
  let hi = 0.9;
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2;
    if (hslLuminance(h, sat, mid) < target) lo = mid;
    else hi = mid;
  }
  return `hsl(${Math.round(h)} ${(sat * 100).toFixed(1)}% ${(((lo + hi) / 2) * 100).toFixed(1)}%)`;
}

const ambientLed = (function initAmbientLed() {
  const layer = document.createElement("div");
  layer.className = "ambient-led-layer";
  layer.setAttribute("aria-hidden", "true");
  const led = document.createElement("div");
  led.className = "ambient-led";
  layer.appendChild(led);
  // z-index 0, behind .wrap (z-index 1): the light only ever touches the
  // background and is never painted over content.
  document.body.prepend(layer);

  const INERTIA_MS = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420;
  const canHover = matchMedia("(hover: hover)").matches;

  let enabled = false;
  let fx = 0.5;     // target: pointer x as a fraction of the window width
  let x = null;     // where the light actually is (px)
  let raf = 0;
  let last = 0;

  // Keep the centre a little inside the window, so at the far left or right
  // the light is still mostly on screen instead of half cut off.
  const targetPx = () => innerWidth * (0.08 + 0.84 * fx);

  function step(now) {
    raf = 0;
    const target = targetPx();
    if (x === null) x = target;
    // The frame timestamp can be a hair earlier than the performance.now() taken
    // in the event handler that started the loop (rAF runs in the same frame as
    // the input), so never let dt go negative: it would nudge the light away.
    const dt = Math.min(64, Math.max(0, now - last));
    last = now;
    x += (target - x) * (INERTIA_MS ? 1 - Math.exp(-dt / INERTIA_MS) : 1);
    if (Math.abs(target - x) < 0.3) x = target;
    led.style.setProperty("--ambient-led-x", `${x.toFixed(1)}px`);
    // Stops once it has arrived: a resting pointer costs nothing.
    if (x !== target && enabled) raf = requestAnimationFrame(step);
  }

  function follow() {
    if (raf || !enabled) return;
    last = performance.now();
    raf = requestAnimationFrame(step);
  }

  // The light is barely there when the page opens and comes up the first time
  // the pointer moves; it then stays put, wherever the pointer went last.
  // Touch screens never move a pointer, so they get the full light at once.
  const wake = () => layer.classList.add("is-awake");
  if (canHover) {
    window.addEventListener("mousemove", (e) => {
      fx = Math.min(1, Math.max(0, e.clientX / innerWidth));
      wake();
      follow();
    }, { passive: true });
    window.addEventListener("resize", follow, { passive: true });
  } else {
    wake();
  }

  // `a` = { on, color, intensity, spread }; nothing is stored here.
  function apply(a) {
    const s = led.style;
    s.setProperty("--ambient-led-color", deriveLedColor(a.color || LED_DEFAULT_COLOR, currentTheme));
    s.setProperty("--ambient-led-opacity", ((a.intensity / 100) * LED_MAX_OPACITY).toFixed(3));
    s.setProperty("--ambient-led-spread", (a.spread / 100).toFixed(2));
    enabled = a.on;
    if (!layer.classList.contains("is-ready")) {
      void layer.offsetWidth; // commit the hidden start state so the first fade-in runs
      layer.classList.add("is-ready");
    }
    layer.classList.toggle("is-off", !a.on);
    follow();
  }

  return { apply };
})();

function applyAmbient(a = state.ambient) {
  ambientLed.apply(a);
}

// Persists a change made in the Edit Mode panel. Touching any control while
// the LED is off turns it back on: a change you can't see would look broken.
function updateAmbient(patch) {
  state.ambient = { ...state.ambient, ...patch };
  if (!("on" in patch)) state.ambient.on = true;
  saveState();
  syncAmbient();
}

// Re-applies everything derived from state.ambient (after load, import, reset
// or a change made in another tab).
function syncAmbient() {
  applyAmbient();
  ambientPicker.update();
}

// Edit Mode: one more swatch in the toolbar, next to the background one. Its
// popover reuses the palette (muted presets, custom color, default) and adds
// the on/off switch and the two sliders.
function buildAmbientPicker() {
  const head = document.createElement("div");
  head.className = "led-head";
  const title = document.createElement("span");
  title.className = "led-title";
  title.textContent = t("ambientLed");
  const power = document.createElement("button");
  power.type = "button";
  power.className = "led-switch";
  power.setAttribute("role", "switch");
  power.setAttribute("aria-label", t("ambientLed"));
  power.addEventListener("click", () => updateAmbient({ on: !state.ambient.on }));
  head.append(title, power);

  const foot = document.createElement("div");
  foot.className = "led-sliders";
  const setFill = (input) => input.style.setProperty("--fill", `${input.value}%`);
  const slider = (key, label) => {
    const row = document.createElement("label");
    row.className = "led-row";
    const name = document.createElement("span");
    name.textContent = label;
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "100";
    input.step = "1";
    // Live while dragging; stored once, when the drag ends.
    input.addEventListener("input", () => {
      setFill(input);
      applyAmbient({ ...state.ambient, [key]: Number(input.value), on: true });
    });
    input.addEventListener("change", () => updateAmbient({ [key]: Number(input.value) }));
    row.append(name, input);
    foot.appendChild(row);
    return input;
  };
  const intensity = slider("intensity", t("ambientIntensity"));
  const spread = slider("spread", t("ambientSpread"));

  const picker = buildColorPicker({
    label: t("ambientLed"),
    color: LED_DEFAULT_COLOR,
    toolbar: true,
    head,
    foot,
    keepOpen: true,
    onPreview: (hex) => applyAmbient({ ...state.ambient, color: hex, on: true }),
    onSelect: (hex) => updateAmbient({ color: hex }),
    onReset: () => updateAmbient({ color: null }),
  });

  function update() {
    const a = state.ambient;
    picker.setColor(a.color || LED_DEFAULT_COLOR);
    picker.swatch.classList.toggle("is-off", !a.on);
    power.setAttribute("aria-checked", String(a.on));
    intensity.value = a.intensity;
    spread.value = a.spread;
    setFill(intensity);
    setFill(spread);
  }

  return { el: picker.el, update };
}

const ambientPicker = buildAmbientPicker();
document.querySelector(".toolbar").insertBefore(ambientPicker.el, themeToggle);

// ============================================================
// Init
// ============================================================

// Another new tab edited the settings: pick the change up so a stale tab
// can't overwrite it later. Our own writes produce an identical state and
// are ignored.
if (hasChromeStorage) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[STORAGE_KEY]) return;
    const next = sanitizeState(changes[STORAGE_KEY].newValue);
    if (!next || JSON.stringify(next) === JSON.stringify(state)) return;
    state = next;
    renderBrand();
    syncBackground();
    syncAmbient();
    render();
  });
}

(async function init() {
  state = await loadState();
  stateLoaded = true;
  renderBrand();
  syncBackground();
  syncAmbient();
  render();
  if (!state.onboarded) showWelcome();
})();
