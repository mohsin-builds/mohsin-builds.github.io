/**
 * Mohsin Builds — Home Interface
 *
 * Controls the interactive Developer OS experience:
 * window management, featured projects, terminal commands,
 * command palette, dock magnification and pointer depth.
 */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";


    /* =========================================================
       SELECTORS
    ========================================================= */

    const SELECTORS = {
        desktop: ".desktop",
        workspace: ".workspace",

        windows: ".os-window",
        openWindowButtons: "[data-open]",

        dock: "#osDock",
        dockItems: ".dock-item",

        commandOverlay: "#commandOverlay",
        commandInput: "#commandInput",
        commandResults: ".command-results > *",

        searchButton: "#searchButton",
        currentWorkspace: "#currentWorkspace",

        topDate: "#topDate",
        topTime: "#topTime",

        terminalInput: "#terminalInput",
        terminalOutput: "#terminalOutput",

        featuredTitle: "#featuredTitle",
        featuredDescription: "#featuredDescription",
        featuredStack: "#featuredStack",
        projectCounter: "#projectCounter",
        previousProject: "#previousProject",
        nextProject: "#nextProject"
    };


    /* =========================================================
       DOM HELPERS
    ========================================================= */

    const select = (
        selector,
        root = document
    ) =>
        root.querySelector(selector);


    const selectAll = (
        selector,
        root = document
    ) =>
        [
            ...root.querySelectorAll(selector)
        ];


    /* =========================================================
       DOM REFERENCES
    ========================================================= */

    const body =
        document.body;


    const desktop =
        select(
            SELECTORS.desktop
        );


    const workspace =
        select(
            SELECTORS.workspace
        );


    const windows =
        selectAll(
            SELECTORS.windows
        );


    const openWindowButtons =
        selectAll(
            SELECTORS.openWindowButtons
        );


    const dock =
        select(
            SELECTORS.dock
        );


    const dockItems =
        selectAll(
            SELECTORS.dockItems
        );


    const commandOverlay =
        select(
            SELECTORS.commandOverlay
        );


    const commandInput =
        select(
            SELECTORS.commandInput
        );


    const commandResults =
        selectAll(
            SELECTORS.commandResults
        );


    const searchButton =
        select(
            SELECTORS.searchButton
        );


    const currentWorkspace =
        select(
            SELECTORS.currentWorkspace
        );


    const topDate =
        select(
            SELECTORS.topDate
        );


    const topTime =
        select(
            SELECTORS.topTime
        );


    const terminalInput =
        select(
            SELECTORS.terminalInput
        );


    const terminalOutput =
        select(
            SELECTORS.terminalOutput
        );


    const featuredTitle =
        select(
            SELECTORS.featuredTitle
        );


    const featuredDescription =
        select(
            SELECTORS.featuredDescription
        );


    const featuredStack =
        select(
            SELECTORS.featuredStack
        );


    const projectCounter =
        select(
            SELECTORS.projectCounter
        );


    const previousProject =
        select(
            SELECTORS.previousProject
        );


    const nextProject =
        select(
            SELECTORS.nextProject
        );


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


    let highestZIndex =
        100;


    let paletteReturnFocus =
        null;


    /* =========================================================
       BOOT
    ========================================================= */

    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                () => {

                    body.classList.add(
                        "os-ready"
                    );

                }
            );

        }
    );


    /* =========================================================
       SYSTEM CLOCK
    ========================================================= */

    function updateClock() {

        const now =
            new Date();


        if (topTime) {

            topTime.textContent =
                now.toLocaleTimeString(
                    [],
                    {
                        hour: "2-digit",
                        minute: "2-digit"
                    }
                );

        }


        if (topDate) {

            topDate.textContent =
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
       WORKSPACE LABEL
    ========================================================= */

    function setWorkspaceLabel(
        label
    ) {

        if (!currentWorkspace) {
            return;
        }


        currentWorkspace.textContent =
            label;

    }


    /* =========================================================
       WINDOW FOCUS
    ========================================================= */

    function focusWindow(
        windowElement
    ) {

        if (!windowElement) {
            return;
        }


        windows.forEach(
            (item) => {

                item.classList.remove(
                    "is-focused"
                );

            }
        );


        highestZIndex +=
            1;


        windowElement.style.zIndex =
            String(
                highestZIndex
            );


        windowElement.classList.add(
            "is-focused"
        );

    }


    /* =========================================================
       WINDOW VISIBILITY
    ========================================================= */

    function closeWindow(
        windowElement
    ) {

        if (!windowElement) {
            return;
        }


        windowElement.classList.add(
            "is-hidden"
        );


        windowElement.classList.remove(
            "is-focused",
            "is-opening"
        );


        windowElement.setAttribute(
            "aria-hidden",
            "true"
        );


        if (
            windowElement.dataset.window ===
            "terminal"
        ) {

            setWorkspaceLabel(
                "Home"
            );

        }

    }


    function openWindow(
        name
    ) {

        const windowElement =
            select(
                `[data-window="${name}"]`
            );


        if (!windowElement) {
            return;
        }


        windowElement.classList.remove(
            "is-hidden",
            "is-minimized",
            "is-opening"
        );


        windowElement.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * A single layout read allows the opening animation
         * to restart after a previously closed window reopens.
         */
        void windowElement.offsetWidth;


        windowElement.classList.add(
            "is-opening"
        );


        focusWindow(
            windowElement
        );


        setWorkspaceLabel(
            name === "terminal"
                ? "Terminal"
                : "Home"
        );


        if (
            name === "terminal"
        ) {

            window.setTimeout(
                () => {

                    terminalInput
                        ?.focus();

                },
                120
            );

        }

    }


    /* =========================================================
       WINDOW MAXIMIZATION
    ========================================================= */

    function toggleMaximize(
        windowElement
    ) {

        if (!windowElement) {
            return;
        }


        windowElement.classList.toggle(
            "is-maximized"
        );


        windowElement.classList.remove(
            "is-minimized"
        );


        focusWindow(
            windowElement
        );

    }


    /* =========================================================
       WINDOW OPEN TRIGGERS
    ========================================================= */

    openWindowButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                (event) => {

                    const windowName =
                        button.dataset.open;


                    if (!windowName) {
                        return;
                    }


                    event.preventDefault();


                    openWindow(
                        windowName
                    );


                    closeCommandPalette({
                        restoreFocus: false
                    });

                }
            );

        }
    );


    /* =========================================================
       WINDOW CONTROLS
    ========================================================= */

    windows.forEach(
        (windowElement) => {

            windowElement.addEventListener(
                "pointerdown",
                () => {

                    focusWindow(
                        windowElement
                    );

                }
            );


            const closeButton =
                select(
                    '[data-action="close"]',
                    windowElement
                );


            const minimizeButton =
                select(
                    '[data-action="minimize"]',
                    windowElement
                );


            const maximizeButton =
                select(
                    '[data-action="maximize"]',
                    windowElement
                );


            const titleBar =
                select(
                    ".window-bar",
                    windowElement
                );


            closeButton
                ?.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();


                        closeWindow(
                            windowElement
                        );

                    }
                );


            minimizeButton
                ?.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();


                        windowElement
                            .classList
                            .toggle(
                                "is-minimized"
                            );


                        windowElement
                            .classList
                            .remove(
                                "is-maximized"
                            );


                        focusWindow(
                            windowElement
                        );

                    }
                );


            maximizeButton
                ?.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();


                        toggleMaximize(
                            windowElement
                        );

                    }
                );


            titleBar
                ?.addEventListener(
                    "dblclick",
                    (event) => {

                        if (
                            event.target.closest(
                                ".window-controls, a, button"
                            )
                        ) {

                            return;

                        }


                        toggleMaximize(
                            windowElement
                        );

                    }
                );


            enableDragging(
                windowElement
            );

        }
    );


    /* =========================================================
       WINDOW DRAGGING
    ========================================================= */

    function enableDragging(
        windowElement
    ) {

        const handle =
            select(
                ".drag-handle",
                windowElement
            );


        if (
            !handle ||
            !workspace
        ) {

            return;

        }


        let isDragging =
            false;


        let pointerStartX =
            0;


        let pointerStartY =
            0;


        let windowStartLeft =
            0;


        let windowStartTop =
            0;


        handle.addEventListener(
            "pointerdown",
            (event) => {

                /*
                 * Desktop dragging is intentionally disabled
                 * for touch/tablet layouts.
                 */

                if (
                    event.button !== 0
                ) {

                    return;

                }


                if (
                    event.target.closest(
                        ".window-controls, a, button"
                    )
                ) {

                    return;

                }


                if (
                    window.innerWidth <=
                    1220
                ) {

                    return;

                }


                if (
                    windowElement
                        .classList
                        .contains(
                            "is-maximized"
                        )
                ) {

                    return;

                }


                const workspaceRect =
                    workspace
                        .getBoundingClientRect();


                const windowRect =
                    windowElement
                        .getBoundingClientRect();


                isDragging =
                    true;


                pointerStartX =
                    event.clientX;


                pointerStartY =
                    event.clientY;


                windowStartLeft =
                    windowRect.left
                    -
                    workspaceRect.left;


                windowStartTop =
                    windowRect.top
                    -
                    workspaceRect.top;


                focusWindow(
                    windowElement
                );


                handle.setPointerCapture(
                    event.pointerId
                );

            }
        );


        handle.addEventListener(
            "pointermove",
            (event) => {

                if (!isDragging) {
                    return;
                }


                const workspaceRect =
                    workspace
                        .getBoundingClientRect();


                const maxLeft =
                    Math.max(
                        8,

                        workspaceRect.width
                        -
                        windowElement.offsetWidth
                        -
                        8
                    );


                const maxTop =
                    Math.max(
                        8,

                        workspaceRect.height
                        -
                        windowElement.offsetHeight
                        -
                        90
                    );


                const proposedLeft =
                    windowStartLeft
                    +
                    event.clientX
                    -
                    pointerStartX;


                const proposedTop =
                    windowStartTop
                    +
                    event.clientY
                    -
                    pointerStartY;


                const nextLeft =
                    Math.max(
                        8,

                        Math.min(
                            maxLeft,
                            proposedLeft
                        )
                    );


                const nextTop =
                    Math.max(
                        8,

                        Math.min(
                            maxTop,
                            proposedTop
                        )
                    );


                windowElement.style.left =
                    `${nextLeft}px`;


                windowElement.style.top =
                    `${nextTop}px`;


                windowElement.style.right =
                    "auto";

            }
        );


        function stopDragging(
            event
        ) {

            if (!isDragging) {
                return;
            }


            isDragging =
                false;


            if (
                handle.hasPointerCapture(
                    event.pointerId
                )
            ) {

                handle.releasePointerCapture(
                    event.pointerId
                );

            }

        }


        handle.addEventListener(
            "pointerup",
            stopDragging
        );


        handle.addEventListener(
            "pointercancel",
            stopDragging
        );

    }


    /* =========================================================
       FEATURED PROJECT DATA
    ========================================================= */

    const projects = [

        {
            title:
                "Product Opportunity Engine",

            description:
                "A decision-support system for discovering, evaluating and comparing product opportunities using structured market data.",

            stack: [
                "JavaScript",
                "Data Analysis",
                "APIs",
                "Product Research"
            ]
        },


        {
            title:
                "Website Cost Calculator",

            description:
                "An interactive business tool that helps companies understand website scope, required features and estimated project investment.",

            stack: [
                "HTML",
                "CSS",
                "JavaScript",
                "UX"
            ]
        },


        {
            title:
                "Mohsin Builds",

            description:
                "A developer-focused portfolio system built to showcase digital products, interface design, architecture and real-world work.",

            stack: [
                "HTML",
                "CSS",
                "JavaScript",
                "UI/UX"
            ]
        }

    ];


    let projectIndex =
        0;


    /* =========================================================
       FEATURED PROJECT RENDERING
    ========================================================= */

    function renderProject() {

        const project =
            projects[
                projectIndex
            ];


        if (!project) {
            return;
        }


        if (featuredTitle) {

            featuredTitle.textContent =
                project.title;

        }


        if (featuredDescription) {

            featuredDescription.textContent =
                project.description;

        }


        if (featuredStack) {

            const fragment =
                document
                    .createDocumentFragment();


            project.stack.forEach(
                (item) => {

                    const chip =
                        document
                            .createElement(
                                "span"
                            );


                    chip.textContent =
                        item;


                    fragment.appendChild(
                        chip
                    );

                }
            );


            featuredStack.replaceChildren(
                fragment
            );

        }


        if (projectCounter) {

            const current =
                String(
                    projectIndex + 1
                )
                    .padStart(
                        2,
                        "0"
                    );


            const total =
                String(
                    projects.length
                )
                    .padStart(
                        2,
                        "0"
                    );


            projectCounter.textContent =
                `${current} / ${total}`;

        }

    }


    previousProject
        ?.addEventListener(
            "click",
            () => {

                projectIndex =
                    (
                        projectIndex
                        -
                        1
                        +
                        projects.length
                    )
                    %
                    projects.length;


                renderProject();

            }
        );


    nextProject
        ?.addEventListener(
            "click",
            () => {

                projectIndex =
                    (
                        projectIndex
                        +
                        1
                    )
                    %
                    projects.length;


                renderProject();

            }
        );


    renderProject();


    /* =========================================================
       TERMINAL COMMANDS
    ========================================================= */

    const terminalCommands = {

        whoami:
            "Mohsin Iqbal — designer, developer and product builder.",


        projects:
            "Product Opportunity Engine | Website Cost Calculator | Mohsin Builds | Mohsin Labs",


        skills:
            "Web Design | Development | WordPress | E-Commerce | AI | Automation | Product Thinking",


        labs:
            "Mohsin Labs — my product and experiment lab for useful digital products, AI tools and systems.",


        contact:
            "Email: mohsinbuilds@gmail.com",


        help:
            "Commands: whoami, projects, skills, labs, contact, clear"

    };


    /* =========================================================
       TERMINAL OUTPUT
    ========================================================= */

    function appendTerminalPrompt(
        command
    ) {

        if (!terminalOutput) {
            return;
        }


        const line =
            document
                .createElement(
                    "p"
                );


        const prompt =
            document
                .createElement(
                    "strong"
                );


        prompt.textContent =
            "mohsin@builds:~$";


        line.append(
            prompt,

            document.createTextNode(
                ` ${command}`
            )
        );


        terminalOutput.appendChild(
            line
        );

    }


    function appendTerminalResponse(
        message
    ) {

        if (!terminalOutput) {
            return;
        }


        const line =
            document
                .createElement(
                    "p"
                );


        line.textContent =
            message;


        terminalOutput.appendChild(
            line
        );

    }


    terminalInput
        ?.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key !==
                    "Enter"
                ) {

                    return;

                }


                const command =
                    terminalInput
                        .value
                        .trim()
                        .toLowerCase();


                if (!command) {
                    return;
                }


                appendTerminalPrompt(
                    command
                );


                if (
                    command ===
                    "clear"
                ) {

                    terminalOutput
                        ?.replaceChildren();

                }

                else {

                    appendTerminalResponse(
                        terminalCommands[
                            command
                        ]
                        ??
                        `Command not found: ${command}. Type "help".`
                    );

                }


                terminalInput.value =
                    "";


                if (terminalOutput) {

                    terminalOutput.scrollTop =
                        terminalOutput.scrollHeight;

                }

            }
        );


    /* =========================================================
       COMMAND PALETTE FILTER
    ========================================================= */

    function filterCommandResults(
        query
    ) {

        const normalizedQuery =
            query
                .trim()
                .toLowerCase();


        commandResults.forEach(
            (item) => {

                const isMatch =
                    item
                        .textContent
                        .toLowerCase()
                        .includes(
                            normalizedQuery
                        );


                item.hidden =
                    !isMatch;

            }
        );

    }


    /* =========================================================
       COMMAND PALETTE VISIBILITY
    ========================================================= */

    function openCommandPalette() {

        if (!commandOverlay) {
            return;
        }


        paletteReturnFocus =
            document.activeElement;


        commandOverlay
            .classList
            .remove(
                "is-hidden"
            );


        commandOverlay.setAttribute(
            "aria-hidden",
            "false"
        );


        searchButton
            ?.setAttribute(
                "aria-expanded",
                "true"
            );


        window.setTimeout(
            () => {

                commandInput
                    ?.focus();

            },
            40
        );

    }


    function closeCommandPalette(
        {
            restoreFocus = true
        } = {}
    ) {

        if (
            !commandOverlay ||
            commandOverlay
                .classList
                .contains(
                    "is-hidden"
                )
        ) {

            return;

        }


        commandOverlay
            .classList
            .add(
                "is-hidden"
            );


        commandOverlay.setAttribute(
            "aria-hidden",
            "true"
        );


        searchButton
            ?.setAttribute(
                "aria-expanded",
                "false"
            );


        if (commandInput) {

            commandInput.value =
                "";


            filterCommandResults(
                ""
            );

        }


        if (
            restoreFocus
            &&
            paletteReturnFocus
            instanceof HTMLElement
            &&
            paletteReturnFocus.isConnected
        ) {

            paletteReturnFocus.focus();

        }


        paletteReturnFocus =
            null;

    }


    /* =========================================================
       COMMAND PALETTE EVENTS
    ========================================================= */

    searchButton
        ?.addEventListener(
            "click",
            openCommandPalette
        );


    commandOverlay
        ?.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    commandOverlay
                ) {

                    closeCommandPalette();

                }

            }
        );


    commandInput
        ?.addEventListener(
            "input",
            () => {

                filterCommandResults(
                    commandInput.value
                );

            }
        );


    /* =========================================================
       GLOBAL KEYBOARD CONTROLS
    ========================================================= */

    window.addEventListener(
        "keydown",
        (event) => {

            const commandShortcut =
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


            if (commandShortcut) {

                event.preventDefault();


                if (
                    commandOverlay
                        ?.classList
                        .contains(
                            "is-hidden"
                        )
                ) {

                    openCommandPalette();

                }

                else {

                    closeCommandPalette();

                }


                return;

            }


            const paletteIsOpen =
                Boolean(
                    commandOverlay
                    &&
                    !commandOverlay
                        .classList
                        .contains(
                            "is-hidden"
                        )
                );


            /*
             * Command palette navigation shortcuts
             * match the labels shown in the interface.
             */

            if (
                paletteIsOpen
                &&
                event.altKey
            ) {

                const navigationShortcuts = {

                    p:
                        "projects.html",

                    a:
                        "about.html",

                    r:
                        "architecture.html",

                    l:
                        "labs.html",

                    c:
                        "contact.html"

                };


                const shortcut =
                    event.key
                        .toLowerCase();


                if (
                    shortcut ===
                    "t"
                ) {

                    event.preventDefault();


                    openWindow(
                        "terminal"
                    );


                    closeCommandPalette({
                        restoreFocus: false
                    });


                    return;

                }


                if (
                    navigationShortcuts[
                        shortcut
                    ]
                ) {

                    event.preventDefault();


                    window.location.href =
                        navigationShortcuts[
                            shortcut
                        ];


                    return;

                }

            }


            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            if (paletteIsOpen) {

                closeCommandPalette();

                return;

            }


            const terminalWindow =
                select(
                    '[data-window="terminal"]'
                );


            if (
                terminalWindow
                &&
                !terminalWindow
                    .classList
                    .contains(
                        "is-hidden"
                    )
            ) {

                closeWindow(
                    terminalWindow
                );

            }

        }
    );


    /* =========================================================
       POINTER INTERACTIONS
    ========================================================= */

    if (
        !prefersReducedMotion
        &&
        hasFinePointer
    ) {

        enableWindowHighlights();

        enableDockMagnification();

        enableDesktopDepth();

    }


    /* =========================================================
       WINDOW POINTER HIGHLIGHT
    ========================================================= */

    function enableWindowHighlights() {

        windows.forEach(
            (windowElement) => {

                let animationFrame =
                    0;


                let pointerX =
                    0;


                let pointerY =
                    0;


                windowElement.addEventListener(
                    "pointermove",
                    (event) => {

                        const rect =
                            windowElement
                                .getBoundingClientRect();


                        pointerX =
                            event.clientX
                            -
                            rect.left;


                        pointerY =
                            event.clientY
                            -
                            rect.top;


                        if (animationFrame) {
                            return;
                        }


                        animationFrame =
                            window.requestAnimationFrame(
                                () => {

                                    windowElement
                                        .style
                                        .setProperty(
                                            "--mx",
                                            `${pointerX}px`
                                        );


                                    windowElement
                                        .style
                                        .setProperty(
                                            "--my",
                                            `${pointerY}px`
                                        );


                                    animationFrame =
                                        0;

                                }
                            );

                    }
                );


                windowElement.addEventListener(
                    "pointerleave",
                    () => {

                        windowElement
                            .style
                            .setProperty(
                                "--mx",
                                "50%"
                            );


                        windowElement
                            .style
                            .setProperty(
                                "--my",
                                "50%"
                            );

                    }
                );

            }
        );

    }


    /* =========================================================
       DOCK MAGNIFICATION
    ========================================================= */

    function enableDockMagnification() {

        if (!dock) {
            return;
        }


        let animationFrame =
            0;


        let pointerX =
            0;


        dock.addEventListener(
            "pointermove",
            (event) => {

                pointerX =
                    event.clientX;


                if (animationFrame) {
                    return;
                }


                animationFrame =
                    window.requestAnimationFrame(
                        () => {

                            dockItems.forEach(
                                (item) => {

                                    const rect =
                                        item
                                            .getBoundingClientRect();


                                    const centerX =
                                        rect.left
                                        +
                                        rect.width / 2;


                                    const distance =
                                        Math.abs(
                                            pointerX
                                            -
                                            centerX
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
                                        influence
                                        *
                                        .34;


                                    item
                                        .style
                                        .setProperty(
                                            "--dock-scale",
                                            scale
                                                .toFixed(
                                                    3
                                                )
                                        );

                                }
                            );


                            animationFrame =
                                0;

                        }
                    );

            }
        );


        dock.addEventListener(
            "pointerleave",
            () => {

                dockItems.forEach(
                    (item) => {

                        item
                            .style
                            .setProperty(
                                "--dock-scale",
                                "1"
                            );

                    }
                );

            }
        );

    }


    /* =========================================================
       DESKTOP POINTER DEPTH
    ========================================================= */

    function enableDesktopDepth() {

        if (!desktop) {
            return;
        }


        let animationFrame =
            0;


        let depthX =
            0;


        let depthY =
            0;


        function commitDepth() {

            desktop
                .style
                .setProperty(
                    "--mb-depth-x",
                    `${depthX.toFixed(2)}px`
                );


            desktop
                .style
                .setProperty(
                    "--mb-depth-y",
                    `${depthY.toFixed(2)}px`
                );


            animationFrame =
                0;

        }


        document.addEventListener(
            "pointermove",
            (event) => {

                const normalizedX =
                    event.clientX
                    /
                    window.innerWidth
                    -
                    .5;


                const normalizedY =
                    event.clientY
                    /
                    window.innerHeight
                    -
                    .5;


                depthX =
                    normalizedX
                    *
                    4;


                depthY =
                    normalizedY
                    *
                    3;


                if (!animationFrame) {

                    animationFrame =
                        window
                            .requestAnimationFrame(
                                commitDepth
                            );

                }

            }
        );


        document
            .documentElement
            .addEventListener(
                "mouseleave",
                () => {

                    depthX =
                        0;


                    depthY =
                        0;


                    if (!animationFrame) {

                        animationFrame =
                            window
                                .requestAnimationFrame(
                                    commitDepth
                                );

                    }

                }
            );

    }


    /* =========================================================
       INITIAL WINDOW FOCUS
    ========================================================= */

    window.setTimeout(
        () => {

            focusWindow(
                select(
                    '[data-window="featured"]'
                )
            );

        },
        700
    );

});