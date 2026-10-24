/* Mohsin Builds — shared, dependency-free bilingual navigation (EN / IT). */
(() => {
  "use strict";
  const STORE = "mohsinbuilds-preferred-language";
  const loc = location.pathname;
  const italian = loc === "/it" || loc.startsWith("/it/") ||
    loc === "/blog/it" || loc.startsWith("/blog/it/") ||
    /^\/blog\/(?:sito-web-|seo-locale-|rifacimento-|prenotazioni-online-)/.test(loc);
  const lang = italian ? "it" : "en";
  const get = () => { try { return localStorage.getItem(STORE); } catch { return null; } };
  const set = value => { try { localStorage.setItem(STORE, value); } catch {} };
  const mainPages = new Set([
    "index.html","about.html","architecture.html","projects.html","labs.html",
    "contact.html","case-studies.html","mohsin-labs-os.html",
    "mohsin-labs-case-study.html","mohsin-tools-case-study.html",
    "product-opportunity-engine-case-study.html","website-cost-calculator-case-study.html"
  ]);
  const originallyItalian = new Set([
    "sito-web-impresa-pulizie-preventivi.html",
    "sito-web-artigiani-richieste-preventivo.html",
    "seo-locale-piccole-imprese-checklist.html",
    "rifacimento-sito-aziendale-quando-conviene.html",
    "prenotazioni-online-centro-estetico-guida.html"
  ]);
  const blogFile = loc.split("/").pop() || "index.html";
  const map = target => {
    if (loc.startsWith("/blog/") || loc === "/blog") {
      if (loc === "/blog/" || loc === "/blog" || loc === "/blog/it/" || loc === "/blog/it")
        return target === "it" ? "/blog/it/" : "/blog/";
      if (target === "it")
        return originallyItalian.has(blogFile) ? "/blog/" + blogFile : "/blog/it/" + blogFile;
      return originallyItalian.has(blogFile) ? "/blog/en/" + blogFile : "/blog/" + blogFile;
    }
    const filename = loc.split("/").pop() || "index.html";
    if (!mainPages.has(filename)) return target === "it" ? "/it/" : "/";
    return target === "it"
      ? "/it/" + filename
      : (filename === "index.html" ? "/" : "/" + filename);
  };

  function createSwitch() {
    // Insights already has its own full language control.
    if (document.querySelector(".insights-lang")) return;
    const wrap = document.createElement("nav");
    wrap.className = "mb-language";
    wrap.setAttribute("aria-label", lang === "it" ? "Scegli la lingua" : "Choose language");
    ["en", "it"].forEach(value => {
      const a = document.createElement("a");
      a.href = map(value);
      a.lang = value;
      a.textContent = value === "it" ? "🇮🇹 IT" : "🇬🇧 EN";
      a.setAttribute("aria-label", value === "it" ? "Italiano" : "English");
      if (value === lang) a.setAttribute("aria-current", "page");
      a.addEventListener("click", () => set(value));
      wrap.appendChild(a);
    });
    const header = document.querySelector(".system-right, .case-system-actions");
    if (header) header.appendChild(wrap);
    else document.body.appendChild(wrap);
  }

  function keepLanguageChoice(event) {
    const a = event.target.closest?.(".insights-lang a[lang]");
    if (a) set(a.lang === "it" ? "it" : "en");
  }
  document.addEventListener("click", keepLanguageChoice);
  const saved = get();
  document.documentElement.lang = lang;

  if (saved && saved !== lang && document.referrer) {
    try {
      const ref = new URL(document.referrer);
      const next = map(saved);
      // Respect direct Google, social and copied links. Correct only same-site navigation.
      if (ref.origin === location.origin && next !== loc && !new URLSearchParams(location.search).has("lang")) {
        location.replace(next + location.hash);
        return;
      }
    } catch {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", createSwitch);
  else createSwitch();
})();