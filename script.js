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
const STATE_VERSION = 1;
const MAX_NAME = 30;
const APP_NAME = "ProducerDashboard";
const CATEGORY_MIME = "application/x-producerdashboard-category";

// ---------- i18n (auto-detected from the browser language) ----------

const LANG = (navigator.language || "en").toLowerCase().startsWith("it") ? "it" : "en";

const I18N = {
  en: {
    toggleTheme: "Toggle theme",
    edit: "Edit",
    editTitle: "Edit (E)",
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
    confirmReset: "Reset categories and cards to the defaults? Your name is kept.",
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
    confirmReset: "Ripristinare categorie e card ai valori predefiniti? Il tuo nome viene mantenuto.",
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
  return { version: STATE_VERSION, name: "", onboarded: false, categories: seedCategories() };
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
    color: typeof c.color === "string" && /^#[0-9a-f]{6}$/i.test(c.color) ? c.color : null,
    links: Array.isArray(c.links) ? c.links.map(sanitizeLink).filter(Boolean) : [],
  };
}

// Returns a clean state object, or null if `raw` isn't usable at all.
function sanitizeState(raw) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.categories)) return null;
  return {
    version: STATE_VERSION,
    name: typeof raw.name === "string" ? raw.name.trim().slice(0, MAX_NAME) : "",
    onboarded: raw.onboarded === true,
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

// Single delegated listener (not one per category — registering one per
// render() call would leak a listener on every add/remove/reorder).
document.addEventListener("click", (e) => {
  document.querySelectorAll(".cat-color-pop.open").forEach((pop) => {
    if (!pop.closest(".cat-swatch-wrap").contains(e.target)) pop.classList.remove("open");
  });
});

function render() {
  sectionsEl.innerHTML = "";
  shortcuts.length = 0;

  state.categories.forEach((cat, catIndex) => {
    sectionsEl.appendChild(buildCategorySection(cat, catIndex));
  });

  sectionsEl.appendChild(buildAddCategoryRow());

  if (state.categories.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("emptyState");
    sectionsEl.insertBefore(empty, sectionsEl.lastChild);
  }

  assignShortcuts();
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

  const swatchWrap = document.createElement("span");
  swatchWrap.className = "cat-swatch-wrap";

  const swatch = document.createElement("button");
  swatch.type = "button";
  swatch.className = "cat-swatch";
  swatch.title = t("categoryColor");
  swatch.setAttribute("aria-label", t("categoryColor"));

  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.className = "cat-color-input";
  colorInput.setAttribute("aria-label", t("customColor"));
  colorInput.value = cat.color || PRESET_COLORS[0];

  const pop = document.createElement("div");
  pop.className = "cat-color-pop";

  PRESET_COLORS.forEach((hex) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "cat-color-dot";
    dot.style.background = hex;
    dot.title = hex;
    dot.addEventListener("click", () => {
      cat.color = hex;
      saveState();
      applyCatColor(section, hex);
      closePop();
    });
    pop.appendChild(dot);
  });

  const customDot = document.createElement("button");
  customDot.type = "button";
  customDot.className = "cat-color-dot cat-color-dot-custom";
  customDot.title = t("customColor");
  customDot.setAttribute("aria-label", t("customColor"));
  customDot.addEventListener("click", () => { closePop(); colorInput.click(); });
  pop.appendChild(customDot);

  const resetDot = document.createElement("button");
  resetDot.type = "button";
  resetDot.className = "cat-color-dot cat-color-dot-reset";
  resetDot.title = t("defaultColor");
  resetDot.setAttribute("aria-label", t("defaultColor"));
  resetDot.addEventListener("click", () => {
    cat.color = null;
    saveState();
    applyCatColor(section, null);
    closePop();
  });
  pop.appendChild(resetDot);

  function closePop() { pop.classList.remove("open"); }

  swatch.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".cat-color-pop.open").forEach((p) => { if (p !== pop) p.classList.remove("open"); });
    pop.classList.toggle("open");
  });

  colorInput.addEventListener("input", () => applyCatColor(section, colorInput.value));
  colorInput.addEventListener("change", () => {
    cat.color = colorInput.value;
    saveState();
  });

  swatchWrap.append(swatch, pop, colorInput);

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

  head.append(grip, num, name, swatchWrap, remove);
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

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

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
  if (q) runSearch(q);
});

searchInput.focus();

// ============================================================
// Theme
// ============================================================

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.querySelector("use").setAttribute("href", theme === "light" ? "#i-sun" : "#i-moon");
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
}

