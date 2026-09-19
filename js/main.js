/* =========================================================
   MOHSIN BUILDS V2
   FOUNDER STUDIO — BUILD 003
   REAL THREE.JS ECOSYSTEM
========================================================= */

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


/* =========================================================
   SYSTEM CONTENT
========================================================= */

const systemData = {

    core: {
        index: "00 / 06",
        label: "CENTRAL SYSTEM",
        title: "Mohsin Builds",
        description:
            "The personal digital environment of Mohsin Iqbal — connecting design, development, products, automation and business systems.",
        meta: [
            "DESIGN",
            "BUILD",
            "SYSTEMS"
        ]
    },

    labs: {
        index: "01 / 06",
        label: "FLAGSHIP PROJECT",
        title: "Mohsin Labs",
        description:
            "Experimental digital products, intelligent systems and useful tools built around real-world problems.",
        meta: [
            "PRODUCT",
            "SYSTEMS",
            "LAB"
        ]
    },

    web: {
        index: "02 / 06",
        label: "WEB EXPERIENCES",
        title: "Digital Experiences",
        description:
            "Premium websites and interfaces designed around clarity, usability, performance and strong visual identity.",
        meta: [
            "DESIGN",
            "FRONTEND",
            "UX"
        ]
    },

    commerce: {
        index: "03 / 06",
        label: "DIGITAL COMMERCE",
        title: "E-Commerce",
        description:
            "Commerce experiences designed to connect product presentation, customer journeys and business growth.",
        meta: [
            "SHOPIFY",
            "COMMERCE",
            "GROWTH"
        ]
    },

    automation: {
        index: "04 / 06",
        label: "INTELLIGENT SYSTEMS",
        title: "AI & Automation",
        description:
            "Automation workflows and AI-assisted systems designed to reduce repetitive work and create leverage.",
        meta: [
            "AI",
            "WORKFLOWS",
            "AUTOMATION"
        ]
    },

    business: {
        index: "05 / 06",
        label: "BUSINESS SYSTEMS",
        title: "Systems Thinking",
        description:
            "Digital tools and processes designed around real operational problems, people and measurable outcomes.",
        meta: [
            "PROCESS",
            "TOOLS",
            "IMPACT"
        ]
    }

};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const canvas =
    document.querySelector(
        "#ecosystem-canvas"
    );

const ecosystemSceneElement =
    document.querySelector(
        ".ecosystem-scene"
    );

const detail =
    document.querySelector(
        "[data-system-detail]"
    );

const founderStudio =
    document.querySelector(
        ".founder-studio"
    );

const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


/* =========================================================
   THREE.JS GLOBALS
========================================================= */

let renderer;
let scene;
let camera;
let world;

const worldNodes = {};

const animatedPackets = [];

let targetCameraX = 8.2;
let targetCameraY = 8.5;


/* =========================================================
   IMPORTANT — NODE POSITIONS
   MUST EXIST BEFORE 3D INITIALIZATION
========================================================= */

const nodePositions = {

    labs:
        new THREE.Vector3(
            0,
            -0.14,
            -3
        ),

    web:
        new THREE.Vector3(
            -3.55,
            -0.14,
            -1.45
        ),

    commerce:
        new THREE.Vector3(
            -3.6,
            -0.14,
            2.15
        ),

    automation:
        new THREE.Vector3(
            0,
            -0.14,
            2.75
        ),

    business:
        new THREE.Vector3(
            3.65,
            -0.14,
            1.55
        )

};


/* =========================================================
   RIGHT INFORMATION PANEL
========================================================= */

