// Runs synchronously from <head> so the saved theme is applied before the
// first paint (chrome.storage is async and would cause a light/dark flash).
try {
  const t = localStorage.getItem("producerdashboard-theme");
  if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
} catch (e) {}
