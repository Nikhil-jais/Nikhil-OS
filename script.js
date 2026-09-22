"use strict";

/* =========================================================
   NIKHILOS 2.0
   DIGITAL UNIVERSE
   ========================================================= */

/* ---------------------------------------------------------
   SHORTCUTS
   --------------------------------------------------------- */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* ---------------------------------------------------------
   STORAGE
   --------------------------------------------------------- */

const storage = {
    get(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);

            if (value === null) {
                return fallback;
            }

            return JSON.parse(value);
        } catch {
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );
        } catch {
            /* Storage may be unavailable */
        }
    }
};


/* =========================================================
   STATE
   ========================================================= */

const state = {
    zIndex: 100,

    openApps: new Set(),

    activeApp: null,

    musicPlaying: false,

    cameraStream: null,

    recorder: null,

    recordedChunks: [],

    recording: false,

    notes: storage.get("nikhilos-notes", [
        {
            id: 1,
            title: "Welcome to NikhilOS",
            body:
                "This is your personal digital universe.\n\n" +
                "Everything here is designed to feel like a real desktop — " +
                "not just another webpage."
        },
        {
            id: 2,
            title: "Ideas",
            body:
                "Build.\nCreate.\nExperiment.\nShip.\n\n" +
                "There is always another idea worth trying."
        }
    ]),

    theme: storage.get(
        "nikhilos-theme",
        "blue"
    ),

    reduceMotion: storage.get(
        "nikhilos-reduced-motion",
        false
    ),

    glow: storage.get(
        "nikhilos-glow",
        1
    )
};


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;

function toast(message) {

    let toastBox = $(".toast");

    if (!toastBox) {

        toastBox = document.createElement("div");

        toastBox.className = "toast";

        document.body.appendChild(toastBox);
    }

    toastBox.textContent = message;

    toastBox.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toastBox.classList.remove("show");
    }, 2200);
}


/* =========================================================
   WINDOW SYSTEM
   ========================================================= */

const appNames = [
    "finder",
    "notes",
    "arcade",
    "camera",
    "studio",
    "terminal",
    "music",
    "activity",
    "settings"
];


function getWindow(app) {
    return $(`.window[data-app="${app}"]`);
}


function focusWindow(app) {

    const win = getWindow(app);

    if (!win) {
        return;
    }

    state.zIndex += 1;

    win.style.zIndex = state.zIndex;

    $$(".window").forEach(window => {
        window.classList.remove("focused");
    });

    win.classList.add("focused");

    state.activeApp = app;
}


function openApp(app) {

    const win = getWindow(app);

    if (!win) {
        return;
    }

    state.openApps.add(app);

    win.classList.remove("minimized");

    win.classList.add("open");

    focusWindow(app);

    updateDock();

    if (app === "camera") {
        startCamera();
    }

    if (app === "activity") {
        updateActivity();
    }

    if (app === "settings") {
        refreshSettings();
    }
}


function closeApp(app) {

    const win = getWindow(app);

    if (!win) {
        return;
    }

    win.classList.remove("open");
    win.classList.remove("focused");
    win.classList.remove("max");

    state.openApps.delete(app);

    if (app === "camera") {
        stopCamera();
    }

    if (app === "studio") {
        stopRecording(false);
    }

    updateDock();
}


function minimizeApp(app) {

    const win = getWindow(app);

    if (!win) {
        return;
    }

    win.classList.add("minimized");
    win.classList.remove("focused");

    updateDock();
}


function maximizeApp(app) {

    const win = getWindow(app);

    if (!win) {
        return;
    }

    win.classList.toggle("max");

    focusWindow(app);
}


function updateDock() {

    $$(".dock-item[data-app]").forEach(button => {

        const app = button.dataset.app;

        button.classList.toggle(
            "running",
            state.openApps.has(app)
        );
    });
}


/* =========================================================
   WINDOW DRAGGING
   ========================================================= */

function makeDraggable(win) {

    const bar = $(".window-bar", win);

    if (!bar) {
        return;
    }

    let dragging = false;

    let startX = 0;
    let startY = 0;

    let startLeft = 0;
    let startTop = 0;

    bar.addEventListener("pointerdown", event => {

        if (
            event.target.closest(".traffic") ||
            win.classList.contains("max")
        ) {
            return;
        }

        dragging = true;

        bar.setPointerCapture(event.pointerId);

        const rect = win.getBoundingClientRect();

        startX = event.clientX;
        startY = event.clientY;

        startLeft = rect.left;
        startTop = rect.top;

        focusWindow(win.dataset.app);
    });

    bar.addEventListener("pointermove", event => {

        if (!dragging) {
            return;
        }

        const dx = event.clientX - startX;
        const dy = event.clientY - startY;

        let left = startLeft + dx;
        let top = startTop + dy;

        const maxLeft =
            window.innerWidth - win.offsetWidth - 10;

        const maxTop =
            window.innerHeight - win.offsetHeight - 45;

        left = Math.max(10, Math.min(left, maxLeft));
        top = Math.max(38, Math.min(top, maxTop));

        win.style.left = `${left}px`;
        win.style.top = `${top}px`;
    });

    bar.addEventListener("pointerup", () => {
        dragging = false;
    });

    bar.addEventListener("pointercancel", () => {
        dragging = false;
    });
}


/* =========================================================
   WINDOW BUTTONS
   ========================================================= */

function setupWindows() {

    $$(".window").forEach(win => {

        makeDraggable(win);

        win.addEventListener("pointerdown", () => {
            focusWindow(win.dataset.app);
        });

        const closeButton = $(".close", win);
        const minButton = $(".min", win);
        const maxButton = $(".maximize", win);

        if (closeButton) {
            closeButton.addEventListener("click", event => {

                event.stopPropagation();

                closeApp(win.dataset.app);
            });
        }

        if (minButton) {
            minButton.addEventListener("click", event => {

                event.stopPropagation();

                minimizeApp(win.dataset.app);
            });
        }

        if (maxButton) {
            maxButton.addEventListener("click", event => {

                event.stopPropagation();

                maximizeApp(win.dataset.app);
            });
        }
    });
}