function showSystem(systemKey) {

    const data =
        systemData[systemKey];

    if (!data) {
        return;
    }


    /* HTML LABEL ACTIVE STATE */

    document
        .querySelectorAll(
            "[data-world-node]"
        )
        .forEach((label) => {

            label.classList.toggle(
                "is-active",
                label.dataset.worldNode ===
                    systemKey
            );

        });


    /* 3D HIGHLIGHT */

    highlightWorld(
        systemKey
    );


    if (!detail) {
        return;
    }


    const index =
        detail.querySelector(
            ".system-detail__index"
        );

    const label =
        detail.querySelector(
            ".system-detail__label"
        );

    const title =
        detail.querySelector(
            "h2"
        );

    const description =
        detail.querySelector(
            "h2 + p"
        );

    const meta =
        detail.querySelector(
            ".system-detail__meta"
        );


    if (index) {
        index.textContent =
            data.index;
    }

    if (label) {
        label.textContent =
            data.label;
    }

    if (title) {
        title.textContent =
            data.title;
    }

    if (description) {
        description.textContent =
            data.description;
    }

    if (meta) {

        meta.innerHTML =
            data.meta
                .map(
                    (item) =>
                        `<span>${item}</span>`
                )
                .join("");

    }


    detail.classList.remove(
        "is-changing"
    );

    void detail.offsetWidth;

    detail.classList.add(
        "is-changing"
    );

}


/* =========================================================
   INITIALIZE THREE.JS
========================================================= */

function initThreeWorld() {

    if (
        !canvas ||
        !ecosystemSceneElement
    ) {
        return;
    }


    scene =
        new THREE.Scene();


    camera =
        new THREE.PerspectiveCamera(
            38,
            1,
            0.1,
            100
        );


    camera.position.set(
        8.2,
        8.5,
        11.5
    );


    camera.lookAt(
        0,
        0.6,
        0
    );


    renderer =
        new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference:
                "high-performance"
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.8
        )
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;


    renderer.toneMappingExposure =
        1.25;


    world =
        new THREE.Group();


    scene.add(
        world
    );


    createLighting();

    createPlatform();

    createGrid();

    createCentralCore();

    createLabsTower();

    createSatelliteNodes();

    createConnections();

    createParticles();


    resizeRenderer();


    window.addEventListener(
        "resize",
        resizeRenderer
    );


    ecosystemSceneElement
        .addEventListener(
            "pointermove",
            handleWorldPointer
        );


    ecosystemSceneElement
        .addEventListener(
            "pointerleave",
            resetWorldPointer
        );


    animate();

}


/* =========================================================
   LIGHTING
========================================================= */

function createLighting() {

    const ambient =
        new THREE.AmbientLight(
            0x33547d,
            1.05
        );


    scene.add(
        ambient
    );


    const blueLight =
        new THREE.PointLight(
            0x2d8cff,
            34,
            20,
            1.8
        );


    blueLight.position.set(
        0,
        5,
        2
    );


    scene.add(
        blueLight
    );


    const violetLight =
        new THREE.PointLight(
            0x8a5cff,
            20,
            13,
            1.7
        );


    violetLight.position.set(
        0,
        5,
        -3.8
    );


    scene.add(
        violetLight
    );


    const warmLight =
        new THREE.PointLight(
            0xe79b58,
            7,
            12,
            2
        );


    warmLight.position.set(
        5,
        3,
        4
    );


    scene.add(
        warmLight
    );

}


/* =========================================================
   MATERIALS
========================================================= */

function darkMaterial(
    color = 0x07101c
) {

    return new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.3,
        metalness: 0.7
    });

}


function glassMaterial(
    color = 0x4d9fff,
    opacity = 0.2
) {

    return new THREE.MeshPhysicalMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        roughness: 0.16,
        metalness: 0.08,
        transmission: 0.1,
        emissive: color,
        emissiveIntensity: 0.18,
        side:
            THREE.DoubleSide
    });

}


function emissiveMaterial(
    color
) {

    return new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 2.1,
        roughness: 0.2,
        metalness: 0.45
    });

}


/* =========================================================
   MAIN PLATFORM
========================================================= */