let currentTheme = "dark";
try {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") currentTheme = saved;
} catch (e) {}
applyTheme(currentTheme);

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(currentTheme);
});

// ============================================================
// Edit mode toggle
// ============================================================

const editToggle = document.getElementById("editToggle");

function setEditMode(on) {
  document.body.classList.toggle("edit-mode", on);
  footActions.hidden = !on;
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
  saveState();
  render();
});

guideBtn.addEventListener("click", showWelcome);

// ---------- Backup: export / import a JSON file (no cloud, no account) ----------

exportBtn.addEventListener("click", () => {
  const backup = { app: APP_NAME, version: STATE_VERSION, name: state.name, categories: state.categories };
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
    overlay.remove();
    closeWelcome = null;
    searchInput.focus();
  };
  card.addEventListener("submit", (e) => { e.preventDefault(); closeWelcome(); });
}

// ============================================================
// Keyboard shortcuts
// ============================================================

document.addEventListener("keydown", (e) => {
  if (closeWelcome) {
    if (e.key === "Escape") closeWelcome();
    return;
  }

  const tag = document.activeElement.tagName;
  const inField = tag === "INPUT" || tag === "TEXTAREA";

  if (e.key === "/" && !inField) {
    e.preventDefault();
    searchInput.focus();
    return;
  }

  if (e.key === "Escape") {
    if (document.activeElement === searchInput) searchInput.blur();
    return;
  }

  if (inField) return;

  if (e.key === "e") {
    setEditMode(!isEditMode());
    return;
  }

  if (/^[1-9]$/.test(e.key) && !isEditMode()) {
    const url = shortcuts[Number(e.key) - 1];
    if (url) window.location.href = url;
  }
});

// ============================================================
// Cursor-reactive negative sphere
// ============================================================

(function initCursorOrb() {
  // Each segment chases the one before it (segment 0 chases the real cursor),
  // which is what turns a single glow into a short, soft trailing tail.
  const SEGMENTS = [
    { size: 420, alpha: 0.14, ease: 0.22 },
    { size: 300, alpha: 0.09, ease: 0.24 },
    { size: 200, alpha: 0.06, ease: 0.26 },
    { size: 130, alpha: 0.04, ease: 0.28 },
  ];

  // Isolated on its own compositing layer so its mix-blend-mode never has to
  // be recomputed against the glass cards' backdrop-filter — mixing the two
  // directly is a known Chromium/Brave GPU bug that shows up as rectangular
  // tiling glitches inside blurred cards near the moving cursor.
  const layer = document.createElement("div");
  layer.className = "cursor-orb-layer";
  document.body.appendChild(layer);

  const nodes = SEGMENTS.map(({ size, alpha }) => {
    const el = document.createElement("div");
    el.className = "cursor-orb";
    el.style.setProperty("--orb-size", `${size}px`);
    el.style.setProperty("--orb-a", alpha);
    layer.appendChild(el);
    return { el, half: size / 2, x: -9999, y: -9999, hasPos: false };
  });

  let targetX = innerWidth / 2;
  let targetY = innerHeight / 2;
  let visible = false;
  let raf = null;

  function settle() {
    let maxDelta = 0;
    let cx = targetX;
    let cy = targetY;

    nodes.forEach((node, i) => {
      const ease = SEGMENTS[i].ease;
      if (!node.hasPos) { node.x = cx; node.y = cy; node.hasPos = true; }
      node.x += (cx - node.x) * ease;
      node.y += (cy - node.y) * ease;
      maxDelta = Math.max(maxDelta, Math.abs(cx - node.x), Math.abs(cy - node.y));
      node.el.style.transform = `translate3d(${node.x - node.half}px, ${node.y - node.half}px, 0)`;
      cx = node.x;
      cy = node.y;
    });

    if (visible || maxDelta > 0.5) {
      raf = requestAnimationFrame(settle);
    } else {
      raf = null;
    }
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(settle);
  }

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!visible) {
      visible = true;
      nodes.forEach((n) => (n.el.style.opacity = "1"));
    }
    kick();
  });

  document.addEventListener("mouseleave", () => {
    visible = false;
    nodes.forEach((n) => (n.el.style.opacity = "0"));
    kick();
  });
})();

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
    render();
  });
}

(async function init() {
  state = await loadState();
  renderBrand();
  render();
  if (!state.onboarded) showWelcome();
})();
