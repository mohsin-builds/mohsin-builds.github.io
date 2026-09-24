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
       PRODUCT DATA
    ========================================================= */

    const products = {

        engine: {

            index:
                "01 / 02",

            type:
                "DECISION ENGINE",

            title:
                "Product Opportunity Engine",

            description:
                "Evaluate product opportunities before launch using structured profit, pricing, marketplace and risk signals.",

            image:
                "assets/product-opportunity-engine.webp",

            tags: [
                "Product Research",
                "Analytics",
                "E-Commerce",
                "Decision Tool"
            ],

            keywords: [
                "product",
                "opportunity",
                "research",
                "analytics",
                "ecommerce",
                "marketplace",
                "pricing",
                "profit",
                "risk",
                "decision engine"
            ],

            projectUrl:
                "projects.html#product-opportunity-engine"

        },


        calculator: {

            index:
                "02 / 02",

            type:
                "BUSINESS TOOL",

            title:
                "Website Cost Calculator",

            description:
                "Estimate website pricing from business requirements while turning planning into a practical project qualification experience.",

            image:
                "assets/website-cost-calculator.webp",

            tags: [
                "Web App",
                "Calculator",
                "UI/UX",
                "Lead Generation"
            ],

            keywords: [
                "website",
                "cost",
                "calculator",
                "pricing",
                "estimate",
                "web app",
                "business tool",
                "planning",
                "lead generation"
            ],

            projectUrl:
                "projects.html#website-cost-calculator"

        }

    };


    const productOrder = [
        "engine",
        "calculator"
    ];


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const elements = {

        topDate:
            $("#topDate"),

        topTime:
            $("#topTime"),


        cards:
            $$(".lab-product-card"),

        productIndex:
            $("#productIndex"),

        productType:
            $("#productType"),

        productTitle:
            $("#productTitle"),

        productDescription:
            $("#productDescription"),

        inspectorImage:
            $("#inspectorImage"),

        inspectorTags:
            $("#inspectorTags"),

        inspectorProjectLink:
            $("#inspectorProjectLink"),

        selectedProductStatus:
            $("#selectedProductStatus"),


        searchInput:
            $("#labsSearchInput"),

        searchStatus:
            $("#labsSearchStatus"),

        centerScroll:
            $("#labsCenterScroll"),

        searchableSections:
            $$("[data-search-section]"),


        terminal:
            $("#labsTerminal"),

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

        selectedProduct:
            "engine",

        terminalReturnFocus:
            null,

        searchQuery:
            "",

        searchResults:
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
       PRODUCT TAGS
    ========================================================= */

    function renderProductTags(
        tags
    ) {

        if (!elements.inspectorTags) {
            return;
        }


        const fragment =
            document.createDocumentFragment();


        tags.forEach(
            tagName => {

                const tag =
                    document.createElement(
                        "span"
                    );


                tag.textContent =
                    tagName;


                fragment.appendChild(
                    tag
                );

            }
        );


        elements.inspectorTags.replaceChildren(
            fragment
        );

    }


    /* =========================================================
       PRODUCT SELECTION
    ========================================================= */

    function selectProduct(
        key,
        {
            focusCard = false
        } = {}
    ) {

        const product =
            products[
                key
            ];


        if (!product) {
            return;
        }


        state.selectedProduct =
            key;


        elements.cards.forEach(
            card => {

                const selected =
                    card.dataset.product ===
                    key;


                card.classList.toggle(
                    "is-selected",
                    selected
                );


                card.setAttribute(
                    "aria-pressed",
                    String(
                        selected
                    )
                );

            }
        );


        if (elements.productIndex) {

            elements.productIndex.textContent =
                product.index;

        }


        if (elements.productType) {

            elements.productType.textContent =
                product.type;

        }


        if (elements.productTitle) {

            elements.productTitle.textContent =
                product.title;

        }


        if (elements.productDescription) {

            elements.productDescription.textContent =
                product.description;

        }


        if (elements.inspectorImage) {

            elements.inspectorImage.src =
                product.image;


            elements.inspectorImage.alt =
                `${product.title} preview`;

        }


        if (elements.inspectorProjectLink) {

            elements.inspectorProjectLink.href =
                product.projectUrl;

        }


        if (elements.selectedProductStatus) {

            elements.selectedProductStatus.textContent =
                `${product.title} selected`;

        }


        renderProductTags(
            product.tags
        );


        if (focusCard) {

            const selectedCard =
                $(
                    `[data-product="${key}"]`
                );


            selectedCard?.focus();

        }

    }


    /* =========================================================
       PRODUCT CARD INTERACTION
    ========================================================= */

    elements.cards.forEach(
        card => {

            card.addEventListener(
                "click",
                () => {

                    clearSearchVisuals();


                    selectProduct(
                        card.dataset.product
                    );

                }
            );


            card.addEventListener(
                "keydown",
                event => {

                    const currentKey =
                        card.dataset.product;


                    const currentIndex =
                        productOrder.indexOf(
                            currentKey
                        );


                    if (
                        event.key ===
                        "Enter"

                        ||

                        event.key ===
                        " "
                    ) {

                        event.preventDefault();


                        clearSearchVisuals();


                        selectProduct(
                            currentKey
                        );


                        return;

                    }


                    if (
                        ![
                            "ArrowLeft",
                            "ArrowRight",
                            "ArrowUp",
                            "ArrowDown"
                        ].includes(
                            event.key
                        )
                    ) {

                        return;

                    }


                    event.preventDefault();


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
                            productOrder.length
                        )
                        %
                        productOrder.length;


                    selectProduct(
                        productOrder[
                            nextIndex
                        ],
                        {
                            focusCard:
                                true
                        }
                    );

                }
            );

        }
    );


    /* =========================================================
       SEARCH HELPERS
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


    function getProductSearchText(
        product
    ) {

        return normalizeSearchText(
            [
                product.type,
                product.title,
                product.description,
                ...product.tags,
                ...product.keywords
            ]
                .join(" ")
        );

    }


    function clearSearchVisuals() {

        $$(".labs-search-match")
            .forEach(
                element => {

                    element.classList.remove(
                        "labs-search-match"
                    );

                }
            );

    }


    function resetSearch() {

        clearSearchVisuals();


        state.searchQuery =
            "";


        state.searchResults =
            [];


        state.searchIndex =
            -1;


        if (elements.searchStatus) {

            elements.searchStatus.textContent =
                "MOHSIN LABS × MOHSIN BUILDS";

        }

    }


    /* =========================================================
       SEARCH INDEX
    ========================================================= */

    function buildSearchResults(
        query
    ) {

        const normalizedQuery =
            normalizeSearchText(
                query
            );


        const results =
            [];


        /*
         * Product matches receive priority because the
         * inspector can immediately show the selected product.
         */

        Object.entries(
            products
        )
            .forEach(
                ([key, product]) => {

                    if (
                        getProductSearchText(
                            product
                        )
                            .includes(
                                normalizedQuery
                            )
                    ) {

                        results.push(
                            {
                                type:
                                    "product",

                                key,

                                label:
                                    product.title,

                                target:
                                    $(
                                        `[data-product="${key}"]`
                                    )
                            }
                        );

                    }

                }
            );


        /*
         * Broader venture sections allow searches such as
         * experiments, AI systems, process, validation or venture.
         */

        elements.searchableSections.forEach(
            section => {

                const isProductSection =
                    section.classList.contains(
                        "labs-products"
                    );


                if (isProductSection) {
                    return;
                }


                const searchableText =
                    normalizeSearchText(
                        [
                            section.dataset.searchSection
                            ||
                            "",

                            section.textContent
                        ]
                            .join(" ")
                    );


                if (
                    !searchableText.includes(
                        normalizedQuery
                    )
                ) {

                    return;

                }


                const heading =
                    section.querySelector(
                        "h1, h2, h3, .panel-eyebrow, .section-kicker"
                    );


                results.push(
                    {
                        type:
                            "section",

                        label:
                            heading
                                ?.textContent
                                .trim()
                            ||
                            "Mohsin Labs",

                        target:
                            section
                    }
                );

            }
        );


        return results;

    }


    /* =========================================================
       SEARCH SCROLLING
    ========================================================= */

    function revealSearchTarget(
        result
    ) {

        const target =
            result.target;


        if (!target) {
            return;
        }


        clearSearchVisuals();


        target.classList.add(
            "labs-search-match"
        );


        if (
            result.type ===
            "product"
        ) {

            selectProduct(
                result.key
            );

        }


        const insideCenter =
            elements.centerScroll
                ?.contains(
                    target
                );


        /*
         * Desktop keeps center content independently scrollable.
         */

        if (
            insideCenter
            &&
            window.innerWidth >
                1050
            &&
            elements.centerScroll
        ) {

            const centerRect =
                elements.centerScroll
                    .getBoundingClientRect();


            const targetRect =
                target
                    .getBoundingClientRect();


            const destination =
                elements.centerScroll.scrollTop
                +
                targetRect.top
                -
                centerRect.top
                -
                30;


            elements.centerScroll.scrollTo(
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


            return;

        }


        /*
         * Tablet and mobile use normal document flow.
         * Static desktop side panels do not need forced scrolling.
         */

        if (
            window.innerWidth <=
                1050
        ) {

            target.scrollIntoView(
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


    /* =========================================================
       SEARCH EXECUTION
    ========================================================= */

    function runLabsSearch() {

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


            state.searchResults =
                buildSearchResults(
                    query
                );


            state.searchIndex =
                -1;

        }


        if (
            state.searchResults.length ===
            0
        ) {

            clearSearchVisuals();


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
            state.searchResults.length;


        const result =
            state.searchResults[
                state.searchIndex
            ];


        revealSearchTarget(
            result
        );


        if (elements.searchStatus) {

            elements.searchStatus.textContent =
                `${String(state.searchIndex + 1).padStart(2, "0")} / ` +
                `${String(state.searchResults.length).padStart(2, "0")} — ` +
                `${result.label.toUpperCase()}`;

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


                runLabsSearch();

            }
        );


    elements.searchInput
        ?.addEventListener(
            "input",
            () => {

                clearSearchVisuals();


                state.searchQuery =
                    "";


                state.searchResults =
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
                        "MOHSIN LABS × MOHSIN BUILDS";

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
            "mohsin@builds:~/labs$";


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
       TERMINAL PRODUCT SELECTION
    ========================================================= */

    function selectProductFromTerminal(
        key
    ) {

        if (!products[key]) {
            return;
        }


        closeTerminal();


        clearSearchVisuals();


        selectProduct(
            key
        );


        const card =
            $(
                `[data-product="${key}"]`
            );


        if (!card) {
            return;
        }


        window.setTimeout(
            () => {

                if (
                    window.innerWidth >
                        1050
                    &&
                    elements.centerScroll
                ) {

                    const centerRect =
                        elements.centerScroll
                            .getBoundingClientRect();


                    const cardRect =
                        card
                            .getBoundingClientRect();


                    elements.centerScroll.scrollTo(
                        {
                            top:
                                Math.max(
                                    0,

                                    elements.centerScroll.scrollTop
                                    +
                                    cardRect.top
                                    -
                                    centerRect.top
                                    -
                                    30
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

                    card.scrollIntoView(
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
                    "Mohsin Labs — product and innovation venture founded by Mohsin Iqbal through Mohsin Builds."
                );

                break;


            case "products":

                printTerminal(
                    "Product Opportunity Engine · Website Cost Calculator"
                );

                break;


            case "engine":

                selectProductFromTerminal(
                    "engine"
                );

                break;


            case "calculator":

                selectProductFromTerminal(
                    "calculator"
                );

                break;


            case "enter":

                window.open(
                    "https://mohsinlabs.com/",
                    "_blank",
                    "noopener,noreferrer"
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


            case "about":

                window.location.href =
                    "about.html";

                break;


            case "contact":

                window.location.href =
                    "contact.html";

                break;


            case "home":

                window.location.href =
                    "index.html";

                break;


            case "help":

                printTerminal(
                    "whoami · products · engine · calculator · enter · projects · architecture · about · contact · home · clear"
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

                    state.searchResults.length
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


    selectProduct(
        "engine"
    );


    enableDockMagnification();

});