/* =========================================================
   APP CONTENT
   ========================================================= */

const appContent = {

    finder() {

        return `
            <div class="finder-app">

                <aside class="finder-side">

                    <h4>Locations</h4>

                    <div class="finder-nav">

                        <button class="active">
                            ✦ Universe
                        </button>

                        <button>
                            ◫ Projects
                        </button>

                        <button>
                            ◉ Desktop
                        </button>

                        <button>
                            ♡ Favorites
                        </button>

                    </div>

                    <h4 style="margin-top:20px">
                        Cloud
                    </h4>

                    <div class="finder-nav">

                        <button>
                            ☁ Nikhil Cloud
                        </button>

                        <button>
                            ◌ GitHub
                        </button>

                    </div>

                </aside>

                <main class="files">

                    <div class="app-heading">

                        <div>
                            <h2>Universe</h2>

                            <p>
                                Your digital workspace
                            </p>
                        </div>

                        <button
                            class="app-btn"
                            data-action="new-folder"
                        >
                            + New
                        </button>

                    </div>

                    <div class="file-grid">

                        <div class="file-card">
                            <div class="file-icon">📁</div>
                            <strong>Projects</strong>
                            <span>24 items</span>
                        </div>

                        <div class="file-card">
                            <div class="file-icon">📁</div>
                            <strong>Web Apps</strong>
                            <span>18 items</span>
                        </div>

                        <div class="file-card">
                            <div class="file-icon">📁</div>
                            <strong>Games</strong>
                            <span>9 items</span>
                        </div>

                        <div class="file-card">
                            <div class="file-icon">📁</div>
                            <strong>Experiments</strong>
                            <span>31 items</span>
                        </div>

                        <div class="file-card">
                            <div class="file-icon">🧩</div>
                            <strong>Frictionless</strong>
                            <span>Project</span>
                        </div>

                        <div class="file-card">
                            <div class="file-icon">🎬</div>
                            <strong>KASHI-Film</strong>
                            <span>Project</span>
                        </div>

                        <div class="file-card">
                            <div class="file-icon">💻</div>
                            <strong>NikhilOS</strong>
                            <span>System</span>
                        </div>

                        <div class="file-card">
                            <div class="file-icon">📄</div>
                            <strong>README</strong>
                            <span>Markdown</span>
                        </div>

                    </div>

                </main>

            </div>
        `;
    },


    notes() {

        return `
            <div class="notes-app">

                <aside class="notes-list">

                    <div
                        class="app-heading"
                        style="padding:4px 5px"
                    >

                        <div>
                            <h2 style="font-size:13px">
                                Notes
                            </h2>
                        </div>

                        <button
                            class="app-btn"
                            id="newNote"
                        >
                            +
                        </button>

                    </div>

                    <div id="noteList"></div>

                </aside>

                <main class="notes-editor">

                    <div class="notes-toolbar">

                        <input
                            id="noteTitle"
                            placeholder="Note title"
                        >

                        <button
                            class="app-btn"
                            id="saveNote"
                        >
                            Save
                        </button>

                        <button
                            class="app-btn"
                            id="deleteNote"
                        >
                            Delete
                        </button>

                    </div>

                    <textarea
                        id="noteBody"
                        placeholder="Start writing..."
                    ></textarea>

                </main>

            </div>
        `;
    },


    arcade() {

        return `
            <div class="app-shell">

                <div class="app-heading">

                    <div>
                        <h2>Arcade</h2>

                        <p>
                            Tiny games. Big energy.
                        </p>
                    </div>

                    <div>
                        <span
                            class="muted"
                            style="font-size:10px"
                        >
                            Local arcade
                        </span>
                    </div>

                </div>

                <div class="arcade-grid">

                    <div
                        class="game-card"
                        data-game="memory"
                    >

                        <div class="game-emoji">
                            🧠
                        </div>

                        <h3>Memory Rush</h3>

                        <p>
                            Remember the glowing sequence.
                        </p>

                        <div class="game-art"></div>

                    </div>

                    <div
                        class="game-card"
                        data-game="orbit"
                    >

                        <div class="game-emoji">
                            🪐
                        </div>

                        <h3>Orbit Tap</h3>

                        <p>
                            Catch the moving planet.
                        </p>

                        <div class="game-art"></div>

                    </div>

                    <div
                        class="game-card"
                        data-game="reaction"
                    >

                        <div class="game-emoji">
                            ⚡
                        </div>

                        <h3>Reaction</h3>

                        <p>
                            How fast are your reflexes?
                        </p>

                        <div class="game-art"></div>

                    </div>

                </div>

                <div
                    class="game-stage"
                    id="gameStage"
                >

                    <div class="game-panel">

                        <div class="game-top">

                            <strong id="gameTitle">
                                Arcade
                            </strong>

                            <span
                                class="game-score"
                                id="gameScore"
                            >
                                Score: 0
                            </span>

                            <button
                                class="app-btn"
                                id="closeGame"
                            >
                                Close
                            </button>

                        </div>

                        <div
                            class="game-board"
                            id="gameBoard"
                        ></div>

                    </div>

                </div>

            </div>
        `;
    },


    camera() {

        return `
            <div class="camera-app">

                <div class="app-heading">

                    <div>
                        <h2>Camera</h2>

                        <p>
                            Live camera preview
                        </p>
                    </div>

                    <span
                        class="live"
                        id="cameraStatus"
                    >
                        Ready
                    </span>

                </div>

                <div class="camera-view">

                    <video
                        id="cameraVideo"
                        autoplay
                        muted
                        playsinline
                    ></video>

                    <div class="camera-overlay"></div>

                </div>

                <div class="camera-controls">

                    <button
                        class="app-btn primary"
                        id="cameraStart"
                    >
                        Start Camera
                    </button>

                    <button
                        class="app-btn"
                        id="cameraStop"
                    >
                        Stop
                    </button>

                </div>

            </div>
        `;
    },


    studio() {

        return `
            <div class="studio-app">

                <div class="app-heading">

                    <div>
                        <h2>Studio</h2>

                        <p>
                            Browser video recorder
                        </p>
                    </div>

                    <span
                        class="muted"
                        id="recordStatus"
                    >
                        Ready
                    </span>

                </div>

                <div class="studio-preview">

                    <video
                        id="studioPreview"
                        autoplay
                        muted
                        playsinline
                    ></video>

                </div>

                <div class="camera-controls">

                    <button
                        class="app-btn primary"
                        id="recordStart"
                    >
                        ● Start Recording
                    </button>

                    <button
                        class="app-btn"
                        id="recordStop"
                    >
                        Stop
                    </button>

                </div>

            </div>
        `;
    },


    terminal() {

        return `
            <div
                class="terminal"
                id="terminal"
            >

                <div class="term-line term-cyan">
                    NikhilOS Terminal 2.0
                </div>

                <div class="term-line term-dim">
                    Digital Universe shell
                </div>

                <br>

                <div class="term-line">
                    Type <span class="term-blue">help</span>
                    to see available commands.
                </div>

                <br>

                <div id="terminalOutput"></div>

                <div>
                    <span class="term-prompt">
                        nikhil@universe:~$
                    </span>

                    <input
                        id="terminalInput"
                        class="term-input"
                        autocomplete="off"
                        spellcheck="false"
                        style="
                            background:transparent;
                            border:0;
                            outline:0;
                            width:60%;
                        "
                    >
                </div>

            </div>
        `;
    },


    music() {

        return `
            <div class="music-app">

                <div class="music-art">

                    <div
                        class="music-disc"
                        id="musicDisc"
                    ></div>

                </div>

                <div class="music-info">

                    <p>NOW PLAYING</p>

                    <h2>Digital Universe</h2>

                    <p>
                        NikhilOS System Soundtrack
                    </p>

                    <div class="music-progress">
                        <span></span>
                    </div>

                    <div class="music-controls">

                        <button
                            class="app-btn"
                            id="musicBack"
                        >
                            ‹‹
                        </button>

                        <button
                            class="app-btn primary"
                            id="musicPlay"
                        >
                            Play
                        </button>

                        <button
                            class="app-btn"
                            id="musicForward"
                        >
                            ››
                        </button>

                    </div>

                    <div style="margin-top:25px">

                        <button
                            class="app-btn"
                            id="musicOpen"
                        >
                            Open System Player
                        </button>

                    </div>

                </div>

            </div>
        `;
    },


    activity() {

        return `
            <div class="app-shell">

                <div class="app-heading">

                    <div>
                        <h2>Activity</h2>

                        <p>
                            Your NikhilOS session
                        </p>
                    </div>

                    <button
                        class="app-btn"
                        id="refreshActivity"
                    >
                        Refresh
                    </button>

                </div>

                <div
                    class="activity-grid"
                    id="act"
                >

                    <div class="activity-card">

                        <span>
                            SESSION
                        </span>

                        <strong id="actTime">
                            00:00
                        </strong>

                    </div>

                    <div class="activity-card">

                        <span>
                            APPS OPENED
                        </span>

                        <strong id="appsOpened">
                            0
                        </strong>

                    </div>

                    <div class="activity-card">

                        <span>
                            STATUS
                        </span>

                        <strong>
                            Online
                        </strong>

                    </div>

                </div>

                <div class="chart">

                    <div
                        class="chart-bar"
                        style="--height:35%"
                    ></div>

                    <div
                        class="chart-bar"
                        style="--height:55%"
                    ></div>

                    <div
                        class="chart-bar"
                        style="--height:45%"
                    ></div>

                    <div
                        class="chart-bar"
                        style="--height:72%"
                    ></div>

                    <div
                        class="chart-bar"
                        style="--height:58%"
                    ></div>

                    <div
                        class="chart-bar"
                        style="--height:84%"
                    ></div>

                    <div
                        class="chart-bar"
                        style="--height:67%"
                    ></div>

                </div>

            </div>
        `;
    },


    settings() {

        return `
            <div class="settings-app">

                <aside class="settings-side">

                    <button class="active">
                        ✦ Appearance
                    </button>

                    <button>
                        🔊 Sound
                    </button>

                    <button>
                        ⚡ System
                    </button>

                    <button>
                        🌱 About
                    </button>

                </aside>

                <main class="settings-content">

                    <div class="app-heading">

                        <div>
                            <h2>Settings</h2>

                            <p>
                                Shape your digital universe
                            </p>
                        </div>

                    </div>

                    <div class="setting-row">

                        <div>
                            <strong>
                                Interface glow
                            </strong>

                            <small>
                                Adjust the intensity of system lighting.
                            </small>
                        </div>

                        <input
                            class="range"
                            id="glowRange"
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                        >

                    </div>

                    <div class="setting-row">

                        <div>
                            <strong>
                                Reduced motion
                            </strong>

                            <small>
                                Reduce interface animation.
                            </small>
                        </div>

                        <label class="switch">

                            <input
                                type="checkbox"
                                id="motionToggle"
                            >

                            <span class="slider"></span>

                        </label>

                    </div>

                    <div class="setting-row">

                        <div>
                            <strong>
                                System music
                            </strong>

                            <small>
                                Play your local NikhilOS soundtrack.
                            </small>
                        </div>

                        <label class="switch">

                            <input
                                type="checkbox"
                                id="settingsMusic"
                            >

                            <span class="slider"></span>

                        </label>

                    </div>

                    <div class="setting-row">

                        <div>
                            <strong>
                                Accent theme
                            </strong>

                            <small>
                                Change the visual personality.
                            </small>
                        </div>

                        <div
                            style="
                                display:flex;
                                gap:5px;
                                flex-wrap:wrap;
                            "
                        >

                            <button
                                class="app-btn"
                                data-theme-choice="blue"
                            >
                                Blue
                            </button>

                            <button
                                class="app-btn"
                                data-theme-choice="violet"
                            >
                                Violet
                            </button>

                            <button
                                class="app-btn"
                                data-theme-choice="cyan"
                            >
                                Cyan
                            </button>

                            <button
                                class="app-btn"
                                data-theme-choice="emerald"
                            >
                                Emerald
                            </button>

                            <button
                                class="app-btn"
                                data-theme-choice="ember"
                            >
                                Ember
                            </button>

                        </div>

                    </div>

                    <div class="setting-row">

                        <div>
                            <strong>
                                NikhilOS
                            </strong>

                            <small>
                                Digital Universe Edition · 2.0
                            </small>
                        </div>

                        <span class="muted">
                            ✦
                        </span>

                    </div>

                </main>

            </div>
        `;
    }

};


