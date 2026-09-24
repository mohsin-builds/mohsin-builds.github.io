document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    /* =========================================================
       DOM HELPERS
    ========================================================= */

    const $ = (
        selector,
        scope = document
    ) =>
        scope.querySelector(selector);


    const $$ = (
        selector,
        scope = document
    ) =>
        [...scope.querySelectorAll(selector)];


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const elements = {

        topDate:
            $("#topDate"),

        topTime:
            $("#topTime"),


        searchInput:
            $("#aboutSearchInput"),

        searchStatus:
            $("#aboutSearchStatus"),

        mainScroll:
            $("#aboutMainScroll"),

        searchableSections:
            $$("[data-search-section]"),


        terminal:
            $("#aboutTerminal"),

        terminalClose:
            $("#terminalClose"),

        terminalInput:
            $("#terminalInput"),

        terminalOutput:
            $("#terminalOutput"),

        terminalButtons:
            $$("[data-open-terminal]"),


        dock:
            $("#osDock"),

        dockItems:
            $$(".dock-item")

    };


    /* =========================================================
       ENVIRONMENT
    ========================================================= */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    const hasFinePointer =
        window.matchMedia(
            "(pointer: fine)"
        ).matches;


    /* =========================================================
       STATE
    ========================================================= */

    const state = {

        terminalReturnFocus:
            null,

        searchQuery:
            "",

        searchMatches:
            [],

        searchIndex:
            -1

    };


    /* =========================================================
       CLOCK
    ========================================================= */

    function updateClock() {

        const now =
            new Date();


        if (elements.topTime) {

            elements.topTime.textContent =
                now.toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        }


        if (elements.topDate) {

            elements.topDate.textContent =
                now.toLocaleDateString(
                    [],
                    {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                );

        }

    }


    updateClock();


    window.setInterval(
        updateClock,
        30_000
    );


    /* =========================================================
       ABOUT SEARCH
    ========================================================= */

    function normalizeSearchText(
        value
    ) {

        return value
            .toLowerCase()
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    }


    function clearSearchHighlight() {

        elements.searchableSections.forEach(
            section => {

                section.classList.remove(
                    "about-search-match"
                );

            }
        );

    }


    function resetSearch() {

        clearSearchHighlight();


        state.searchQuery =
            "";


        state.searchMatches =
            [];


        state.searchIndex =
            -1;


        if (elements.searchStatus) {

            elements.searchStatus.textContent =
                "IDENTITY SYSTEM READY";

        }

    }


    function getSearchLabel(
        section
    ) {

        const heading =
            section.querySelector(
                "h1, h2, h3, .module-label, .profile-label"
            );


        if (heading) {

            return heading
                .textContent
                .trim();

        }


        const keywords =
            section.dataset.searchSection
                ?.split(" ")
                .slice(0, 3)
                .join(" ");


        return keywords
            ||
            "About";

    }


    function buildSearchMatches(
        query
    ) {

        const normalizedQuery =
            normalizeSearchText(
                query
            );


        return elements.searchableSections.filter(
            section => {

                const keywords =
                    normalizeSearchText(
                        section.dataset.searchSection
                        ||
                        ""
                    );


                const visibleText =
                    normalizeSearchText(
                        section.textContent
                    );


                return (
                    keywords.includes(
                        normalizedQuery
                    )

                    ||

                    visibleText.includes(
                        normalizedQuery
                    )
                );

            }
        );

    }


    function scrollToSearchMatch(
        section
    ) {

        const behavior =
            prefersReducedMotion
                ?
                "auto"
                :
                "smooth";


        const isInsideCenter =
            elements.mainScroll
            ?.contains(
                section
            );


        /*
         * On desktop, only the center column owns an internal
         * scrollbar. Side panels remain intentionally static.
         */
        if (
            isInsideCenter
            &&
            window.innerWidth >
                1050
            &&
            elements.mainScroll
        ) {

            const scrollRect =
                elements.mainScroll
                    .getBoundingClientRect();


            const sectionRect =
                section
                    .getBoundingClientRect();


            const destination =
                elements.mainScroll.scrollTop
                +
                sectionRect.top
                -
                scrollRect.top
                -
                20;


            elements.mainScroll.scrollTo(
                {
                    top:
                        Math.max(
                            0,
                            destination
                        ),

                    behavior
                }
            );


            return;

        }


        /*
         * Tablet and mobile layouts flow vertically,
         * so normal document scrolling is appropriate.
         */
        if (
            window.innerWidth <=
                1050
        ) {

            section.scrollIntoView(
                {
                    behavior,
                    block:
                        "center"
                }
            );

        }

    }


    function runAboutSearch() {

        if (!elements.searchInput) {
            return;
        }


        const query =
            elements.searchInput.value
                .trim();


        if (!query) {

            resetSearch();

            return;

        }


        const normalizedQuery =
            normalizeSearchText(
                query
            );


        /*
         * A new query builds a new result set.
         * Repeated Enter presses cycle through matches.
         */
        if (
            normalizedQuery !==
            state.searchQuery
        ) {

            state.searchQuery =
                normalizedQuery;


            state.searchMatches =
                buildSearchMatches(
                    query
                );


            state.searchIndex =
                -1;

        }


        clearSearchHighlight();


        if (
            state.searchMatches.length ===
            0
        ) {

            if (elements.searchStatus) {

                elements.searchStatus.textContent =
                    `NO MATCH — ${query.toUpperCase()}`;

            }


            return;

        }


        state.searchIndex =
            (
                state.searchIndex
                +
                1
            )
            %
            state.searchMatches.length;


        const match =
            state.searchMatches[
                state.searchIndex
            ];


        match.classList.add(
            "about-search-match"
        );


        scrollToSearchMatch(
            match
        );


        if (elements.searchStatus) {

            elements.searchStatus.textContent =
                `${String(state.searchIndex + 1).padStart(2, "0")} / ` +
                `${String(state.searchMatches.length).padStart(2, "0")} — ` +
                `${getSearchLabel(match).toUpperCase()}`;

        }

    }


    elements.searchInput
        ?.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Enter"
                ) {

                    return;

                }


                event.preventDefault();


                runAboutSearch();

            }
        );


    elements.searchInput
        ?.addEventListener(
            "input",
            () => {

                clearSearchHighlight();


                state.searchQuery =
                    "";


                state.searchMatches =
                    [];


                state.searchIndex =
                    -1;


                if (!elements.searchStatus) {
                    return;
                }


                if (
                    elements.searchInput.value
                        .trim()
                ) {

                    elements.searchStatus.textContent =
                        "PRESS ENTER TO SEARCH";

                }

                else {

                    elements.searchStatus.textContent =
                        "IDENTITY SYSTEM READY";

                }

            }
        );


    /* =========================================================
       TERMINAL VISIBILITY
    ========================================================= */

    function setTerminalButtonsState(
        expanded
    ) {

        elements.terminalButtons.forEach(
            button => {

                button.setAttribute(
                    "aria-expanded",
                    String(
                        expanded
                    )
                );

            }
        );

    }


    function openTerminal() {

        if (!elements.terminal) {
            return;
        }


        state.terminalReturnFocus =
            document.activeElement;


        elements.terminal.classList.remove(
            "is-hidden"
        );


        elements.terminal.setAttribute(
            "aria-hidden",
            "false"
        );


        setTerminalButtonsState(
            true
        );


        window.setTimeout(
            () => {

                elements.terminalInput
                    ?.focus();

            },
            60
        );

    }


    function closeTerminal() {

        if (!elements.terminal) {
            return;
        }


        elements.terminal.classList.add(
            "is-hidden"
        );


        elements.terminal.setAttribute(
            "aria-hidden",
            "true"
        );


        setTerminalButtonsState(
            false
        );


        if (
            state.terminalReturnFocus
            instanceof HTMLElement
            &&
            state.terminalReturnFocus.isConnected
        ) {

            state.terminalReturnFocus.focus();

        }


        state.terminalReturnFocus =
            null;

    }


    elements.terminalButtons.forEach(
        button => {

            button.setAttribute(
                "aria-expanded",
                "false"
            );


            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const isClosed =
                        elements.terminal
                            ?.classList
                            .contains(
                                "is-hidden"
                            );


                    if (isClosed) {

                        openTerminal();

                    }

                    else {

                        closeTerminal();

                    }

                }
            );

        }
    );


    elements.terminalClose
        ?.addEventListener(
            "click",
            closeTerminal
        );


    /* =========================================================
       TERMINAL OUTPUT
    ========================================================= */

    function appendTerminalPrompt(
        command
    ) {

        if (!elements.terminalOutput) {
            return;
        }


        const line =
            document.createElement(
                "p"
            );


        const prompt =
            document.createElement(
                "strong"
            );


        prompt.textContent =
            "mohsin@builds:~/about$";


        line.append(
            prompt,

            document.createTextNode(
                ` ${command}`
            )
        );


        elements.terminalOutput.appendChild(
            line
        );

    }


    function printTerminal(
        message
    ) {

        if (!elements.terminalOutput) {
            return;
        }


        const line =
            document.createElement(
                "p"
            );


        line.textContent =
            message;


        elements.terminalOutput.appendChild(
            line
        );


        elements.terminalOutput.scrollTop =
            elements.terminalOutput.scrollHeight;

    }


    /* =========================================================
       TERMINAL COMMANDS
    ========================================================= */

    function handleTerminalCommand(
        command
    ) {

        const normalized =
            command
                .trim()
                .toLowerCase();


        switch (normalized) {

            case "clear":

                elements.terminalOutput
                    ?.replaceChildren();

                break;


            case "whoami":

                printTerminal(
                    "Mohsin Iqbal — designer, developer & product builder."
                );

                break;


            case "skills":

                printTerminal(
                    "HTML · CSS · JavaScript · WordPress · Figma · Shopify · WooCommerce · AI Tools · Automation · SEO"
                );

                break;


            case "projects":

                window.location.href =
                    "projects.html";

                break;


            case "architecture":

                window.location.href =
                    "architecture.html";

                break;


            case "labs":

                window.location.href =
                    "labs.html";

                break;


            case "contact":

                window.location.href =
                    "contact.html";

                break;


            case "email":

                window.location.href =
                    "mailto:mohsinbuilds@gmail.com";

                break;


            case "home":

                window.location.href =
                    "index.html";

                break;


            case "help":

                printTerminal(
                    "whoami · skills · projects · architecture · labs · contact · email · home · clear"
                );

                break;


            default:

                printTerminal(
                    `Command not found: ${command}. Type "help".`
                );

        }

    }


    elements.terminalInput
        ?.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Enter"
                ) {

                    return;

                }


                const command =
                    elements.terminalInput.value
                        .trim();


                if (!command) {
                    return;
                }


                appendTerminalPrompt(
                    command
                );


                handleTerminalCommand(
                    command
                );


                elements.terminalInput.value =
                    "";

            }
        );


    /* =========================================================
       GLOBAL KEYBOARD CONTROLS
    ========================================================= */

    window.addEventListener(
        "keydown",
        event => {

            const searchShortcut =
                (
                    event.ctrlKey
                    ||
                    event.metaKey
                )
                &&
                event.key
                    .toLowerCase()
                ===
                "k";


            if (searchShortcut) {

                event.preventDefault();


                elements.searchInput
                    ?.focus();


                elements.searchInput
                    ?.select();


                return;

            }


            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            const terminalIsOpen =
                Boolean(
                    elements.terminal
                    &&
                    !elements.terminal
                        .classList
                        .contains(
                            "is-hidden"
                        )
                );


            if (terminalIsOpen) {

                closeTerminal();

                return;

            }


            if (
                elements.searchInput
                &&
                (
                    elements.searchInput.value
                        .trim()

                    ||

                    state.searchMatches.length
                )
            ) {

                elements.searchInput.value =
                    "";


                resetSearch();


                elements.searchInput.blur();

            }

        }
    );


    /* =========================================================
       DOCK MAGNIFICATION
    ========================================================= */

    function enableDockMagnification() {

        if (
            !elements.dock
            ||
            !hasFinePointer
            ||
            prefersReducedMotion
        ) {

            return;

        }


        let frame =
            0;


        let pointerX =
            0;


        function updateDock() {

            elements.dockItems.forEach(
                item => {

                    const rect =
                        item.getBoundingClientRect();


                    const center =
                        rect.left
                        +
                        rect.width / 2;


                    const distance =
                        Math.abs(
                            pointerX
                            -
                            center
                        );


                    const influence =
                        Math.max(
                            0,
                            1
                            -
                            distance / 92
                        );


                    const scale =
                        1
                        +
                        influence * .34;


                    item.style.setProperty(
                        "--dock-scale",
                        scale.toFixed(3)
                    );

                }
            );


            frame =
                0;

        }


        elements.dock.addEventListener(
            "pointermove",
            event => {

                pointerX =
                    event.clientX;


                if (frame) {
                    return;
                }


                frame =
                    window.requestAnimationFrame(
                        updateDock
                    );

            }
        );


        elements.dock.addEventListener(
            "pointerleave",
            () => {

                if (frame) {

                    window.cancelAnimationFrame(
                        frame
                    );


                    frame =
                        0;

                }


                elements.dockItems.forEach(
                    item => {

                        item.style.setProperty(
                            "--dock-scale",
                            "1"
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       INITIALIZATION
    ========================================================= */

    setTerminalButtonsState(
        false
    );


    enableDockMagnification();

});