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
       CONSTANTS
    ========================================================= */

    const CONTACT_EMAIL =
        "mohsinbuilds@gmail.com";


    function trackAnalyticsEvent(
        eventName,
        parameters = {}
    ) {

        if (
            typeof window.gtag !==
            "function"
        ) {

            return;

        }


        window.gtag(
            "event",
            eventName,
            parameters
        );

    }


    const serviceOrder = [
        "Website",
        "E-Commerce",
        "Automation",
        "Digital Product"
    ];


    const serviceKeywords = {

        Website: [
            "website",
            "web",
            "portfolio",
            "business site",
            "redesign"
        ],

        "E-Commerce": [
            "ecommerce",
            "e-commerce",
            "store",
            "shop",
            "selling",
            "shopify",
            "woocommerce"
        ],

        Automation: [
            "automation",
            "workflow",
            "ai",
            "system",
            "process"
        ],

        "Digital Product": [
            "digital product",
            "product",
            "app",
            "tool",
            "platform",
            "software"
        ]

    };


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const elements = {

        topDate:
            $("#topDate"),

        topTime:
            $("#topTime"),


        serviceOptions:
            $$(".service-option"),

        projectType:
            $("#projectType"),

        contactStatus:
            $("#contactStatus"),


        copyEmail:
            $("#copyEmail"),

        copyFeedback:
            $("#copyFeedback"),


        projectForm:
            $("#projectForm"),

        clientName:
            $("#clientName"),

        clientEmail:
            $("#clientEmail"),

        projectName:
            $("#projectName"),

        projectBudget:
            $("#projectBudget"),

        projectTimeline:
            $("#projectTimeline"),

        projectMessage:
            $("#projectMessage"),


        searchInput:
            $("#contactSearchInput"),

        searchStatus:
            $("#contactSearchStatus"),

        centerScroll:
            $("#contactCenterScroll"),

        searchableSections:
            $$("[data-search-section]"),


        terminal:
            $("#contactTerminal"),

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

        selectedService:
            "Website",

        terminalReturnFocus:
            null,

        searchQuery:
            "",

        searchResults:
            [],

        searchIndex:
            -1,

        copyResetTimer:
            null

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
                        hour:
                            "2-digit",

                        minute:
                            "2-digit"
                    }
                );

        }


        if (elements.topDate) {

            elements.topDate.textContent =
                now.toLocaleDateString(
                    [],
                    {
                        weekday:
                            "short",

                        day:
                            "2-digit",

                        month:
                            "short",

                        year:
                            "numeric"
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
       SERVICE SELECTION
    ========================================================= */

    function getServiceOption(
        service
    ) {

        return elements.serviceOptions.find(
            option =>
                option.dataset.service ===
                service
        );

    }


    function selectService(
        service,
        {
            focusOption = false
        } = {}
    ) {

        if (
            !serviceOrder.includes(
                service
            )
        ) {

            return;

        }


        state.selectedService =
            service;


        elements.serviceOptions.forEach(
            option => {

                const selected =
                    option.dataset.service ===
                    service;


                option.classList.toggle(
                    "is-selected",
                    selected
                );


                option.setAttribute(
                    "aria-pressed",
                    String(
                        selected
                    )
                );

            }
        );


        if (elements.projectType) {

            elements.projectType.value =
                service;

        }


        if (elements.contactStatus) {

            elements.contactStatus.textContent =
                `${service} project selected`;

        }


        if (focusOption) {

            getServiceOption(
                service
            )
                ?.focus();

        }

    }


    elements.serviceOptions.forEach(
        option => {

            option.addEventListener(
                "click",
                () => {

                    clearSearchVisuals();


                    selectService(
                        option.dataset.service
                    );

                }
            );


            option.addEventListener(
                "keydown",
                event => {

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


                    const currentIndex =
                        serviceOrder.indexOf(
                            option.dataset.service
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
                            serviceOrder.length
                        )
                        %
                        serviceOrder.length;


                    selectService(
                        serviceOrder[
                            nextIndex
                        ],
                        {
                            focusOption:
                                true
                        }
                    );

                }
            );

        }
    );


    /* =========================================================
       EMAIL COPY
    ========================================================= */

    function resetCopyFeedback() {

        if (!elements.copyFeedback) {
            return;
        }


        elements.copyFeedback.textContent =
            "Click to copy";

    }


    async function copyTextToClipboard(
        text
    ) {

        if (
            navigator.clipboard
            &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                text
            );


            return true;

        }


        const textarea =
            document.createElement(
                "textarea"
            );


        textarea.value =
            text;


        textarea.setAttribute(
            "readonly",
            ""
        );


        textarea.style.position =
            "fixed";


        textarea.style.opacity =
            "0";


        textarea.style.pointerEvents =
            "none";


        document.body.appendChild(
            textarea
        );


        textarea.select();


        let copied =
            false;


        try {

            copied =
                document.execCommand(
                    "copy"
                );

        }

        finally {

            textarea.remove();

        }


        return copied;

    }


    elements.copyEmail
        ?.addEventListener(
            "click",
            async () => {

                trackAnalyticsEvent(
                    "email_click",
                    {
                        contact_method:
                            "copy_email",

                        source:
                            "contact_page"
                    }
                );


                if (
                    state.copyResetTimer
                ) {

                    window.clearTimeout(
                        state.copyResetTimer
                    );

                }


                try {

                    const copied =
                        await copyTextToClipboard(
                            CONTACT_EMAIL
                        );


                    if (elements.copyFeedback) {

                        elements.copyFeedback.textContent =
                            copied
                                ?
                                "Email copied ✓"
                                :
                                CONTACT_EMAIL;

                    }

                }

                catch {

                    if (elements.copyFeedback) {

                        elements.copyFeedback.textContent =
                            CONTACT_EMAIL;

                    }

                }


                state.copyResetTimer =
                    window.setTimeout(
                        resetCopyFeedback,
                        2200
                    );

            }
        );


    /* =========================================================
       PROJECT FORM
    ========================================================= */

    elements.projectForm
        ?.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                if (
                    !elements.projectForm
                        .checkValidity()
                ) {

                    elements.projectForm
                        .reportValidity();


                    return;

                }


                const submitButton =
                    elements.projectForm
                        .querySelector(
                            ".send-project"
                        );


                const originalButtonHTML =
                    submitButton
                        ?.innerHTML
                    ||
                    "";


                const formData =
                    new FormData(
                        elements.projectForm
                    );


                const service =
                    elements.projectType
                        ?.value
                    ||
                    state.selectedService;


                formData.set(
                    "_subject",
                    `Mohsin Builds Project Inquiry — ${service}`
                );


                if (submitButton) {

                    submitButton.disabled =
                        true;


                    submitButton.setAttribute(
                        "aria-busy",
                        "true"
                    );


                    submitButton.textContent =
                        "Sending...";

                }


                if (
                    elements.contactStatus
                ) {

                    elements.contactStatus.textContent =
                        "Sending project brief...";

                }


                try {

                    const response =
                        await fetch(
                            elements.projectForm.action,
                            {
                                method:
                                    "POST",

                                body:
                                    formData,

                                headers: {
                                    Accept:
                                        "application/json"
                                }
                            }
                        );


                    if (
                        !response.ok
                    ) {

                        throw new Error(
                            "Formspree submission failed"
                        );

                    }


                    trackAnalyticsEvent(
                        "generate_lead",
                        {
                            lead_source:
                                "mohsin_builds_contact_form",

                            project_type:
                                service
                        }
                    );


                    elements.projectForm
                        .reset();


                    selectService(
                        "Website"
                    );


                    if (
                        elements.contactStatus
                    ) {

                        elements.contactStatus.textContent =
                            "✓ Project brief sent. I'll get back to you soon.";

                    }

                }

                catch (error) {

                    console.error(
                        "Project form submission failed:",
                        error
                    );


                    if (
                        elements.contactStatus
                    ) {

                        elements.contactStatus.textContent =
                            "Unable to send right now. Please try again.";

                    }

                }

                finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;


                        submitButton.removeAttribute(
                            "aria-busy"
                        );


                        submitButton.innerHTML =
                            originalButtonHTML;

                    }

                }

            }
        );


    /* =========================================================
       CONTACT ANALYTICS
    ========================================================= */

    $$(
        'a[href*="wa.me/"]'
    )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        trackAnalyticsEvent(
                            "whatsapp_click",
                            {
                                contact_method:
                                    "whatsapp",

                                source:
                                    "contact_page"
                            }
                        );

                    }
                );

            }
        );


    $$(
        'a[href^="mailto:"]'
    )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        trackAnalyticsEvent(
                            "email_click",
                            {
                                contact_method:
                                    "mailto",

                                source:
                                    "contact_page"
                            }
                        );

                    }
                );

            }
        );


    /* =========================================================
       FORM FOCUS
    ========================================================= */

    function focusProjectForm() {

        const behavior =
            prefersReducedMotion
                ?
                "auto"
                :
                "smooth";


        if (
            window.innerWidth >
                1050
            &&
            elements.centerScroll
        ) {

            elements.centerScroll.scrollTo(
                {
                    top:
                        0,

                    behavior
                }
            );

        }

        else {

            elements.projectForm
                ?.scrollIntoView(
                    {
                        behavior,

                        block:
                            "center"
                    }
                );

        }


        window.setTimeout(
            () => {

                elements.clientName
                    ?.focus();

            },
            prefersReducedMotion
                ?
                0
                :
                320
        );

    }


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


    function clearSearchVisuals() {

        $$(".contact-search-match")
            .forEach(
                element => {

                    element.classList.remove(
                        "contact-search-match"
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
                "PROJECT CHANNEL READY";

        }

    }


    function serviceMatchesQuery(
        service,
        query
    ) {

        const searchable =
            normalizeSearchText(
                [
                    service,
                    ...(
                        serviceKeywords[
                            service
                        ]
                        ||
                        []
                    )
                ]
                    .join(" ")
            );


        return searchable.includes(
            query
        );

    }


    function getSectionLabel(
        section
    ) {

        const heading =
            section.querySelector(
                "h1, h2, h3, .panel-eyebrow, .section-eyebrow"
            );


        return heading
            ?.textContent
            .replace(
                /\s+/g,
                " "
            )
            .trim()
            ||
            "Contact";

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
         * Project types are indexed first because selecting
         * one can immediately configure the project brief.
         */

        serviceOrder.forEach(
            service => {

                if (
                    !serviceMatchesQuery(
                        service,
                        normalizedQuery
                    )
                ) {

                    return;

                }


                results.push(
                    {
                        type:
                            "service",

                        service,

                        label:
                            service,

                        target:
                            getServiceOption(
                                service
                            )
                    }
                );

            }
        );


        /*
         * Broader sections cover contact, email, collaboration,
         * project process, professional opportunities and form fields.
         */

        elements.searchableSections.forEach(
            section => {

                const searchable =
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
                    !searchable.includes(
                        normalizedQuery
                    )
                ) {

                    return;

                }


                results.push(
                    {
                        type:
                            "section",

                        label:
                            getSectionLabel(
                                section
                            ),

                        target:
                            section
                    }
                );

            }
        );


        return results;

    }


    /* =========================================================
       SEARCH REVEAL
    ========================================================= */

    function revealSearchResult(
        result
    ) {

        if (
            !result
            ||
            !result.target
        ) {

            return;

        }


        clearSearchVisuals();


        result.target.classList.add(
            "contact-search-match"
        );


        if (
            result.type ===
            "service"
        ) {

            selectService(
                result.service
            );

        }


        const insideCenter =
            elements.centerScroll
                ?.contains(
                    result.target
                );


        const behavior =
            prefersReducedMotion
                ?
                "auto"
                :
                "smooth";


        /*
         * Desktop keeps the middle project-intake column
         * independently scrollable.
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
                result.target
                    .getBoundingClientRect();


            const destination =
                elements.centerScroll.scrollTop
                +
                targetRect.top
                -
                centerRect.top
                -
                25;


            elements.centerScroll.scrollTo(
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
         * Tablet and mobile use the normal document flow.
         * Desktop side panels already remain visible.
         */

        if (
            window.innerWidth <=
                1050
        ) {

            result.target.scrollIntoView(
                {
                    behavior,

                    block:
                        "center"
                }
            );

        }

    }


    /* =========================================================
       SEARCH EXECUTION
    ========================================================= */

    function runContactSearch() {

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


        revealSearchResult(
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


                runContactSearch();

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


                elements.searchStatus.textContent =
                    elements.searchInput.value
                        .trim()
                        ?
                        "PRESS ENTER TO SEARCH"
                        :
                        "PROJECT CHANNEL READY";

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
            "mohsin@builds:~/contact$";


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
       TERMINAL SERVICE COMMANDS
    ========================================================= */

    function selectServiceFromTerminal(
        service
    ) {

        closeTerminal();


        clearSearchVisuals();


        selectService(
            service
        );


        window.setTimeout(
            focusProjectForm,
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


            case "contact":

                printTerminal(
                    `Email: ${CONTACT_EMAIL}`
                );

                break;


            case "brief":

                closeTerminal();


                focusProjectForm();

                break;


            case "website":

                selectServiceFromTerminal(
                    "Website"
                );

                break;


            case "ecommerce":

            case "e-commerce":

                selectServiceFromTerminal(
                    "E-Commerce"
                );

                break;


            case "automation":

                selectServiceFromTerminal(
                    "Automation"
                );

                break;


            case "product":

                selectServiceFromTerminal(
                    "Digital Product"
                );

                break;


            case "email":

                trackAnalyticsEvent(
                    "email_click",
                    {
                        contact_method:
                            "terminal_email",

                        source:
                            "contact_terminal"
                    }
                );


                window.location.href =
                    `mailto:${CONTACT_EMAIL}`;

                break;


            case "projects":

                window.location.href =
                    "projects.html";

                break;


            case "about":

                window.location.href =
                    "about.html";

                break;


            case "architecture":

                window.location.href =
                    "architecture.html";

                break;


            case "labs":

                window.location.href =
                    "labs.html";

                break;


            case "home":

                window.location.href =
                    "index.html";

                break;


            case "help":

                printTerminal(
                    "brief · website · ecommerce · automation · product · email · contact · projects · about · architecture · labs · home · clear"
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


    selectService(
        "Website"
    );


    enableDockMagnification();

});