/* =========================================================
   APP WINDOW CREATION
   ========================================================= */

function createAppWindows() {

    const desktop = $("#desktop");

    if (!desktop) {
        return;
    }

    appNames.forEach(app => {

        const existing = getWindow(app);

        if (existing) {
            return;
        }

        const title =
            app.charAt(0).toUpperCase() +
            app.slice(1);

        const win = document.createElement("section");

        win.className = "window";

        win.dataset.app = app;

        win.style.left =
            `${120 + Math.random() * 120}px`;

        win.style.top =
            `${75 + Math.random() * 70}px`;

        win.innerHTML = `

            <div class="window-bar">

                <div class="traffic">

                    <button
                        class="close"
                        aria-label="Close"
                    ></button>

                    <button
                        class="min"
                        aria-label="Minimize"
                    ></button>

                    <button
                        class="maximize"
                        aria-label="Maximize"
                    ></button>

                </div>

                <div class="window-title">
                    ${title}
                </div>

                <div style="width:75px"></div>

            </div>

            <div class="window-body">
                ${appContent[app]()}
            </div>

        `;

        desktop.appendChild(win);
    });

    setupWindows();
}


/* =========================================================
   NOTES
   ========================================================= */

let selectedNoteId = null;


function saveNotes() {
    storage.set(
        "nikhilos-notes",
        state.notes
    );
}