function createPlatform() {

    const base =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                10.8,
                0.34,
                8.2
            ),
            darkMaterial(
                0x050a10
            )
        );


    base.position.y =
        -0.75;


    world.add(
        base
    );


    const upper =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                10.25,
                0.16,
                7.65
            ),
            new THREE.MeshStandardMaterial({
                color:
                    0x08111d,
                roughness:
                    0.24,
                metalness:
                    0.72
            })
        );


    upper.position.y =
        -0.52;


    world.add(
        upper
    );


    const edgeGeometry =
        new THREE.EdgesGeometry(
            new THREE.BoxGeometry(
                10.28,
                0.18,
                7.68
            )
        );


    const edge =
        new THREE.LineSegments(
            edgeGeometry,
            new THREE.LineBasicMaterial({
                color:
                    0x287bea,
                transparent:
                    true,
                opacity:
                    0.33
            })
        );


    edge.position.y =
        -0.515;


    world.add(
        edge
    );

}


/* =========================================================
   GRID
========================================================= */

function createGrid() {

    const grid =
        new THREE.GridHelper(
            10,
            18,
            0x2867ae,
            0x17314e
        );


    grid.position.y =
        -0.41;


    grid.material.transparent =
        true;


    grid.material.opacity =
        0.19;


    world.add(
        grid
    );

}


/* =========================================================
   PEDESTAL FACTORY
========================================================= */

function createPedestal(
    x,
    z,
    width,
    depth,
    color
) {

    const group =
        new THREE.Group();


    group.position.set(
        x,
        0,
        z
    );


    const lower =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                0.32,
                depth
            ),
            darkMaterial(
                0x07101a
            )
        );


    lower.position.y =
        -0.28;


    group.add(
        lower
    );


    const trim =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width * 0.94,
                0.08,
                depth * 0.94
            ),
            emissiveMaterial(
                color
            )
        );


    trim.position.y =
        -0.08;


    group.add(
        trim
    );


    const top =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                width * 0.88,
                0.15,
                depth * 0.88
            ),
            darkMaterial(
                0x09131e
            )
        );


    top.position.y =
        0.03;


    group.add(
        top
    );


    world.add(
        group
    );


    return group;

}


/* =========================================================
   CENTRAL MOHSIN BUILDS CORE
========================================================= */

function createCentralCore() {

    const group =
        createPedestal(
            0,
            0,
            2.6,
            2.2,
            0x2787ff
        );


    const towerGroup =
        new THREE.Group();


    group.add(
        towerGroup
    );


    const levels = [

        {
            size: 1.55,
            height: 0.55
        },

        {
            size: 1.28,
            height: 0.58
        },

        {
            size: 1.0,
            height: 0.68
        },

        {
            size: 0.72,
            height: 0.82
        }

    ];


    let currentY =
        0.35;


    levels.forEach(
        (level, index) => {

            const mesh =
                new THREE.Mesh(
                    new THREE.BoxGeometry(
                        level.size,
                        level.height,
                        level.size
                    ),

                    index ===
                    levels.length - 1

                        ? glassMaterial(
                            0x4ca5ff,
                            0.32
                        )

                        : darkMaterial(
                            0x08182a
                        )
                );


            mesh.position.y =
                currentY;


            towerGroup.add(
                mesh
            );


            const border =
                new THREE.LineSegments(
                    new THREE.EdgesGeometry(
                        mesh.geometry
                    ),
                    new THREE.LineBasicMaterial({
                        color:
                            0x3896ff,
                        transparent:
                            true,
                        opacity:
                            0.58
                    })
                );


            border.position.copy(
                mesh.position
            );


            towerGroup.add(
                border
            );


            currentY +=
                level.height;

        }
    );


    const coreLight =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.34,
                2.3,
                0.34
            ),
            emissiveMaterial(
                0x2f8cff
            )
        );


    coreLight.position.y =
        1.55;


    towerGroup.add(
        coreLight
    );


    worldNodes.core =
        group;

}


/* =========================================================
   MOHSIN LABS FLAGSHIP TOWER
========================================================= */

