document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       PROJECT DATA
    ========================================================= */

    const projects = [
        {
            id: "product-opportunity-engine",
            title: "Product Opportunity Engine",
            category: "tools",
            categoryLabel: "Business Tool",
            icon: "fa-chart-column",

            cover:
                "assets/projects/product-opportunity-engine/cover.webp",

            preview:
                "assets/projects/product-opportunity-engine/preview-01.webp",

            gallery: [
                "assets/projects/product-opportunity-engine/preview-01.webp",
                "assets/projects/product-opportunity-engine/preview-02.webp",
                "assets/projects/product-opportunity-engine/preview-03.webp"
            ],

            description:
                "A decision-support system for evaluating product opportunities, pricing room, marketplace economics, risk and potential profitability before launch.",

            short:
                "Evaluate product opportunities using real profit, pricing and risk signals before launch.",

            stack: [
                "JavaScript",
                "Data Analysis",
                "Product Research",
                "Decision Tool"
            ],

            keywords: [
                "E-Commerce",
                "Marketplace",
                "Product Analysis"
            ],

            status: "Live",

            role:
                "Product Builder",

            liveUrl:
                "https://mohsinbuilds.com/product-opportunity-engine/"
        },


        {
            id: "website-cost-calculator",
            title: "Website Cost Calculator",
            category: "tools",
            categoryLabel: "Business Tool",
            icon: "fa-calculator",

            cover:
                "assets/projects/website-cost-calculator/cover.webp",

            preview:
                "assets/projects/website-cost-calculator/preview-01.webp",

            gallery: [
                "assets/projects/website-cost-calculator/preview-01.webp",
                "assets/projects/website-cost-calculator/preview-02.webp",
                "assets/projects/website-cost-calculator/preview-03.webp"
            ],

            description:
                "A smart business tool that estimates website pricing from business type, scope and feature requirements while turning planning into a practical lead-generation experience.",

            short:
                "Interactive website pricing tool built for clearer planning and faster project qualification.",

            stack: [
                "Web App",
                "Calculator",
                "UI/UX",
                "Lead Generation"
            ],

            keywords: [
                "Web",
                "Website",
                "Business Planning"
            ],

            status: "Live",

            role:
                "Designer & Developer",

            liveUrl:
                "https://mohsinbuilds.com/website-cost-calculator/"
        },


        {
            id: "mohsin-labs",
            title: "Mohsin Labs",
            category: "venture",
            categoryLabel: "Product Venture",
            icon: "fa-flask-vial",

            cover:
                "assets/projects/mohsin-labs/cover.webp",

            preview:
                "assets/projects/mohsin-labs/preview-01.webp",

            gallery: [
                "assets/projects/mohsin-labs/preview-01.webp",
                "assets/projects/mohsin-labs/preview-02.webp",
                "assets/projects/mohsin-labs/preview-03.webp"
            ],

            description:
                "Mohsin Labs is my technology and product venture for building useful digital tools, experimental systems and products around real-world problems.",

            short:
                "My product venture for useful digital tools, AI systems and experimental products.",

            stack: [
                "Product Design",
                "AI",
                "Business Tools",
                "Innovation"
            ],

            keywords: [
                "Labs",
                "Product Venture",
                "Experimental Systems"
            ],

            status: "Active",

            role:
                "Founder & Product Builder",

            liveUrl:
                "https://mohsinlabs.com/"
        },


        {
            id: "mohsinbuilds",
            title: "Mohsin Builds Developer OS",
            category: "systems",
            categoryLabel: "Portfolio System",
            icon: "fa-desktop",

            cover:
                "assets/projects/mohsinbuilds/cover.webp",

            preview:
                "assets/projects/mohsinbuilds/preview-01.webp",

            gallery: [
                "assets/projects/mohsinbuilds/preview-01.webp",
                "assets/projects/mohsinbuilds/preview-02.webp",
                "assets/projects/mohsinbuilds/preview-03.webp"
            ],

            description:
                "An interactive portfolio environment designed as a functional developer operating system, combining product storytelling, project exploration and desktop-inspired UX.",

            short:
                "Interactive portfolio OS combining design, development and product storytelling.",

            stack: [
                "HTML",
                "CSS",
                "JavaScript",
                "UX Systems"
            ],

            keywords: [
                "Web",
                "Portfolio",
                "Interface",
                "Developer OS"
            ],

            status: "Active",

            role:
                "Designer & Developer",

            liveUrl:
                "https://mohsinbuilds.com/"
        }
    ];


    /* =========================================================
       DOM
    ========================================================= */

    const $ = (
        selector,
        root = document
    ) =>
        root.querySelector(selector);


    const $$ = (
        selector,
        root = document
    ) =>
        [...root.querySelectorAll(selector)];


    const elements = {

        desktop:
            $("#desktop"),


        projectGrid:
            $("#projectGrid"),

        projectBrowser:
            $("#projectBrowser"),

        projectSearchInput:
            $("#projectSearchInput"),

        topSearchButton:
            $("#topSearchButton"),

        categoryButtons:
            $$(".category-item"),

        viewButtons:
            $$(".view-button"),

        currentFolderTitle:
            $("#currentFolderTitle"),

        appProjectCount:
            $("#appProjectCount"),

        emptyState:
            $("#emptyState"),

        sortButton:
            $("#sortButton"),


        inspectorIndex:
            $("#inspectorIndex"),

        inspectorImage:
            $("#inspectorImage"),

        inspectorCategory:
            $("#inspectorCategory"),

        inspectorTitle:
            $("#inspectorTitle"),

        inspectorDescription:
            $("#inspectorDescription"),

        inspectorStack:
            $("#inspectorStack"),

        inspectorStatus:
            $("#inspectorStatus"),

        inspectorRole:
            $("#inspectorRole"),

        openProjectButton:
            $("#openProjectButton"),

        liveProjectLink:
            $("#liveProjectLink"),

        statusSelected:
            $("#statusSelected"),


        viewerBackdrop:
            $("#viewerBackdrop"),

        projectViewer:
            $("#projectViewer"),

        viewerClose:
            $("#viewerClose"),

        viewerCloseDot:
            $("#viewerCloseDot"),

        viewerTitle:
            $("#viewerTitle"),

        viewerCategory:
            $("#viewerCategory"),

        viewerProjectTitle:
            $("#viewerProjectTitle"),

        viewerDescription:
            $("#viewerDescription"),

        viewerStack:
            $("#viewerStack"),

        viewerStatus:
            $("#viewerStatus"),

        viewerRole:
            $("#viewerRole"),

        viewerOpenLink:
            $("#viewerOpenLink"),

        viewerProjectImage:
            $("#viewerProjectImage"),

        viewerPrevImage:
            $("#viewerPrevImage"),

        viewerNextImage:
            $("#viewerNextImage"),

        viewerImageCounter:
            $("#viewerImageCounter"),


        topDate:
            $("#topDate"),

        topTime:
            $("#topTime"),


        terminal:
            $("#projectsTerminal"),

        terminalClose:
            $("#terminalClose"),

        terminalInput:
            $("#terminalInput"),

        terminalOutput:
            $("#terminalOutput"),

        terminalOpenButtons:
            $$("[data-open-terminal]"),


        dock:
            $("#osDock"),

        dockItems:
            $$(".dock-item")
    };


    /* =========================================================
       STATE
    ========================================================= */

    const folderTitles = {

        all:
            "All Projects",

        tools:
            "Business Tools",

        venture:
            "Product Venture",

        systems:
            "Systems"
    };


    const state = {

        activeCategory:
            "all",

        activeView:
            "grid",

        selectedProjectId:
            projects[0].id,

        sortAscending:
            true,

        viewerGalleryIndex:
            0,

        viewerReturnFocus:
            null,

        terminalReturnFocus:
            null
    };


    /* =========================================================
       GENERAL HELPERS
    ========================================================= */

    function getProjectById(
        projectId
    ) {

        return projects.find(
            project =>
                project.id ===
                projectId
        );

    }


    function getProjectGallery(
        project
    ) {

        return project.gallery?.length
            ?
            project.gallery
            :
            [project.preview];

    }


    function formatIndex(
        index,
        total
    ) {

        return (
            `${String(index).padStart(2, "0")} / ` +
            `${String(total).padStart(2, "0")}`
        );

    }


    function replaceChips(
        container,
        values
    ) {

        if (!container) {
            return;
        }


        const fragment =
            document.createDocumentFragment();


        values.forEach(
            value => {

                const chip =
                    document.createElement(
                        "span"
                    );


                chip.textContent =
                    value;


                fragment.appendChild(
                    chip
                );

            }
        );


        container.replaceChildren(
            fragment
        );

    }


    function isTypingTarget(
        element
    ) {

        return (

            element instanceof HTMLElement

            &&

            (
                element.matches(
                    "input, textarea, select"
                )

                ||

                element.isContentEditable
            )

        );

    }


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


    /* =========================================================
       PROJECT COUNTS
    ========================================================= */

    function updateCategoryCounts() {

        const counts = {

            all:
                projects.length,

            tools:
                0,

            venture:
                0,

            systems:
                0

        };


        projects.forEach(
            project => {

                if (
                    Object.prototype.hasOwnProperty.call(
                        counts,
                        project.category
                    )
                ) {

                    counts[
                        project.category
                    ] +=
                        1;

                }

            }
        );


        Object.entries(
            counts
        )
            .forEach(
                ([category, count]) => {

                    const counter =
                        $(
                            `[data-count="${category}"]`
                        );


                    if (counter) {

                        counter.textContent =
                            String(
                                count
                            );

                    }

                }
            );

    }


    /* =========================================================
       FILTERING AND SORTING
    ========================================================= */

    function getVisibleProjects() {

        const search =
            elements
                .projectSearchInput
                ?.value
                .trim()
                .toLowerCase()
            ??
            "";


        return projects

            .filter(
                project => {

                    const categoryMatch =

                        state.activeCategory ===
                            "all"

                        ||

                        project.category ===
                            state.activeCategory;


                    const searchableText =
                        [
                            project.title,
                            project.categoryLabel,
                            project.description,
                            project.short,
                            project.role,
                            ...project.stack,
                            ...project.keywords
                        ]
                            .join(" ")
                            .toLowerCase();


                    return (

                        categoryMatch

                        &&

                        (
                            !search

                            ||

                            searchableText.includes(
                                search
                            )
                        )

                    );

                }
            )

            .sort(
                (a, b) => {

                    const comparison =
                        a.title.localeCompare(
                            b.title
                        );


                    return state.sortAscending
                        ?
                        comparison
                        :
                        -comparison;

                }
            );

    }


    /* =========================================================
       PROJECT CARDS
    ========================================================= */

    function createProjectCard(
        project
    ) {

        const card =
            document.createElement(
                "article"
            );


        const selected =
            project.id ===
                state.selectedProjectId;


        card.className =
            `project-file${selected ? " is-selected" : ""}`;


        card.dataset.projectId =
            project.id;


        card.tabIndex =
            0;


        card.setAttribute(
            "role",
            "button"
        );


        card.setAttribute(
            "aria-label",
            `Open ${project.title}`
        );


        card.setAttribute(
            "aria-pressed",
            String(
                selected
            )
        );


        const visual =
            document.createElement(
                "div"
            );


        visual.className =
            "project-card-visual";


        const image =
            document.createElement(
                "img"
            );


        image.className =
            "project-card-image";


        image.src =
            project.cover;


        image.alt =
            `${project.title} project preview`;


        image.loading =
            "lazy";


        image.decoding =
            "async";


        const overlay =
            document.createElement(
                "div"
            );


        overlay.className =
            "project-card-overlay";


        overlay.setAttribute(
            "aria-hidden",
            "true"
        );


        const icon =
            document.createElement(
                "div"
            );


        icon.className =
            "project-card-project-icon";


        icon.setAttribute(
            "aria-hidden",
            "true"
        );


        const iconGlyph =
            document.createElement(
                "i"
            );


        iconGlyph.className =
            `fa-solid ${project.icon}`;


        icon.appendChild(
            iconGlyph
        );


        const viewLabel =
            document.createElement(
                "span"
            );


        viewLabel.className =
            "project-card-open";


        viewLabel.append(
            document.createTextNode(
                "VIEW "
            )
        );


        const viewIcon =
            document.createElement(
                "i"
            );


        viewIcon.className =
            "fa-solid fa-arrow-up-right";


        viewLabel.appendChild(
            viewIcon
        );


        visual.append(
            image,
            overlay,
            icon,
            viewLabel
        );


        const data =
            document.createElement(
                "div"
            );


        data.className =
            "project-card-data";


        const meta =
            document.createElement(
                "div"
            );


        meta.className =
            "project-file-meta";


        const category =
            document.createElement(
                "span"
            );


        category.className =
            "project-file-category";


        category.textContent =
            project
                .categoryLabel
                .toUpperCase();


        const status =
            document.createElement(
                "span"
            );


        status.className =
            "project-file-status";


        const statusDot =
            document.createElement(
                "i"
            );


        statusDot.setAttribute(
            "aria-hidden",
            "true"
        );


        status.append(
            statusDot,
            document.createTextNode(
                project.status
            )
        );


        meta.append(
            category,
            status
        );


        const title =
            document.createElement(
                "h3"
            );


        title.textContent =
            project.title;


        const description =
            document.createElement(
                "p"
            );


        description.textContent =
            project.short;


        data.append(
            meta,
            title,
            description
        );


        card.append(
            visual,
            data
        );


        return card;

    }


    function renderProjects() {

        if (
            !elements.projectGrid
            ||
            !elements.appProjectCount
            ||
            !elements.emptyState
        ) {

            return;

        }


        const visibleProjects =
            getVisibleProjects();


        const fragment =
            document.createDocumentFragment();


        visibleProjects.forEach(
            project => {

                fragment.appendChild(
                    createProjectCard(
                        project
                    )
                );

            }
        );


        elements.projectGrid.replaceChildren(
            fragment
        );


        elements.projectGrid.classList.toggle(
            "is-list",
            state.activeView ===
                "list"
        );


        elements.appProjectCount.textContent =
            `${visibleProjects.length} PROJECT${visibleProjects.length === 1 ? "" : "S"}`;


        elements.emptyState.classList.toggle(
            "is-hidden",
            visibleProjects.length !==
                0
        );

    }


    /* =========================================================
       PROJECT LINKS
    ========================================================= */

    function configureProjectLink(
        element,
        project,
        label
    ) {

        if (!element) {
            return;
        }


        const icon =
            document.createElement(
                "i"
            );


        icon.className =
            "fa-solid fa-arrow-up-right-from-square";


        element.replaceChildren(

            document.createTextNode(
                `${label} `
            ),

            icon

        );


        if (!project.liveUrl) {

            element.removeAttribute(
                "href"
            );


            element.classList.add(
                "is-hidden-link"
            );


            return;

        }


        element.href =
            project.liveUrl;


        element.target =
            "_blank";


        element.rel =
            "noopener noreferrer";


        element.classList.remove(
            "is-hidden-link"
        );

    }


    /* =========================================================
       PROJECT SELECTION
    ========================================================= */

    function updateSelectedCardState() {

        $$(
            ".project-file",
            elements.projectGrid
        )
            .forEach(
                card => {

                    const selected =

                        card.dataset.projectId ===
                        state.selectedProjectId;


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

    }


    function updateProjectHash(
        projectId
    ) {

        const url =
            new URL(
                window.location.href
            );


        url.hash =
            projectId;


        window.history.replaceState(
            null,
            "",
            url
        );

    }


    function selectProject(
        projectId,
        {
            updateHash = true
        } = {}
    ) {

        const project =
            getProjectById(
                projectId
            );


        if (!project) {
            return;
        }


        state.selectedProjectId =
            project.id;


        updateSelectedCardState();


        const index =
            projects.findIndex(
                item =>
                    item.id ===
                    project.id
            )
            +
            1;


        if (elements.inspectorIndex) {

            elements.inspectorIndex.textContent =
                formatIndex(
                    index,
                    projects.length
                );

        }


        if (elements.inspectorImage) {

            elements.inspectorImage.src =
                project.preview;


            elements.inspectorImage.alt =
                `${project.title} preview`;

        }


        if (elements.inspectorCategory) {

            elements.inspectorCategory.textContent =
                project
                    .categoryLabel
                    .toUpperCase();

        }


        if (elements.inspectorTitle) {

            elements.inspectorTitle.textContent =
                project.title;

        }


        if (elements.inspectorDescription) {

            elements.inspectorDescription.textContent =
                project.description;

        }


        if (elements.inspectorStatus) {

            elements.inspectorStatus.textContent =
                project.status;

        }


        if (elements.inspectorRole) {

            elements.inspectorRole.textContent =
                project.role;

        }


        replaceChips(
            elements.inspectorStack,
            project.stack
        );


        if (elements.statusSelected) {

            elements.statusSelected.textContent =
                `${project.title} selected`;

        }


        configureProjectLink(
            elements.liveProjectLink,
            project,
            "Live Site"
        );


        if (updateHash) {

            updateProjectHash(
                project.id
            );

        }

    }


    /* =========================================================
       PROJECT VIEWER
    ========================================================= */

    function renderViewerImage(
        project
    ) {

        if (
            !elements.viewerProjectImage
            ||
            !elements.viewerImageCounter
        ) {

            return;

        }


        const gallery =
            getProjectGallery(
                project
            );


        state.viewerGalleryIndex =
            Math.max(
                0,
                Math.min(
                    state.viewerGalleryIndex,
                    gallery.length - 1
                )
            );


        elements.viewerProjectImage.src =
            gallery[
                state.viewerGalleryIndex
            ];


        elements.viewerProjectImage.alt =
            `${project.title} screenshot ${state.viewerGalleryIndex + 1}`;


        elements.viewerImageCounter.textContent =
            formatIndex(
                state.viewerGalleryIndex + 1,
                gallery.length
            );

    }


    function stepViewerImage(
        direction
    ) {

        const project =
            getProjectById(
                state.selectedProjectId
            );


        if (!project) {
            return;
        }


        const gallery =
            getProjectGallery(
                project
            );


        state.viewerGalleryIndex =

            (
                state.viewerGalleryIndex

                +

                direction

                +

                gallery.length
            )

            %

            gallery.length;


        renderViewerImage(
            project
        );

    }


    function openProjectViewer(
        projectId
    ) {

        const project =
            getProjectById(
                projectId
            );


        if (
            !project
            ||
            !elements.projectViewer
            ||
            !elements.viewerBackdrop
        ) {

            return;

        }


        state.viewerReturnFocus =
            document.activeElement;


        selectProject(
            project.id
        );


        state.viewerGalleryIndex =
            0;


        if (elements.viewerTitle) {

            elements.viewerTitle.textContent =
                project.title;

        }


        if (elements.viewerCategory) {

            elements.viewerCategory.textContent =
                project
                    .categoryLabel
                    .toUpperCase();

        }


        if (elements.viewerProjectTitle) {

            elements.viewerProjectTitle.textContent =
                project.title;

        }


        if (elements.viewerDescription) {

            elements.viewerDescription.textContent =
                project.description;

        }


        if (elements.viewerStatus) {

            elements.viewerStatus.textContent =
                project.status;

        }


        if (elements.viewerRole) {

            elements.viewerRole.textContent =
                project.role;

        }


        replaceChips(
            elements.viewerStack,
            project.stack
        );


        configureProjectLink(
            elements.viewerOpenLink,
            project,
            "Open Live Site"
        );


        renderViewerImage(
            project
        );


        elements.viewerBackdrop.classList.remove(
            "is-hidden"
        );


        elements.viewerBackdrop.setAttribute(
            "aria-hidden",
            "false"
        );


        elements.projectViewer.classList.remove(
            "is-hidden"
        );


        elements.projectViewer.setAttribute(
            "aria-hidden",
            "false"
        );


        elements.desktop
            ?.classList
            .add(
                "is-viewer-open"
            );


        window.setTimeout(
            () => {

                elements.viewerClose
                    ?.focus();

            },
            50
        );

    }


    function closeProjectViewer() {

        if (
            !elements.projectViewer
            ||
            !elements.viewerBackdrop
        ) {

            return;

        }


        elements.projectViewer.classList.add(
            "is-hidden"
        );


        elements.projectViewer.setAttribute(
            "aria-hidden",
            "true"
        );


        elements.viewerBackdrop.classList.add(
            "is-hidden"
        );


        elements.viewerBackdrop.setAttribute(
            "aria-hidden",
            "true"
        );


        elements.desktop
            ?.classList
            .remove(
                "is-viewer-open"
            );


        if (
            state.viewerReturnFocus instanceof
                HTMLElement

            &&

            state.viewerReturnFocus.isConnected
        ) {

            state.viewerReturnFocus.focus();

        }


        state.viewerReturnFocus =
            null;

    }


    /* =========================================================
       PROJECT GRID EVENTS
    ========================================================= */

    elements.projectGrid
        ?.addEventListener(
            "click",
            event => {

                const card =
                    event.target.closest(
                        ".project-file"
                    );


                if (!card) {
                    return;
                }


                selectProject(
                    card.dataset.projectId
                );

            }
        );


    elements.projectGrid
        ?.addEventListener(
            "dblclick",
            event => {

                const card =
                    event.target.closest(
                        ".project-file"
                    );


                if (!card) {
                    return;
                }


                openProjectViewer(
                    card.dataset.projectId
                );

            }
        );


    elements.projectGrid
        ?.addEventListener(
            "keydown",
            event => {

                const card =
                    event.target.closest(
                        ".project-file"
                    );


                if (!card) {
                    return;
                }


                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();


                    openProjectViewer(
                        card.dataset.projectId
                    );

                }


                if (
                    event.key ===
                    " "
                ) {

                    event.preventDefault();


                    selectProject(
                        card.dataset.projectId
                    );

                }

            }
        );


    /* =========================================================
       CATEGORY NAVIGATION
    ========================================================= */

    function setActiveCategory(
        category,
        {
            scroll = true
        } = {}
    ) {

        if (
            !Object.prototype.hasOwnProperty.call(
                folderTitles,
                category
            )
        ) {

            return;

        }


        state.activeCategory =
            category;


        elements.categoryButtons.forEach(
            button => {

                const active =

                    button.dataset.category ===
                    state.activeCategory;


                button.classList.toggle(
                    "is-active",
                    active
                );


                button.setAttribute(
                    "aria-pressed",
                    String(
                        active
                    )
                );

            }
        );


        if (elements.currentFolderTitle) {

            elements.currentFolderTitle.textContent =
                folderTitles[
                    state.activeCategory
                ];

        }


        renderProjects();


        if (scroll) {

            const reducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;


            elements.projectBrowser
                ?.scrollTo(
                    {
                        top: 0,

                        behavior:
                            reducedMotion
                                ?
                                "auto"
                                :
                                "smooth"
                    }
                );

        }

    }


    elements.categoryButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    setActiveCategory(
                        button.dataset.category
                    );

                }
            );

        }
    );


    /* =========================================================
       SEARCH
    ========================================================= */

    elements.projectSearchInput
        ?.addEventListener(
            "input",
            renderProjects
        );


    elements.topSearchButton
        ?.addEventListener(
            "click",
            () => {

                elements
                    .projectSearchInput
                    ?.focus();

            }
        );


    /* =========================================================
       VIEW MODE
    ========================================================= */

    elements.viewButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    state.activeView =
                        button.dataset.view;


                    elements.viewButtons.forEach(
                        item => {

                            const active =

                                item.dataset.view ===
                                state.activeView;


                            item.classList.toggle(
                                "is-active",
                                active
                            );


                            item.setAttribute(
                                "aria-pressed",
                                String(
                                    active
                                )
                            );

                        }
                    );


                    renderProjects();

                }
            );

        }
    );


    /* =========================================================
       SORTING
    ========================================================= */

    elements.sortButton
        ?.addEventListener(
            "click",
            () => {

                state.sortAscending =
                    !state.sortAscending;


                const label =
                    $(
                        "span",
                        elements.sortButton
                    );


                if (label) {

                    label.textContent =
                        state.sortAscending
                            ?
                            "A–Z"
                            :
                            "Z–A";

                }


                elements.sortButton.setAttribute(
                    "aria-label",

                    state.sortAscending
                        ?
                        "Sort projects Z to A"
                        :
                        "Sort projects A to Z"
                );


                renderProjects();

            }
        );


    /* =========================================================
       VIEWER EVENTS
    ========================================================= */

    elements.openProjectButton
        ?.addEventListener(
            "click",
            () => {

                openProjectViewer(
                    state.selectedProjectId
                );

            }
        );


    elements.viewerClose
        ?.addEventListener(
            "click",
            closeProjectViewer
        );


    elements.viewerCloseDot
        ?.addEventListener(
            "click",
            closeProjectViewer
        );


    elements.viewerBackdrop
        ?.addEventListener(
            "click",
            closeProjectViewer
        );


    elements.viewerPrevImage
        ?.addEventListener(
            "click",
            () => {

                stepViewerImage(
                    -1
                );

            }
        );


    elements.viewerNextImage
        ?.addEventListener(
            "click",
            () => {

                stepViewerImage(
                    1
                );

            }
        );


    /* =========================================================
       TERMINAL
    ========================================================= */

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


        if (
            state.terminalReturnFocus instanceof
                HTMLElement

            &&

            state.terminalReturnFocus.isConnected
        ) {

            state.terminalReturnFocus.focus();

        }


        state.terminalReturnFocus =
            null;

    }


    elements.terminalOpenButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    if (
                        elements.terminal
                            ?.classList
                            .contains(
                                "is-hidden"
                            )
                    ) {

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
            "mohsin@builds:~/projects$";


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


    function terminalPrint(
        text
    ) {

        if (!elements.terminalOutput) {
            return;
        }


        const line =
            document.createElement(
                "p"
            );


        line.textContent =
            text;


        elements.terminalOutput.appendChild(
            line
        );


        elements.terminalOutput.scrollTop =
            elements.terminalOutput.scrollHeight;

    }


    function findProjectFromCommand(
        query
    ) {

        const normalizedQuery =
            query
                .trim()
                .toLowerCase();


        if (!normalizedQuery) {
            return null;
        }


        return projects.find(
            project =>

                project.id.includes(
                    normalizedQuery
                )

                ||

                project.title
                    .toLowerCase()
                    .includes(
                        normalizedQuery
                    )
        );

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
            "projects"

            ||

            normalized ===
            "ls"
        ) {

            terminalPrint(
                projects
                    .map(
                        project =>
                            project.id
                    )
                    .join("   ")
            );


            return;

        }


        if (
            normalized ===
            "categories"
        ) {

            terminalPrint(
                "tools   venture   systems"
            );


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
            normalized.startsWith(
                "open "
            )
        ) {

            const requested =
                normalized
                    .slice(5)
                    .trim();


            const project =
                findProjectFromCommand(
                    requested
                );


            if (!project) {

                terminalPrint(
                    `Project not found: ${requested}`
                );


                return;

            }


            closeTerminal();


            openProjectViewer(
                project.id
            );


            return;

        }


        if (
            normalized ===
            "help"
        ) {

            terminalPrint(
                "projects · open [name] · categories · labs · contact · home · clear"
            );


            return;

        }


        terminalPrint(
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
                    elements
                        .terminalInput
                        .value
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
                    .toLowerCase() ===
                    "k";


            if (searchShortcut) {

                event.preventDefault();


                elements
                    .projectSearchInput
                    ?.focus();


                return;

            }


            if (
                event.key ===
                    "/"

                &&

                !isTypingTarget(
                    document.activeElement
                )
            ) {

                event.preventDefault();


                elements
                    .projectSearchInput
                    ?.focus();


                return;

            }


            const viewerOpen =
                Boolean(

                    elements.projectViewer

                    &&

                    !elements
                        .projectViewer
                        .classList
                        .contains(
                            "is-hidden"
                        )

                );


            if (
                viewerOpen

                &&

                event.key ===
                    "ArrowLeft"
            ) {

                event.preventDefault();


                stepViewerImage(
                    -1
                );


                return;

            }


            if (
                viewerOpen

                &&

                event.key ===
                    "ArrowRight"
            ) {

                event.preventDefault();


                stepViewerImage(
                    1
                );


                return;

            }


            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            if (viewerOpen) {

                closeProjectViewer();


                return;

            }


            const terminalOpen =
                Boolean(

                    elements.terminal

                    &&

                    !elements
                        .terminal
                        .classList
                        .contains(
                            "is-hidden"
                        )

                );


            if (terminalOpen) {

                closeTerminal();

            }

        }
    );


    /* =========================================================
       DOCK MAGNIFICATION
    ========================================================= */

    function enableDockMagnification() {

        if (!elements.dock) {
            return;
        }


        const reducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;


        const finePointer =
            window.matchMedia(
                "(pointer: fine)"
            ).matches;


        if (
            reducedMotion

            ||

            !finePointer
        ) {

            return;

        }


        let frame =
            0;


        let pointerX =
            0;


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
                        () => {

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
       INITIAL URL STATE
    ========================================================= */

    function applyInitialUrlState() {

        const url =
            new URL(
                window.location.href
            );


        const requestedCategory =
            url
                .searchParams
                .get(
                    "category"
                )
                ?.toLowerCase();


        const categoryAliases = {

            all:
                "all",

            tools:
                "tools",

            "business-tools":
                "tools",

            venture:
                "venture",

            labs:
                "venture",

            systems:
                "systems"

        };


        if (
            requestedCategory

            &&

            categoryAliases[
                requestedCategory
            ]
        ) {

            state.activeCategory =
                categoryAliases[
                    requestedCategory
                ];

        }


        /*
         * Collection links from Home are translated into
         * project searches without creating duplicate categories.
         */

        if (
            requestedCategory ===
                "web"

            &&

            elements.projectSearchInput
        ) {

            elements.projectSearchInput.value =
                "Web";

        }


        if (
            requestedCategory ===
                "ecommerce"

            &&

            elements.projectSearchInput
        ) {

            elements.projectSearchInput.value =
                "E-Commerce";

        }


        const hashProject =
            getProjectById(
                url.hash.replace(
                    "#",
                    ""
                )
            );


        if (hashProject) {

            state.selectedProjectId =
                hashProject.id;

        }

    }


    /* =========================================================
       INITIALIZATION
    ========================================================= */

    applyInitialUrlState();


    updateClock();


    window.setInterval(
        updateClock,
        30_000
    );


    updateCategoryCounts();


    setActiveCategory(
        state.activeCategory,
        {
            scroll: false
        }
    );


    selectProject(
        state.selectedProjectId,
        {
            updateHash: false
        }
    );


    enableDockMagnification();

});