function renderNotes() {

    const list = $("#noteList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    state.notes.forEach(note => {

        const item =
            document.createElement("div");

        item.className = "note-item";

        if (note.id === selectedNoteId) {
            item.classList.add("active");
        }

        item.innerHTML = `
            <strong>
                ${escapeHTML(note.title || "Untitled")}
            </strong>

            <span>
                ${escapeHTML(
                    (note.body || "")
                        .replace(/\n/g, " ")
                        .slice(0, 60)
                )}
            </span>
        `;

        item.addEventListener("click", () => {

            selectedNoteId = note.id;

            loadSelectedNote();

            renderNotes();
        });

        list.appendChild(item);
    });
}


function loadSelectedNote() {

    const note =
        state.notes.find(
            item => item.id === selectedNoteId
        );

    if (!note) {
        return;
    }

    const title = $("#noteTitle");
    const body = $("#noteBody");

    if (title) {
        title.value = note.title;
    }

    if (body) {
        body.value = note.body;
    }
}


function newNote() {

    const note = {
        id: Date.now(),
        title: "New Note",
        body: ""
    };

    state.notes.unshift(note);

    selectedNoteId = note.id;

    saveNotes();

    renderNotes();

    loadSelectedNote();

    $("#noteTitle")?.focus();

    toast("New note created");
}


function saveCurrentNote() {

    if (!selectedNoteId) {
        return;
    }

    const note =
        state.notes.find(
            item => item.id === selectedNoteId
        );

    if (!note) {
        return;
    }

    note.title =
        $("#noteTitle")?.value.trim() ||
        "Untitled";

    note.body =
        $("#noteBody")?.value ||
        "";

    saveNotes();

    renderNotes();

    toast("Note saved");
}


function deleteCurrentNote() {

    if (!selectedNoteId) {
        return;
    }

    state.notes =
        state.notes.filter(
            note => note.id !== selectedNoteId
        );

    saveNotes();

    if (state.notes.length) {
        selectedNoteId =
            state.notes[0].id;
    } else {
        selectedNoteId = null;
    }

    renderNotes();

    if (selectedNoteId) {
        loadSelectedNote();
    } else {
        $("#noteTitle").value = "";
        $("#noteBody").value = "";
    }

    toast("Note deleted");
}


function setupNotes() {

    if (!getWindow("notes")) {
        return;
    }

    if (!state.notes.length) {
        newNote();
        return;
    }

    selectedNoteId =
        state.notes[0].id;

    renderNotes();

    loadSelectedNote();

    $("#newNote")?.addEventListener(
        "click",
        newNote
    );

    $("#saveNote")?.addEventListener(
        "click",
        saveCurrentNote
    );

    $("#deleteNote")?.addEventListener(
        "click",
        deleteCurrentNote
    );
}


/* =========================================================
   CAMERA
   ========================================================= */

async function startCamera() {

    const video = $("#cameraVideo");

    if (!video) {
        return;
    }

    if (state.cameraStream) {
        return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {

        toast(
            "Camera access is not supported here"
        );

        return;
    }

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

        state.cameraStream = stream;

        video.srcObject = stream;

        $("#cameraStatus").textContent =
            "Camera active";

        toast("Camera started");

    } catch (error) {

        console.error(error);

        $("#cameraStatus").textContent =
            "Permission required";

        toast(
            "Please allow camera access"
        );
    }
}


function stopCamera() {

    if (!state.cameraStream) {
        return;
    }

    state.cameraStream
        .getTracks()
        .forEach(track => track.stop());

    state.cameraStream = null;

    const video = $("#cameraVideo");

    if (video) {
        video.srcObject = null;
    }

    if ($("#cameraStatus")) {
        $("#cameraStatus").textContent =
            "Ready";
    }
}