function createLabsTower() {

    const group =
        createPedestal(
            0,
            -3.0,
            2.15,
            1.55,
            0x8c58ff
        );


    const building =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.13,
                1.75,
                0.88
            ),
            glassMaterial(
                0x8651ff,
                0.36
            )
        );


    building.position.y =
        0.95;


    group.add(
        building
    );


    const inside =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.55,
                1.37,
                0.39
            ),
            emissiveMaterial(
                0x8651ff
            )
        );


    inside.position.y =
        0.95;


    group.add(
        inside
    );


    const edges =
        new THREE.LineSegments(
            new THREE.EdgesGeometry(
                building.geometry
            ),
            new THREE.LineBasicMaterial({
                color:
                    0xbf9aff,
                transparent:
                    true,
                opacity:
                    0.78
            })
        );


    edges.position.copy(
        building.position
    );


    group.add(
        edges
    );


    worldNodes.labs =
        group;

}


/* =========================================================
   SATELLITE BUILDING FACTORY
========================================================= */

function createSatelliteBuilding(
    key,
    x,
    z,
    color,
    variant
) {

    const group =
        createPedestal(
            x,
            z,
            1.8,
            1.45,
            color
        );


    const count =
        variant === "cluster"
            ? 3
            : 2;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const height =
            0.72 +
            i * 0.24;


        const building =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.42,
                    height,
                    0.52
                ),
                darkMaterial(
                    0x091521
                )
            );


        building.position.set(

            (
                i -
                (
                    count -
                    1
                )
                /
                2
            )
            *
            0.48,

            0.24 +
            height /
            2,

            (
                i % 2
            )
            *
            0.15

        );


        group.add(
            building
        );


        const edge =
            new THREE.LineSegments(
                new THREE.EdgesGeometry(
                    building.geometry
                ),
                new THREE.LineBasicMaterial({
                    color:
                        color,
                    transparent:
                        true,
                    opacity:
                        0.42
                })
            );


        edge.position.copy(
            building.position
        );


        group.add(
            edge
        );

    }


    const beacon =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.055,
                0.055,
                0.45,
                16
            ),
            emissiveMaterial(
                color
            )
        );


    beacon.position.y =
        0.56;


    group.add(
        beacon
    );


    worldNodes[key] =
        group;

}


/* =========================================================
   CREATE SATELLITES
========================================================= */

function createSatelliteNodes() {

    createSatelliteBuilding(
        "web",
        -3.55,
        -1.45,
        0x2b8dff,
        "cluster"
    );


    createSatelliteBuilding(
        "commerce",
        -3.6,
        2.15,
        0x3e9fff,
        "standard"
    );


    createSatelliteBuilding(
        "automation",
        0,
        2.75,
        0x45beff,
        "cluster"
    );


    createSatelliteBuilding(
        "business",
        3.65,
        1.55,
        0xe68b4d,
        "cluster"
    );

}


/* =========================================================
   CONNECTION PATHS
========================================================= */

function createConnections() {

    Object
        .entries(
            nodePositions
        )
        .forEach(
            (
                [
                    key,
                    destination
                ],
                index
            ) => {

                const start =
                    new THREE.Vector3(
                        0,
                        -0.14,
                        0
                    );


                const mid =
                    new THREE.Vector3(
                        destination.x * 0.5,
                        -0.10,
                        destination.z * 0.5
                    );


                const curve =
                    new THREE.CatmullRomCurve3([
                        start,
                        mid,
                        destination
                    ]);


                const geometry =
                    new THREE.TubeGeometry(
                        curve,
                        48,
                        0.025,
                        8,
                        false
                    );


                const color =
                    key === "labs"

                        ? 0x8e61ff

                        : key === "business"

                            ? 0xe98d55

                            : 0x328fff;


                const material =
                    new THREE.MeshBasicMaterial({
                        color:
                            color,
                        transparent:
                            true,
                        opacity:
                            0.63
                    });


                const tube =
                    new THREE.Mesh(
                        geometry,
                        material
                    );


                world.add(
                    tube
                );


                createPacket(
                    curve,
                    color,
                    index * 0.19
                );

            }
        );

}


/* =========================================================
   MOVING ENERGY PACKETS
========================================================= */

function createPacket(
    curve,
    color,
    offset
) {

    const packet =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.075,
                12,
                12
            ),
            emissiveMaterial(
                color
            )
        );


    world.add(
        packet
    );


    animatedPackets.push({
        mesh:
            packet,
        curve:
            curve,
        progress:
            offset
    });

}


