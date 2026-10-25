/* Keep the original English site; offer optional Google translation. */
(() => {
  "use strict";

  // Google's translated proxy already displays a language toolbar.
  // Do not display a second copy of our own control inside that proxy.
  const host = window.location.hostname.toLowerCase();
  if (host === "translate.google.com" || host.endsWith(".translate.goog")) return;

  const insertControl = () => {
    if (document.querySelector(".mb-auto-language")) return;
    const header = document.querySelector(".system-right, .case-system-actions, .system-bar");
    if (!header) return;

    const nav = document.createElement("nav");
    nav.className = "mb-auto-language notranslate";
    nav.setAttribute("translate", "no");
    nav.setAttribute("aria-label", "Choose website language");

    const english = document.createElement("a");
    english.href = window.location.pathname + window.location.search + window.location.hash;
    english.lang = "en";
    english.className = "notranslate";
    english.setAttribute("translate", "no");
    english.textContent = "EN";
    english.setAttribute("aria-current", "page");
    english.setAttribute("aria-label", "English, original website");

    const italian = document.createElement("a");
    italian.lang = "it";
    italian.className = "notranslate";
    italian.setAttribute("translate", "no");
    italian.textContent = "IT";
    italian.href = "https://translate.google.com/translate?sl=en&tl=it&u=" +
      encodeURIComponent(window.location.href);
    italian.setAttribute("aria-label", "Read this page in Italian with Google Translate");
    italian.title = "Google Translate: Italiano";

    nav.append(english, italian);
    header.appendChild(nav);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", insertControl, { once: true });
  } else {
    insertControl();
  }
})();