function setupCamera() {

    $("#cameraStart")?.addEventListener(
        "click",
        startCamera
    );

    $("#cameraStop")?.addEventListener(
        "click",
        stopCamera
    );
}


/* =========================================================
   VIDEO RECORDER
   ========================================================= */

async function setupRecorderStream() {

    const preview = $("#studioPreview");

    if (!preview) {
        return null;
    }

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

        preview.srcObject = stream;

        return stream;

    } catch (error) {

        console.error(error);

        toast(
            "Camera and microphone permission required"
        );

        return null;
    }
}


async function startRecording() {

    if (state.recording) {
        return;
    }

    const preview = $("#studioPreview");

    if (!preview) {
        return;
    }

    const stream =
        await setupRecorderStream();

    if (!stream) {
        return;
    }

    state.recordedChunks = [];

    let options = {};

    if (
        MediaRecorder.isTypeSupported(
            "video/webm;codecs=vp9,opus"
        )
    ) {

        options.mimeType =
            "video/webm;codecs=vp9,opus";
    }

    try {

        const recorder =
            new MediaRecorder(
                stream,
                options
            );

        state.recorder = recorder;

        state.recording = true;

        recorder.ondataavailable = event => {

            if (event.data.size > 0) {
                state.recordedChunks.push(
                    event.data
                );
            }
        };

        recorder.onstop = saveRecording;

        recorder.start();

        const status =
            $("#recordStatus");

        if (status) {
            status.innerHTML =
                `<span class="record-dot"
                style="display:inline-block;margin-right:7px">
                </span> Recording`;
        }

        toast("Recording started");

    } catch (error) {

        console.error(error);

        stream
            .getTracks()
            .forEach(track => track.stop());

        toast("Unable to start recording");
    }
}


function stopRecording(showToast = true) {

    if (!state.recording) {
        return;
    }

    state.recording = false;

    if (state.recorder) {
        state.recorder.stop();
    }

    if (showToast) {
        toast("Recording stopped");
    }

    const status =
        $("#recordStatus");

    if (status) {
        status.textContent =
            "Processing...";
    }
}


function saveRecording() {

    const recorder =
        state.recorder;

    if (!recorder) {
        return;
    }

    const stream =
        $("#studioPreview")?.srcObject;

    if (stream) {
        stream
            .getTracks()
            .forEach(track => track.stop());
    }

    const blob =
        new Blob(
            state.recordedChunks,
            {
                type:
                    recorder.mimeType ||
                    "video/webm"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        `nikhilos-recording-${Date.now()}.webm`;

    link.textContent =
        "Download recording";

    link.className =
        "app-btn primary";

    link.style.marginLeft = "8px";

    const controls =
        $(".camera-controls", getWindow("studio"));

    if (controls) {

        const old =
            $("#downloadRecording");

        old?.remove();

        link.id =
            "downloadRecording";

        controls.appendChild(link);
    }

    const status =
        $("#recordStatus");

    if (status) {
        status.textContent =
            "Recording ready";
    }

    state.recorder = null;

    toast(
        "Recording ready to download"
    );
}


function setupStudio() {

    $("#recordStart")?.addEventListener(
        "click",
        startRecording
    );

    $("#recordStop")?.addEventListener(
        "click",
        () => stopRecording(true)
    );
}


/* =========================================================
   MUSIC
   ========================================================= */

function getAudio() {
    return $("#systemMusic");
}


function toggleMusic(sourceButton = null) {

    const audio =
        getAudio();

    if (!audio) {
        toast("Music element not found");
        return;
    }

    if (audio.paused) {

        audio.play()
            .then(() => {

                state.musicPlaying = true;

                updateMusicUI();

                if (sourceButton) {
                    sourceButton.textContent =
                        "Pause";
                }

                toast("Music playing");

            })
            .catch(() => {

                toast(
                    "Click the page once, then try again"
                );
            });

    } else {

        audio.pause();

        state.musicPlaying = false;

        updateMusicUI();

        if (sourceButton) {
            sourceButton.textContent =
                "Play";
        }
    }
}


function updateMusicUI() {

    const audio =
        getAudio();

    if (!audio) {
        return;
    }

    state.musicPlaying =
        !audio.paused;

    const disc =
        $("#musicDisc");

    if (disc) {
        disc.classList.toggle(
            "paused",
            !state.musicPlaying
        );
    }

    const playButton =
        $("#musicPlay");

    if (playButton) {
        playButton.textContent =
            state.musicPlaying
                ? "Pause"
                : "Play";
    }

    const settingsMusic =
        $("#settingsMusic");

    if (settingsMusic) {
        settingsMusic.checked =
            state.musicPlaying;
    }
}


function setupMusic() {

    const audio =
        getAudio();

    if (audio) {

        audio.addEventListener(
            "play",
            updateMusicUI
        );

        audio.addEventListener(
            "pause",
            updateMusicUI
        );
    }

    $("#musicPlay")?.addEventListener(
        "click",
        event => {
            toggleMusic(event.currentTarget);
        }
    );

    $("#musicOpen")?.addEventListener(
        "click",
        () => {

            const audio =
                getAudio();

            if (!audio) {
                return;
            }

            audio.controls = true;

            audio.style.position = "fixed";
            audio.style.left = "50%";
            audio.style.bottom = "95px";
            audio.style.transform =
                "translateX(-50%)";
            audio.style.zIndex = "9999";

            toast(
                "System player opened"
            );
        }
    );
}


/* =========================================================
   TERMINAL
   ========================================================= */

function terminalPrint(text, className = "") {

    const output =
        $("#terminalOutput");

    if (!output) {
        return;
    }

    const line =
        document.createElement("div");

    line.className =
        `term-line ${className}`;

    line.textContent =
        text;

    output.appendChild(line);

    output.scrollTop =
        output.scrollHeight;
}


function terminalCommand(command) {

    const clean =
        command.trim().toLowerCase();

    terminalPrint(
        `nikhil@universe:~$ ${command}`
    );

    if (!clean) {
        return;
    }

    switch (clean) {

        case "help":

            terminalPrint(
                "Available commands:",
                "term-cyan"
            );

            terminalPrint(
                "help     — show commands"
            );

            terminalPrint(
                "clear    — clear terminal"
            );

            terminalPrint(
                "date     — current date"
            );

            terminalPrint(
                "time     — current time"
            );

            terminalPrint(
                "apps     — show running apps"
            );

            terminalPrint(
                "about    — system information"
            );

            terminalPrint(
                "theme    — current theme"
            );

            terminalPrint(
                "hello    — say hello"
            );

            break;


        case "clear":

            $("#terminalOutput").innerHTML = "";

            break;


        case "date":

            terminalPrint(
                new Date().toLocaleDateString()
            );

            break;


        case "time":

            terminalPrint(
                new Date().toLocaleTimeString()
            );

            break;


        case "apps":

            terminalPrint(
                state.openApps.size
                    ? [...state.openApps].join(", ")
                    : "No apps currently open."
            );

            break;


        case "about":

            terminalPrint(
                "NikhilOS Digital Universe 2.0"
            );

            terminalPrint(
                "Browser-based personal desktop"
            );

            terminalPrint(
                "Built with HTML, CSS and JavaScript"
            );

            break;


        case "theme":

            terminalPrint(
                `Current theme: ${state.theme}`
            );

            break;


        case "hello":

            terminalPrint(
                "Hello, creator. 👋",
                "term-cyan"
            );

            break;


        default:

            terminalPrint(
                `Command not found: ${command}`,
                "term-dim"
            );

            terminalPrint(
                "Type 'help' for available commands."
            );
    }
}


function setupTerminal() {

    const input =
        $("#terminalInput");

    if (!input) {
        return;
    }

    input.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Enter") {
                return;
            }

            const command =
                input.value;

            input.value = "";

            terminalCommand(command);
        }
    );
}


