const range = document.getElementById("compareRange");
const afterLayer = document.getElementById("afterLayer");
const divider = document.getElementById("compareDivider");

if (range && afterLayer && divider) {
    range.addEventListener("input", () => {
        const value = range.value;

        afterLayer.style.clipPath = `inset(0 0 0 ${value}%)`;
        divider.style.left = `${value}%`;
    });
}

/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements = document.querySelectorAll(
    ".section-rail, " +
    ".before-after-heading, " +
    ".selected-work-heading, " +
    ".why-heading, " +
    ".process-heading, " +
    ".preview-card, " +
    ".gallery-item, " +
    ".why-item, " +
    ".process-step, " +
    ".testimonial, " +
    ".final-cta-copy"
);

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => {
    element.classList.add("reveal");
    revealObserver.observe(element);
});


/* =========================================
   HEADER ON SCROLL
========================================= */

const header = document.querySelector(".site-header");

if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }
    });
}

/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuButton = document.querySelector(".menu-button");
const primaryNav = document.getElementById("primaryNav");

if (menuButton && primaryNav && header) {
    menuButton.addEventListener("click", () => {
        const isOpen = header.classList.toggle("menu-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            header.classList.remove("menu-open");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}
