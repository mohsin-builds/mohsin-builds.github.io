/* =========================================================
   MOHSIN BUILDS
   GLOBAL INTERACTIONS
========================================================= */


const menuButton =
    document.querySelector(".menu-toggle");


const mobileMenu =
    document.querySelector(".mobile-menu");


const mobileLinks =
    document.querySelectorAll(".mobile-menu a");



/* =========================================================
   MOBILE MENU
========================================================= */

if (menuButton && mobileMenu) {

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                document.body.classList.toggle(
                    "menu-open"
                );


            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );


            mobileMenu.setAttribute(
                "aria-hidden",
                String(!isOpen)
            );

        }
    );

}



/* =========================================================
   CLOSE MENU AFTER LINK CLICK
========================================================= */

mobileLinks.forEach((link) => {

    link.addEventListener(
        "click",
        () => {

            document.body.classList.remove(
                "menu-open"
            );


            menuButton?.setAttribute(
                "aria-expanded",
                "false"
            );


            mobileMenu?.setAttribute(
                "aria-hidden",
                "true"
            );

        }
    );

});



/* =========================================================
   CLOSE MOBILE MENU WITH ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            document.body.classList.remove(
                "menu-open"
            );


            menuButton?.setAttribute(
                "aria-expanded",
                "false"
            );


            mobileMenu?.setAttribute(
                "aria-hidden",
                "true"
            );

        }

    }
);

/* =========================================================
   CURRENT YEAR
========================================================= */

const yearElement =
    document.getElementById("current-year");

if (yearElement) {

    yearElement.textContent =
        new Date().getFullYear();

}

/* =========================================================
   HEADER — PREMIUM SCROLL INTERACTIONS
========================================================= */

const siteHeader =
    document.querySelector(".site-header");


const desktopNavLinks =
    Array.from(
        document.querySelectorAll(
            '.main-nav a[href^="#"]'
        )
    );



/* =========================================================
   STICKY HEADER SCROLL STATE
========================================================= */

function updateHeaderScrollState() {

    if (!siteHeader) return;

    siteHeader.classList.toggle(
        "header-scrolled",
        window.scrollY > 20
    );

}



/* =========================================================
   ACTIVE NAVIGATION SECTION
========================================================= */

function updateActiveNavigation() {

    if (!desktopNavLinks.length) return;


    const headerHeight =
        siteHeader?.offsetHeight || 0;


    const triggerPoint =
        window.scrollY +
        headerHeight +
        180;


    const availableSections =
        desktopNavLinks
            .map((link) => {

                const target =
                    link.getAttribute("href");

                if (
                    !target ||
                    target === "#"
                ) {
                    return null;
                }


                const section =
                    document.querySelector(target);


                if (!section) {
                    return null;
                }


                return {
                    link,
                    section
                };

            })
            .filter(Boolean)
            .sort(
                (a, b) =>
                    a.section.offsetTop -
                    b.section.offsetTop
            );


    let currentSection = null;


    availableSections.forEach((item) => {

        if (
            triggerPoint >=
            item.section.offsetTop
        ) {

            currentSection =
                item;
        }

    });


    desktopNavLinks.forEach((link) => {

        link.classList.remove(
            "is-active"
        );

    });


    if (currentSection) {

        currentSection.link.classList.add(
            "is-active"
        );

    }

}



/* =========================================================
   OPTIMIZED SCROLL HANDLER
========================================================= */

let headerTicking = false;


function handleHeaderScroll() {

    if (headerTicking) return;


    headerTicking = true;


    window.requestAnimationFrame(
        () => {

            updateHeaderScrollState();

            updateActiveNavigation();

            headerTicking = false;

        }
    );

}



window.addEventListener(
    "scroll",
    handleHeaderScroll,
    {
        passive: true
    }
);



window.addEventListener(
    "resize",
    updateActiveNavigation
);



/* INITIAL STATE */

updateHeaderScrollState();

updateActiveNavigation();