/* =========================================================
   ARCADE
   ========================================================= */

let gameTimer = null;

let gameScore = 0;

function startGame(game) {

    const stage =
        $("#gameStage");

    const board =
        $("#gameBoard");

    const title =
        $("#gameTitle");

    const score =
        $("#gameScore");

    if (!stage || !board) {
        return;
    }

    clearInterval(gameTimer);

    board.innerHTML = "";

    gameScore = 0;

    score.textContent =
        "Score: 0";

    stage.classList.add("active");

    if (game === "memory") {

        title.textContent =
            "Memory Rush";

        startMemoryGame();

    } else if (game === "orbit") {

        title.textContent =
            "Orbit Tap";

        startOrbitGame();

    } else {

        title.textContent =
            "Reaction";

        startReactionGame();
    }
}


/* ---------------------------------------------------------
   MEMORY GAME
   --------------------------------------------------------- */

function startMemoryGame() {

    const board =
        $("#gameBoard");

    const sequence = [];

    const user = [];

    let level = 3;

    let accepting = false;

    const colors = [
        "A",
        "B",
        "C",
        "D"
    ];

    board.innerHTML = `
        <div
            style="
                position:absolute;
                inset:0;
                display:grid;
                place-items:center;
            "
        >

            <div
                style="
                    width:min(360px,90%);
                    text-align:center;
                "
            >

                <div
                    id="memoryMessage"
                    style="
                        margin-bottom:15px;
                        color:#a6aec3;
                        font-size:11px;
                    "
                >
                    Watch the sequence...
                </div>

                <div
                    id="memoryGrid"
                    style="
                        display:grid;
                        grid-template-columns:repeat(2,1fr);
                        gap:10px;
                    "
                >

                    ${colors.map(color => `
                        <button
                            class="memory-tile"
                            data-memory="${color}"
                            style="
                                height:85px;
                                border:1px solid rgba(255,255,255,.08);
                                border-radius:15px;
                                background:rgba(255,255,255,.04);
                                cursor:pointer;
                                font-size:20px;
                            "
                        >
                            ${color === "A" ? "◆" : ""}
                            ${color === "B" ? "●" : ""}
                            ${color === "C" ? "▲" : ""}
                            ${color === "D" ? "■" : ""}
                        </button>
                    `).join("")}

                </div>

            </div>

        </div>
    `;

    function nextRound() {

        accepting = false;

        const newItem =
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ];

        sequence.push(newItem);

        showSequence();
    }

    async function showSequence() {

        const message =
            $("#memoryMessage");

        message.textContent =
            "Watch carefully...";

        for (const value of sequence) {

            const tile =
                $(
                    `[data-memory="${value}"]`,
                    board
                );

            tile.style.background =
                "rgba(108,124,255,.45)";

            tile.style.transform =
                "scale(1.05)";

            await sleep(420);

            tile.style.background =
                "rgba(255,255,255,.04)";

            tile.style.transform =
                "scale(1)";

            await sleep(150);
        }

        message.textContent =
            "Your turn!";

        accepting = true;
    }

    $$(".memory-tile", board)
        .forEach(tile => {

            tile.addEventListener(
                "click",
                () => {

                    if (!accepting) {
                        return;
                    }

                    const value =
                        tile.dataset.memory;

                    const expected =
                        sequence[user.length];

                    if (value !== expected) {

                        accepting = false;

                        message.textContent =
                            `Game over — score ${gameScore}`;

                        return;
                    }

                    user.push(value);

                    gameScore += 10;

                    $("#gameScore").textContent =
                        `Score: ${gameScore}`;

                    if (
                        user.length ===
                        sequence.length
                    ) {

                        user.length = 0;

                        level++;

                        setTimeout(
                            nextRound,
                            550
                        );
                    }
                }
            );
        });

    nextRound();
}


/* ---------------------------------------------------------
   ORBIT GAME
   --------------------------------------------------------- */