/* =========================================================
   PARTICLES
========================================================= */

function createParticles() {

    const count =
        85;


    const positions =
        new Float32Array(
            count * 3
        );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        positions[
            i * 3
        ] =
            (
                Math.random() -
                0.5
            )
            *
            11;


        positions[
            i * 3 +
            1
        ] =
            Math.random()
            *
            4.5;


        positions[
            i * 3 +
            2
        ] =
            (
                Math.random() -
                0.5
            )
            *
            8;

    }


    const geometry =
        new THREE.BufferGeometry();


    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({
            color:
                0x4a91e8,
            size:
                0.025,
            transparent:
                true,
            opacity:
                0.38
        });


    const points =
        new THREE.Points(
            geometry,
            material
        );


    world.add(
        points
    );

}


/* =========================================================
   3D NODE HIGHLIGHT
========================================================= */

function highlightWorld(
    key
) {

    Object
        .entries(
            worldNodes
        )
        .forEach(
            (
                [
                    nodeKey,
                    group
                ]
            ) => {

                const active =
                    nodeKey === key;


                group.traverse(
                    (child) => {

                        if (
                            child.material &&
                            "emissiveIntensity"
                                in child.material
                        ) {

                            child.material
                                .emissiveIntensity =
                                    active
                                        ? 3.2
                                        : 1.25;

                        }

                    }
                );

            }
        );

}


/* =========================================================
   HTML WORLD LABEL INTERACTION
========================================================= */

document
    .querySelectorAll(
        "[data-world-node]"
    )
    .forEach(
        (label) => {

            const key =
                label.dataset.worldNode;


            label.addEventListener(
                "mouseenter",
                () => {

                    showSystem(
                        key
                    );

                }
            );


            label.addEventListener(
                "focus",
                () => {

                    showSystem(
                        key
                    );

                }
            );


            label.addEventListener(
                "click",
                () => {

                    showSystem(
                        key
                    );

                }
            );

        }
    );


/* =========================================================
   CAMERA POINTER MOVEMENT
========================================================= */

function handleWorldPointer(
    event
) {

    if (
        reducedMotion ||
        !ecosystemSceneElement
    ) {
        return;
    }


    const rect =
        ecosystemSceneElement
            .getBoundingClientRect();


    const normalizedX =
        (
            event.clientX -
            rect.left
        )
        /
        rect.width;


    const normalizedY =
        (
            event.clientY -
            rect.top
        )
        /
        rect.height;


    targetCameraX =
        8.2 +
        (
            normalizedX -
            0.5
        )
        *
        1.6;


    targetCameraY =
        8.5 +
        (
            0.5 -
            normalizedY
        )
        *
        0.9;

}


function resetWorldPointer() {

    targetCameraX =
        8.2;


    targetCameraY =
        8.5;

}


/* =========================================================
   RENDERER RESIZE
========================================================= */

function resizeRenderer() {

    if (
        !renderer ||
        !camera ||
        !ecosystemSceneElement
    ) {
        return;
    }


    const rect =
        ecosystemSceneElement
            .getBoundingClientRect();


    const width =
        Math.max(
            rect.width,
            1
        );


    const height =
        Math.max(
            rect.height,
            1
        );


    renderer.setSize(
        width,
        height,
        false
    );


    camera.aspect =
        width /
        height;


    camera.updateProjectionMatrix();

}