/* =========================================================
   SECTION 02 — WHAT I DO
   SCROLL REVEAL
========================================================= */

const servicesSection =
    document.querySelector(
        ".services-strip"
    );


if (servicesSection) {

    servicesSection.classList.add(
        "services-ready"
    );


    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        "IntersectionObserver" in window &&
        !reducedMotion
    ) {

        const servicesObserver =
            new IntersectionObserver(

                (entries, observer) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add(
                                        "is-inview"
                                    );


                                observer.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },

                {
                    threshold: 0.18,

                    rootMargin:
                        "0px 0px -8% 0px"
                }

            );


        servicesObserver.observe(
            servicesSection
        );

    }

    else {

        servicesSection.classList.add(
            "is-inview"
        );

    }

}

/* =========================================================
   GLOBAL SCROLL REVEAL
   MOHSIN BUILDS
========================================================= */

const globalRevealItems = [];


/* =========================================================
   HELPER
========================================================= */

function addReveal(
    selector,
    animationClass = "scroll-reveal",
    delayClass = ""
) {

    document
        .querySelectorAll(selector)
        .forEach((element) => {

            element.classList.add(animationClass);

            if (delayClass) {
                element.classList.add(delayClass);
            }

            globalRevealItems.push(element);

        });
}


/* =========================================================
   SECTION 03 — FEATURED WORK
========================================================= */

addReveal(
    ".portfolio-feature__content",
    "scroll-reveal-left"
);

addReveal(
    ".portfolio-feature__main",
    "scroll-reveal-scale",
    "reveal-delay-1"
);

addReveal(
    ".portfolio-feature__comparison",
    "scroll-reveal-right",
    "reveal-delay-2"
);


/* =========================================================
   SECTION 04 — MORE SELECTED WORK
========================================================= */

addReveal(
    ".more-work-label",
    "scroll-reveal-soft"
);


document
    .querySelectorAll(".selected-project")
    .forEach((project, index) => {

        project.classList.add(
            "scroll-reveal"
        );

        project.classList.add(
            `reveal-delay-${Math.min(index + 1, 4)}`
        );

        globalRevealItems.push(project);

    });


addReveal(
    ".more-projects",
    "scroll-reveal",
    "reveal-delay-4"
);


/* =========================================================
   SECTION 05 — MY PROCESS
========================================================= */

addReveal(
    ".process-strip-label",
    "scroll-reveal-soft"
);


document
    .querySelectorAll(".process-step")
    .forEach((step, index) => {

        step.classList.add(
            "scroll-reveal"
        );

        step.classList.add(
            `reveal-delay-${Math.min(index + 1, 5)}`
        );

        globalRevealItems.push(step);

    });


/* =========================================================
   SECTION 06 — ABOUT / EXPERTISE
========================================================= */

addReveal(
    ".about-copy",
    "scroll-reveal-left"
);

addReveal(
    ".about-visual",
    "scroll-reveal-scale",
    "reveal-delay-1"
);

addReveal(
    ".expertise-panel",
    "scroll-reveal-right",
    "reveal-delay-2"
);


/* =========================================================
   SECTION 07 — FINAL CTA + FOOTER
========================================================= */

addReveal(
    ".final-cta-copy",
    "scroll-reveal-left"
);

addReveal(
    ".final-cta-action",
    "scroll-reveal-right",
    "reveal-delay-1"
);

addReveal(
    ".site-footer",
    "scroll-reveal-soft",
    "reveal-delay-2"
);


/* =========================================================
   INTERSECTION OBSERVER
========================================================= */

const globalReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (
    "IntersectionObserver" in window &&
    !globalReducedMotion
) {

    const globalRevealObserver =
        new IntersectionObserver(

            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target
                            .classList
                            .add("is-visible");

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -7% 0px"
            }

        );


    globalRevealItems.forEach((item) => {

        globalRevealObserver.observe(item);

    });

}

else {

    globalRevealItems.forEach((item) => {

        item.classList.add(
            "is-visible"
        );

    });

}