function startOrbitGame() {

    const board =
        $("#gameBoard");

    board.innerHTML = `
        <div
            style="
                position:absolute;
                inset:0;
            "
            id="orbitArea"
        >

            <div
                style="
                    position:absolute;
                    left:50%;
                    top:50%;
                    width:90px;
                    height:90px;
                    transform:translate(-50%,-50%);
                    border-radius:50%;
                    border:1px solid rgba(255,255,255,.1);
                "
            ></div>

            <button
                id="orbitTarget"
                style="
                    position:absolute;
                    width:42px;
                    height:42px;
                    border-radius:50%;
                    border:1px solid rgba(255,255,255,.15);
                    background:linear-gradient(135deg,#45dfff,#6c7cff);
                    box-shadow:0 0 25px rgba(69,223,255,.35);
                    cursor:pointer;
                "
            >
                ✦
            </button>

        </div>
    `;

    const target =
        $("#orbitTarget");

    let start =
        Date.now();

    function moveTarget() {

        const area =
            $("#orbitArea");

        const maxX =
            area.clientWidth - 55;

        const maxY =
            area.clientHeight - 55;

        target.style.left =
            `${20 + Math.random() * maxX}px`;

        target.style.top =
            `${20 + Math.random() * maxY}px`;
    }

    target.addEventListener(
        "click",
        () => {

            gameScore += 10;

            $("#gameScore").textContent =
                `Score: ${gameScore}`;

            moveTarget();
        }
    );

    moveTarget();

    gameTimer =
        setInterval(() => {

            const elapsed =
                Date.now() - start;

            if (elapsed > 30000) {

                clearInterval(gameTimer);

                target.disabled = true;

                toast(
                    `Orbit finished — ${gameScore} points`
                );

                return;
            }

            moveTarget();

        }, 900);
}


/* ---------------------------------------------------------
   REACTION GAME
   --------------------------------------------------------- */

function startReactionGame() {

    const board =
        $("#gameBoard");

    board.innerHTML = `
        <div
            style="
                position:absolute;
                inset:0;
                display:grid;
                place-items:center;
            "
        >

            <button
                id="reactionButton"
                style="
                    width:170px;
                    height:170px;
                    border-radius:50%;
                    border:1px solid rgba(255,255,255,.12);
                    background:#121628;
                    color:#fff;
                    cursor:pointer;
                    font-size:14px;
                    box-shadow:0 20px 50px rgba(0,0,0,.35);
                "
            >
                Wait...
            </button>

        </div>
    `;

    const button =
        $("#reactionButton");

    let active = false;

    const delay =
        1200 + Math.random() * 3000;

    const timeout =
        setTimeout(() => {

            active = true;

            button.textContent =
                "CLICK!";

            button.style.background =
                "linear-gradient(135deg,#39e69c,#45dfff)";

        }, delay);

    button.addEventListener(
        "click",
        () => {

            if (!active) {

                clearTimeout(timeout);

                button.textContent =
                    "Too early!";

                return;
            }

            const points =
                Math.floor(
                    1000 /
                    Math.max(
                        1,
                        Date.now() -
                        (performance.now() % 100000)
                    )
                );

            gameScore +=
                Math.max(
                    10,
                    Math.min(100, points + 40)
                );

            $("#gameScore").textContent =
                `Score: ${gameScore}`;

            button.textContent =
                "Again!";

            active = false;

            setTimeout(
                startReactionGame,
                700
            );
        }
    );
}


/* =========================================================
   SETTINGS
   ========================================================= */

function setTheme(theme) {

    state.theme =
        theme;

    storage.set(
        "nikhilos-theme",
        theme
    );

    document.body.dataset.theme =
        theme;

    toast(
        `${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied`
    );
}


function setReducedMotion(enabled) {

    state.reduceMotion =
        enabled;

    storage.set(
        "nikhilos-reduced-motion",
        enabled
    );

    document.body.classList.toggle(
        "reduce-motion",
        enabled
    );
}


function setGlow(value) {

    state.glow =
        Number(value);

    storage.set(
        "nikhilos-glow",
        state.glow
    );

    document.documentElement.style
        .setProperty(
            "--glow",
            state.glow
        );
}


function refreshSettings() {

    const range =
        $("#glowRange");

    if (range) {
        range.value =
            state.glow;
    }

    const motion =
        $("#motionToggle");

    if (motion) {
        motion.checked =
            state.reduceMotion;
    }

    const music =
        $("#settingsMusic");

    if (music) {
        music.checked =
            state.musicPlaying;
    }
}


function setupSettings() {

    $("#glowRange")?.addEventListener(
        "input",
        event => {
            setGlow(
                event.target.value
            );
        }
    );

    $("#motionToggle")?.addEventListener(
        "change",
        event => {

            setReducedMotion(
                event.target.checked
            );

            toast(
                event.target.checked
                    ? "Reduced motion enabled"
                    : "Full motion enabled"
            );
        }
    );

    $("#settingsMusic")?.addEventListener(
        "change",
        () => {
            toggleMusic();
        }
    );

    $$("[data-theme-choice]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    setTheme(
                        button.dataset.themeChoice
                    );
                }
            );
        });
}


/* =========================================================
   CONTROL CENTER
   ========================================================= */

function setupControlCenter() {

    const button =
        $("#controlCenterButton");

    const panel =
        $("#controlCenter");

    if (!button || !panel) {
        return;
    }

    button.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            panel.classList.toggle("open");
        }
    );

    panel.addEventListener(
        "click",
        event => {
            event.stopPropagation();
        }
    );

    document.addEventListener(
        "click",
        () => {
            panel.classList.remove("open");
        }
    );
}


/* =========================================================
   GLOBAL APP BUTTONS
   ========================================================= */

function setupAppLaunchers() {

    $$("[data-app]").forEach(button => {

        const app =
            button.dataset.app;

        if (!appNames.includes(app)) {
            return;
        }

        if (button.classList.contains("window")) {
            return;
        }

        button.addEventListener(
            "click",
            () => {

                openApp(app);

                if (
                    button.closest(".dock")
                ) {
                    button.blur();
                }
            }
        );
    });
}


/* =========================================================
   APP SPECIFIC EVENTS
   ========================================================= */

