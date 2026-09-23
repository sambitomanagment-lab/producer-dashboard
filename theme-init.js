// Runs synchronously from <head> so the saved theme and background are applied
// before the first paint (chrome.storage is async and would cause a flash).
try {
  const theme = localStorage.getItem("producerdashboard-theme") === "light" ? "light" : "dark";
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);

  const bg = JSON.parse(localStorage.getItem("producerdashboard-bg"))?.[theme];
  if (Array.isArray(bg) && bg.length === 2 && bg.every((c) => /^hsl\([\d.\s%]+\)$/.test(c))) {
    root.style.setProperty("--bg-a", bg[0]);
    root.style.setProperty("--bg-b", bg[1]);
  }
} catch (e) {}
