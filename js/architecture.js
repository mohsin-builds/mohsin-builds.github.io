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
       ARCHITECTURE DATA
    ========================================================= */

    const stageData = {

        research: {

            number:
                "01 / 06",

            category:
                "DISCOVERY SYSTEM",

            title:
                "Research",

            description:
                "Understand the real problem before building anything — business goals, user needs, competitors, constraints and opportunities.",

            output:
                "Clear problem + informed direction",

            tools: [
                "Research",
                "Market Analysis",
                "User Needs",
                "Strategy"
            ],

            keywords: [
                "discover",
                "discovery",
                "audience",
                "goal",
                "market",
                "analysis",
                "problem",
                "strategy"
            ],

            clarity:
                "88%",

            build:
                "NEXT",

            icon:
                "fa-solid fa-magnifying-glass-chart"

        },


        design: {

            number:
                "02 / 06",

            category:
                "EXPERIENCE SYSTEM",

            title:
                "Design",

            description:
                "Translate strategy into clear structure, user journeys, interfaces and visual systems before development begins.",

            output:
                "Clear UX + polished interface",

            tools: [
                "Figma",
                "UX",
                "UI Systems",
                "Wireframes"
            ],

            keywords: [
                "interface",
                "visual",
                "experience",
                "structure",
                "journey",
                "wireframe",
                "ui",
                "ux"
            ],

            clarity:
                "94%",

            build:
                "YES",

            icon:
                "fa-solid fa-pen-ruler"

        },


        development: {

            number:
                "03 / 06",

            category:
                "BUILD SYSTEM",

            title:
                "Development",

            description:
                "Turn approved design into a responsive, maintainable and production-ready digital experience.",

            output:
                "Working digital product",

            tools: [
                "HTML",
                "CSS",
                "JavaScript",
                "WordPress"
            ],

            keywords: [
                "build",
                "code",
                "frontend",
                "website",
                "responsive",
                "cms",
                "production"
            ],

            clarity:
                "96%",

            build:
                "LIVE",

            icon:
                "fa-solid fa-code"

        },


        product: {

            number:
                "04 / 06",

            category:
                "PRODUCT SYSTEM",

            title:
                "Product",

            description:
                "Connect interface, business logic and user value into a complete product instead of a collection of disconnected pages.",

            output:
                "Useful product experience",

            tools: [
                "Product Thinking",
                "E-Commerce",
                "Systems",
                "Validation"
            ],

            keywords: [
                "package",
                "business logic",
                "ecommerce",
                "validation",
                "value",
                "system"
            ],

            clarity:
                "91%",

            build:
                "READY",

            icon:
                "fa-solid fa-cube"

        },


        automation: {

            number:
                "05 / 06",

            category:
                "AUTOMATION SYSTEM",

            title:
                "Automation",

            description:
                "Remove unnecessary manual work by connecting repeatable processes, AI-assisted workflows and useful business automations.",

            output:
                "Less repetitive work",

            tools: [
                "AI Tools",
                "Workflows",
                "APIs",
                "Automation"
            ],

            keywords: [
                "scale",
                "workflow",
                "ai",
                "api",
                "process",
                "automate",
                "integration"
            ],

            clarity:
                "89%",

            build:
                "SCALE",

            icon:
                "fa-solid fa-gears"

        },


        impact: {

            number:
                "06 / 06",

            category:
                "IMPACT SYSTEM",

            title:
                "Impact",

            description:
                "Launch, observe real usage and improve the system based on performance, feedback and actual business outcomes.",

            output:
                "Measured real-world improvement",

            tools: [
                "Analytics",
                "SEO",
                "Optimization",
                "Iteration"
            ],

            keywords: [
                "launch",
                "improve",
                "deploy",
                "feedback",
                "performance",
                "data",
                "results",
                "outcome"
            ],

            clarity:
                "100%",

            build:
                "SHIPPED",

            icon:
                "fa-solid fa-arrow-trend-up"

        },


        core: {

            number:
                "CORE",

            category:
                "MOHSIN BUILDS SYSTEM",

            title:
                "System Core",

            description:
                "The connected operating model behind Mohsin Builds — combining research, design, development, product thinking, automation and real-world improvement.",

            output:
                "Idea → useful working system",

            tools: [
                "Design",
                "Development",
                "Product",
                "Automation"
            ],

            keywords: [
                "mohsin builds",
                "architecture",
                "system",
                "connected",
                "operating model",
                "core"
            ],

            clarity:
                "100%",

            build:
                "ONLINE",

            icon:
                "fa-solid fa-layer-group"

        }

    };


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const elements = {

        topDate:
            $("#topDate"),

        topTime:
            $("#topTime"),


        stageNumber:
            $("#stageNumber"),

        stageIcon:
            $("#stageIcon"),

        stageCategory:
            $("#stageCategory"),

        stageTitle:
            $("#stageTitle"),

        stageDescription:
            $("#stageDescription"),

        stageOutput:
            $("#stageOutput span"),

        stageTools:
            $("#stageTools"),

        signalClarity:
            $("#signalClarity"),

        signalBuild:
            $("#signalBuild"),

        selectedStatus:
            $("#selectedStatus"),

        stageNodes:
            $$("[data-stage]"),


        searchInput:
            $("#architectureSearchInput"),

        searchStatus:
            $("#architectureSearchStatus"),

        architectureScroll:
            $("#architectureCenterScroll"),


        terminal:
            $("#architectureTerminal"),

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

        selectedStage:
            "design",

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
       CHIP RENDERING
    ========================================================= */

    function renderTools(
        tools
    ) {

        if (!elements.stageTools) {
            return;
        }


        const fragment =
            document.createDocumentFragment();


        tools.forEach(
            tool => {

                const tag =
                    document.createElement(
                        "span"
                    );


                tag.textContent =
                    tool;


                fragment.appendChild(
                    tag
                );

            }
        );


        elements.stageTools.replaceChildren(
            fragment
        );

    }


    /* =========================================================
       MODULE SELECTION
    ========================================================= */

    function selectStage(
        stageName,
        {
            focusNode = false
        } = {}
    ) {

        const stage =
            stageData[
                stageName
            ];


        if (!stage) {
            return;
        }


        state.selectedStage =
            stageName;


        elements.stageNodes.forEach(
            node => {

                const active =
                    node.dataset.stage ===
                    stageName;


                node.classList.toggle(
                    "is-active",
                    active
                );


                node.setAttribute(
                    "aria-pressed",
                    String(
                        active
                    )
                );

            }
        );


        if (elements.stageNumber) {

            elements.stageNumber.textContent =
                stage.number;

        }


        if (elements.stageIcon) {

            elements.stageIcon.className =
                stage.icon;

        }


        if (elements.stageCategory) {

            elements.stageCategory.textContent =
                stage.category;

        }


        if (elements.stageTitle) {

            elements.stageTitle.textContent =
                stage.title;

        }


        if (elements.stageDescription) {

            elements.stageDescription.textContent =
                stage.description;

        }


        if (elements.stageOutput) {

            elements.stageOutput.textContent =
                stage.output;

        }


        if (elements.signalClarity) {

            elements.signalClarity.textContent =
                stage.clarity;

        }


        if (elements.signalBuild) {

            elements.signalBuild.textContent =
                stage.build;

        }


        if (elements.selectedStatus) {

            elements.selectedStatus.textContent =
                `${stage.title} module selected`;

        }


        renderTools(
            stage.tools
        );


        if (focusNode) {

            const node =
                $(
                    `[data-stage="${stageName}"]`
                );


            node?.focus();

        }

    }


    /* =========================================================
       MODULE INTERACTION
    ========================================================= */

    elements.stageNodes.forEach(
        node => {

            node.addEventListener(
                "click",
                () => {

                    clearSearchVisuals();


                    selectStage(
                        node.dataset.stage
                    );

                }
            );

        }
    );


    /* =========================================================
       KEYBOARD MODULE NAVIGATION
    ========================================================= */

    const navigationOrder = [
        "research",
        "design",
        "development",
        "product",
        "automation",
        "impact",
        "core"
    ];


    elements.stageNodes.forEach(
        node => {

            node.addEventListener(
                "keydown",
                event => {

                    if (
                        ![
                            "ArrowRight",
                            "ArrowDown",
                            "ArrowLeft",
                            "ArrowUp"
                        ].includes(
                            event.key
                        )
                    ) {

                        return;

                    }


                    event.preventDefault();


                    const currentIndex =
                        navigationOrder.indexOf(
                            node.dataset.stage
                        );


                    if (
                        currentIndex ===
                        -1
                    ) {

                        return;

                    }


                    const direction =
                        (
                            event.key ===
                            "ArrowRight"

                            ||

                            event.key ===
                            "ArrowDown"
                        )
                            ?
                            1
                            :
                            -1;


                    const nextIndex =
                        (
                            currentIndex
                            +
                            direction
                            +
                            navigationOrder.length
                        )
                        %
                        navigationOrder.length;


                    selectStage(
                        navigationOrder[
                            nextIndex
                        ],
                        {
                            focusNode:
                                true
                        }
                    );

                }
            );

        }
    );


    /* =========================================================
       ARCHITECTURE SEARCH
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


    function getStageSearchText(
        stage
    ) {

        return normalizeSearchText(
            [
                stage.title,
                stage.category,
                stage.description,
                stage.output,
                stage.clarity,
                stage.build,
                ...stage.tools,
                ...stage.keywords
            ]
                .join(" ")
        );

    }


    function buildSearchMatches(
        query
    ) {

        const normalizedQuery =
            normalizeSearchText(
                query
            );


        return Object.entries(
            stageData
        )
            .filter(
                ([, stage]) =>

                    getStageSearchText(
                        stage
                    )
                        .includes(
                            normalizedQuery
                        )
            )
            .map(
                ([stageName]) =>
                    stageName
            );

    }


    function clearSearchVisuals() {

        elements.stageNodes.forEach(
            node => {

                node.classList.remove(
                    "architecture-search-match"
                );

            }
        );

    }


    function resetSearch() {

        clearSearchVisuals();


        state.searchQuery =
            "";


        state.searchMatches =
            [];


        state.searchIndex =
            -1;


        if (elements.searchStatus) {

            elements.searchStatus.textContent =
                "BUILD SYSTEM READY";

        }

    }


    function revealStage(
        stageName
    ) {

        const node =
            $(
                `[data-stage="${stageName}"]`
            );


        if (!node) {
            return;
        }


        node.classList.add(
            "architecture-search-match"
        );


        selectStage(
            stageName
        );


        /*
         * Desktop keeps the system map inside the center
         * scroll region. Mobile/tablet use normal page flow.
         */
        if (
            window.innerWidth >
                1050
            &&
            elements.architectureScroll
        ) {

            const scrollRect =
                elements.architectureScroll
                    .getBoundingClientRect();


            const nodeRect =
                node
                    .getBoundingClientRect();


            const destination =
                elements.architectureScroll.scrollTop
                +
                nodeRect.top
                -
                scrollRect.top
                -
                140;


            elements.architectureScroll.scrollTo(
                {
                    top:
                        Math.max(
                            0,
                            destination
                        ),

                    behavior:
                        prefersReducedMotion
                            ?
                            "auto"
                            :
                            "smooth"
                }
            );

        }

        else {

            node.scrollIntoView(
                {
                    behavior:
                        prefersReducedMotion
                            ?
                            "auto"
                            :
                            "smooth",

                    block:
                        "center"
                }
            );

        }

    }


    function runArchitectureSearch() {

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


        clearSearchVisuals();


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


        const stageName =
            state.searchMatches[
                state.searchIndex
            ];


        revealStage(
            stageName
        );


        const stage =
            stageData[
                stageName
            ];


        if (elements.searchStatus) {

            elements.searchStatus.textContent =
                `${String(state.searchIndex + 1).padStart(2, "0")} / ` +
                `${String(state.searchMatches.length).padStart(2, "0")} — ` +
                `${stage.title.toUpperCase()}`;

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


                runArchitectureSearch();

            }
        );


    elements.searchInput
        ?.addEventListener(
            "input",
            () => {

                clearSearchVisuals();


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
                        "BUILD SYSTEM READY";

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

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    const terminalClosed =
                        elements.terminal
                            ?.classList
                            .contains(
                                "is-hidden"
                            );


                    if (terminalClosed) {

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
            "mohsin@builds:~/architecture$";


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

    function selectStageFromTerminal(
        stageName
    ) {

        const stage =
            stageData[
                stageName
            ];


        if (!stage) {
            return false;
        }


        closeTerminal();


        clearSearchVisuals();


        selectStage(
            stageName
        );


        const node =
            $(
                `[data-stage="${stageName}"]`
            );


        if (node) {

            window.setTimeout(
                () => {

                    if (
                        window.innerWidth <=
                        1050
                    ) {

                        node.scrollIntoView(
                            {
                                behavior:
                                    prefersReducedMotion
                                        ?
                                        "auto"
                                        :
                                        "smooth",

                                block:
                                    "center"
                            }
                        );

                    }

                },
                80
            );

        }


        return true;

    }


    function handleTerminalCommand(
        command
    ) {

        const normalized =
            command
                .trim()
                .toLowerCase();


        if (
            normalized ===
            "clear"
        ) {

            elements.terminalOutput
                ?.replaceChildren();


            return;

        }


        if (
            normalized ===
            "system"
        ) {

            printTerminal(
                "Research → Design → Development → Product → Automation → Impact"
            );


            return;

        }


        if (
            [
                "research",
                "design",
                "development",
                "product",
                "automation",
                "impact",
                "core"
            ].includes(
                normalized
            )
        ) {

            selectStageFromTerminal(
                normalized
            );


            return;

        }


        if (
            normalized ===
            "projects"
        ) {

            window.location.href =
                "projects.html";


            return;

        }


        if (
            normalized ===
            "about"
        ) {

            window.location.href =
                "about.html";


            return;

        }


        if (
            normalized ===
            "labs"
        ) {

            window.location.href =
                "labs.html";


            return;

        }


        if (
            normalized ===
            "contact"
        ) {

            window.location.href =
                "contact.html";


            return;

        }


        if (
            normalized ===
            "home"
        ) {

            window.location.href =
                "index.html";


            return;

        }


        if (
            normalized ===
            "help"
        ) {

            printTerminal(
                "system · research · design · development · product · automation · impact · core · projects · about · labs · contact · home · clear"
            );


            return;

        }


        printTerminal(
            `Command not found: ${command}. Type "help".`
        );

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


            const terminalOpen =
                Boolean(
                    elements.terminal
                    &&
                    !elements.terminal
                        .classList
                        .contains(
                            "is-hidden"
                        )
                );


            if (terminalOpen) {

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


    selectStage(
        "design"
    );


    enableDockMagnification();

});