function setupAppEvents() {

    /* Arcade */

    $$(".game-card").forEach(card => {

        card.addEventListener(
            "click",
            () => {
                startGame(
                    card.dataset.game
                );
            }
        );
    });

    $("#closeGame")?.addEventListener(
        "click",
        () => {

            clearInterval(gameTimer);

            $("#gameStage")
                ?.classList.remove("active");
        }
    );


    /* New folder */

    $("[data-action='new-folder']")
        ?.addEventListener(
            "click",
            () => {

                toast(
                    "New folder created locally"
                );
            }
        );


    /* Activity */

    $("#refreshActivity")
        ?.addEventListener(
            "click",
            updateActivity
        );
}


/* =========================================================
   ACTIVITY
   ========================================================= */

const sessionStarted =
    Date.now();

let appsOpenedCount = 0;


function updateActivity() {

    const seconds =
        Math.floor(
            (Date.now() - sessionStarted) /
            1000
        );

    const minutes =
        Math.floor(seconds / 60);

    const remaining =
        seconds % 60;

    const time =
        `${String(minutes).padStart(2, "0")}:` +
        `${String(remaining).padStart(2, "0")}`;

    if ($("#actTime")) {
        $("#actTime").textContent =
            time;
    }

    if ($("#appsOpened")) {
        $("#appsOpened").textContent =
            appsOpenedCount;
    }
}


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    const now =
        new Date();

    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    const date =
        now.toLocaleDateString(
            [],
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );

    const clock =
        $("#clock");

    if (clock) {
        clock.textContent =
            time;
    }

    const heroTime =
        $("#heroTime");

    if (heroTime) {
        heroTime.textContent =
            time;
    }

    const heroDate =
        $("#heroDate");

    if (heroDate) {
        heroDate.textContent =
            date;
    }

    const sessionTime =
        $("#sessionClock");

    if (sessionTime) {

        const seconds =
            Math.floor(
                (Date.now() - sessionStarted) /
                1000
            );

        const min =
            Math.floor(seconds / 60);

        const sec =
            seconds % 60;

        sessionTime.textContent =
            `${String(min).padStart(2, "0")}:` +
            `${String(sec).padStart(2, "0")}`;
    }

    updateActivity();
}


/* =========================================================
   BOOT
   ========================================================= */

function bootSequence() {

    const boot =
        $("#boot");

    if (!boot) {
        return;
    }

    const status =
        $("#bootStatus");

    const messages = [
        "Initializing universe...",
        "Loading interface...",
        "Connecting modules...",
        "Starting applications...",
        "Preparing desktop...",
        "Welcome back."
    ];

    let index = 0;

    const interval =
        setInterval(() => {

            if (status) {
                status.textContent =
                    messages[index];
            }

            index++;

            if (index >= messages.length) {

                clearInterval(interval);

                setTimeout(() => {

                    boot.classList.add("hide");

                }, 500);
            }

        }, 430);
}


/* =========================================================
   DOCK MAGNIFICATION
   ========================================================= */

function setupDock() {

    const dock =
        $(".dock");

    if (!dock) {
        return;
    }

    const items =
        $$(".dock-item", dock);

    dock.addEventListener(
        "mousemove",
        event => {

            items.forEach(item => {

                const rect =
                    item.getBoundingClientRect();

                const center =
                    rect.left +
                    rect.width / 2;

                const distance =
                    Math.abs(
                        event.clientX - center
                    );

                const influence =
                    Math.max(
                        0,
                        1 -
                        distance / 180
                    );

                const scale =
                    1 +
                    influence * 0.22;

                const translate =
                    influence * -8;

                item.style.transform =
                    `translateY(${translate}px) scale(${scale})`;
            });
        }
    );

    dock.addEventListener(
        "mouseleave",
        () => {

            items.forEach(item => {

                item.style.transform =
                    "";
            });
        }
    );
}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

function setupKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey ||
                 event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                openApp("terminal");
            }

            if (event.key === "Escape") {

                const game =
                    $("#gameStage");

                if (
                    game &&
                    game.classList.contains("active")
                ) {

                    game.classList.remove(
                        "active"
                    );

                    clearInterval(gameTimer);
                }
            }
        }
    );
}


/* =========================================================
   UTILITIES
   ========================================================= */

function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   SYSTEM STATE
   ========================================================= */

function applyStoredSettings() {

    document.body.dataset.theme =
        state.theme;

    document.body.classList.toggle(
        "reduce-motion",
        state.reduceMotion
    );

    document.documentElement.style
        .setProperty(
            "--glow",
            state.glow
        );
}


/* =========================================================
   APP OPEN TRACKING
   ========================================================= */

function trackAppOpening() {

    const originalOpenApp =
        openApp;

    window.nikhilOpenApp =
        originalOpenApp;
}


/* =========================================================
   INIT
   ========================================================= */

function init() {

    applyStoredSettings();

    createAppWindows();

    setupNotes();

    setupCamera();

    setupStudio();

    setupMusic();

    setupTerminal();

    setupSettings();

    setupControlCenter();

    setupAppLaunchers();

    setupAppEvents();

    setupDock();

    setupKeyboard();

    updateClock();

    setInterval(
        updateClock,
        1000
    );

    updateDock();

    trackAppOpening();

    bootSequence();

    /*
       Count applications as they are opened.
       This listener observes the running state.
    */

    let previousOpenCount =
        state.openApps.size;

    setInterval(() => {

        if (
            state.openApps.size >
            previousOpenCount
        ) {

            appsOpenedCount +=
                state.openApps.size -
                previousOpenCount;
        }

        previousOpenCount =
            state.openApps.size;

    }, 500);

    /*
       Give the desktop a tiny startup delay
       before opening nothing automatically.
    */

    console.log(
        "%c NikhilOS 2.0 ",
        "background:#6c7cff;color:white;padding:6px 10px;border-radius:6px;font-weight:bold"
    );

    console.log(
        "Digital Universe initialized."
    );
}


/* =========================================================
   START
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

} else {

    init();
}