/* =========================================================
   ANIMATION LOOP
========================================================= */

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    if (
        !renderer ||
        !scene ||
        !camera
    ) {
        return;
    }


    const delta =
        clock.getDelta();


    const time =
        clock.elapsedTime;


    if (!reducedMotion) {

        camera.position.x +=
            (
                targetCameraX -
                camera.position.x
            )
            *
            0.035;


        camera.position.y +=
            (
                targetCameraY -
                camera.position.y
            )
            *
            0.035;


        camera.lookAt(
            0,
            0.6,
            0
        );


        if (
            worldNodes.core
        ) {

            worldNodes.core
                .rotation.y =
                    Math.sin(
                        time * 0.32
                    )
                    *
                    0.025;

        }


        if (
            worldNodes.labs
        ) {

            worldNodes.labs
                .position.y =
                    Math.sin(
                        time * 1.05
                    )
                    *
                    0.045;

        }


        animatedPackets
            .forEach(
                (
                    packet,
                    index
                ) => {

                    packet.progress +=
                        delta
                        *
                        (
                            0.085 +
                            index *
                            0.007
                        );


                    if (
                        packet.progress >
                        1
                    ) {

                        packet.progress =
                            0;

                    }


                    const point =
                        packet.curve
                            .getPointAt(
                                packet.progress
                            );


                    packet.mesh
                        .position
                        .copy(
                            point
                        );

                }
            );

    }


    renderer.render(
        scene,
        camera
    );

}


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle =
    document.querySelector(
        ".menu-toggle"
    );

const mobileMenu =
    document.querySelector(
        ".mobile-menu"
    );


if (
    menuToggle &&
    mobileMenu
) {

    menuToggle
        .addEventListener(
            "click",
            () => {

                const open =
                    mobileMenu
                        .classList
                        .toggle(
                            "is-open"
                        );


                menuToggle.setAttribute(
                    "aria-expanded",
                    String(
                        open
                    )
                );


                mobileMenu.setAttribute(
                    "aria-hidden",
                    String(
                        !open
                    )
                );

            }
        );


    mobileMenu
        .querySelectorAll(
            "a"
        )
        .forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        mobileMenu
                            .classList
                            .remove(
                                "is-open"
                            );


                        menuToggle
                            .setAttribute(
                                "aria-expanded",
                                "false"
                            );


                        mobileMenu
                            .setAttribute(
                                "aria-hidden",
                                "true"
                            );

                    }
                );

            }
        );

}


/* =========================================================
   ENTER ENVIRONMENT BUTTON
========================================================= */

const enterEnvironment =
    document.querySelector(
        "[data-enter-environment]"
    );


if (
    enterEnvironment &&
    ecosystemSceneElement
) {

    enterEnvironment
        .addEventListener(
            "click",
            () => {

                ecosystemSceneElement
                    .scrollIntoView({
                        behavior:
                            reducedMotion
                                ? "auto"
                                : "smooth",
                        block:
                            "center"
                    });


                if (
                    typeof window.gtag ===
                    "function"
                ) {

                    window.gtag(
                        "event",
                        "enter_environment"
                    );

                }

            }
        );

}


/* =========================================================
   HEADER NAVIGATION ACTIVE STATE
========================================================= */

const navLinks =
    document.querySelectorAll(
        ".main-nav__link"
    );


navLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            () => {

                navLinks.forEach(
                    (item) => {

                        item.classList.remove(
                            "is-active"
                        );

                    }
                );


                link.classList.add(
                    "is-active"
                );

            }
        );

    }
);


/* =========================================================
   CINEMATIC POINTER LIGHT
========================================================= */

if (
    founderStudio &&
    !reducedMotion
) {

    founderStudio
        .addEventListener(
            "pointermove",
            (event) => {

                const rect =
                    founderStudio
                        .getBoundingClientRect();


                const x =
                    (
                        (
                            event.clientX -
                            rect.left
                        )
                        /
                        rect.width
                    )
                    *
                    100;


                const y =
                    (
                        (
                            event.clientY -
                            rect.top
                        )
                        /
                        rect.height
                    )
                    *
                    100;


                founderStudio
                    .style
                    .setProperty(
                        "--pointer-x",
                        `${x}%`
                    );


                founderStudio
                    .style
                    .setProperty(
                        "--pointer-y",
                        `${y}%`
                    );

            }
        );

}


/* =========================================================
   START THREE.JS
========================================================= */

if (
    canvas &&
    ecosystemSceneElement
) {

    initThreeWorld();

}


/* =========================================================
   DEFAULT ACTIVE SYSTEM
========================================================= */

showSystem(
    "labs"
);