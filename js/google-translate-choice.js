(() => {
  "use strict";
  const home = "https://mohsinbuilds.com";
  const chooser = () => {
    if (document.querySelector(".mb-auto-language")) return;
    const bar = document.querySelector(".system-right, .case-system-actions, .system-bar");
    if (!bar) return;
    const nav = document.createElement("nav");
    nav.className = "mb-auto-language";
    nav.setAttribute("aria-label", "Website language / Lingua del sito");
    const english = document.createElement("a");
    english.href = location.pathname + location.search + location.hash;
    english.lang = "en";
    english.textContent = "EN";
    english.setAttribute("aria-current", "page");
    english.setAttribute("aria-label", "Original website");
    const italian = document.createElement("a");
    italian.lang = "it";
    italian.textContent = "IT";
    italian.href = "https://translate.google.com/translate?sl=auto&tl=it&u=" +
      encodeURIComponent(location.href);
    italian.setAttribute("aria-label", "Translate this page to Italian with Google Translate");
    italian.title = "Google Translate · Traduci in italiano";
    nav.append(english, italian);
    bar.appendChild(nav);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", chooser);
  else chooser();
})();