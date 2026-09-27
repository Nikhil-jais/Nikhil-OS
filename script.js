/* =========================================================
   NIKHILOS
   Core Desktop Engine
========================================================= */

"use strict";


/* =========================================================
   ELEMENTS
========================================================= */

const desktop = document.getElementById("desktop");
const bootScreen = document.getElementById("bootScreen");
const bootProgress = document.getElementById("bootProgress");
const bootStatus = document.getElementById("bootStatus");

const desktopIcons = document.getElementById("desktopIcons");
const welcomeCard = document.getElementById("welcomeCard");

const topClock = document.getElementById("topClock");
const topDate = document.getElementById("topDate");

const notification = document.getElementById("notification");
const notificationTitle = document.getElementById("notificationTitle");
const notificationText = document.getElementById("notificationText");

const controlCenter = document.getElementById("controlCenter");


/* =========================================================
   BOOT SYSTEM
========================================================= */

let bootValue = 0;

const bootMessages = [
    "Starting system...",
    "Loading desktop...",
    "Initializing apps...",
    "Preparing your universe...",
    "Almost ready..."
];

const bootTimer = setInterval(() => {

    bootValue += Math.random() * 10 + 5;

    if (bootValue >= 100) {
        bootValue = 100;
        clearInterval(bootTimer);

        bootProgress.style.width = "100%";
        bootStatus.textContent = "Welcome.";

        setTimeout(() => {
            bootScreen.classList.add("hidden");

            showNotification(
                "Welcome back",
                "NikhilOS is ready."
            );

        }, 600);

    } else {

        bootProgress.style.width = `${bootValue}%`;

        const index = Math.min(
            bootMessages.length - 1,
            Math.floor(bootValue / 20)
        );

        bootStatus.textContent = bootMessages[index];
    }

}, 180);


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const now = new Date();

    const hours = now.getHours()
        .toString()
        .padStart(2, "0");

    const minutes = now.getMinutes()
        .toString()
        .padStart(2, "0");

    topClock.textContent = `${hours}:${minutes}`;

    topDate.textContent =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric"
            }
        );
}

updateClock();
setInterval(updateClock, 1000);


/* =========================================================
   NOTIFICATIONS
========================================================= */

let notificationTimer;

function showNotification(title, message) {

    notificationTitle.textContent = title;
    notificationText.textContent = message;

    notification.classList.add("show");

    clearTimeout(notificationTimer);

    notificationTimer = setTimeout(() => {
        notification.classList.remove("show");
    }, 3500);
}


/* =========================================================
   WINDOW MANAGEMENT
========================================================= */

const windows = document.querySelectorAll(".app-window");

let highestZ = 200;

function getWindow(app) {
    return document.getElementById(`window-${app}`);
}

function focusWindow(win) {

    highestZ++;

    win.style.zIndex = highestZ;

    windows.forEach(window => {
        window.classList.remove("focused");
    });

    win.classList.add("focused");
}

function openApp(app) {

    const win = getWindow(app);

    if (!win) return;

    welcomeCard.classList.add("hidden");

    win.classList.remove("minimized");

    win.classList.add("open");

    focusWindow(win);

    showNotification(
        win.querySelector(".window-title")?.innerText || app,
        "Application opened."
    );
}

function closeApp(win) {

    win.classList.remove("open");
    win.classList.remove("maximized");
    win.classList.remove("minimized");

    if (
        document.querySelectorAll(
            ".app-window.open"
        ).length === 0
    ) {
        welcomeCard.classList.remove("hidden");
    }
}

function minimizeApp(win) {

    win.classList.add("minimized");

}

function maximizeApp(win) {

    win.classList.toggle("maximized");

    focusWindow(win);
}


/* =========================================================
   OPEN APP BUTTONS
========================================================= */

document.querySelectorAll("[data-open]").forEach(button => {

    button.addEventListener("click", () => {

        const app = button.dataset.open;

        openApp(app);

    });

});


/* =========================================================
   WINDOW BUTTONS
========================================================= */

windows.forEach(win => {

    win.addEventListener("mousedown", () => {
        focusWindow(win);
    });

    const close = win.querySelector(".window-close");
    const minimize = win.querySelector(".window-minimize");
    const maximize = win.querySelector(".window-maximize");

    close?.addEventListener("click", event => {

        event.stopPropagation();

        closeApp(win);

    });

    minimize?.addEventListener("click", event => {

        event.stopPropagation();

        minimizeApp(win);

    });

    maximize?.addEventListener("click", event => {

        event.stopPropagation();

        maximizeApp(win);

    });

});


/* =========================================================
   DRAGGABLE WINDOWS
========================================================= */

let draggedWindow = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

document.querySelectorAll(".window-titlebar")
    .forEach(titlebar => {

        titlebar.addEventListener(
            "mousedown",
            event => {

                const win =
                    titlebar.closest(".app-window");

                if (!win) return;

                if (
                    event.target.closest(
                        ".window-controls"
                    )
                ) {
                    return;
                }

                if (win.classList.contains("maximized")) {
                    return;
                }

                draggedWindow = win;

                const rect =
                    win.getBoundingClientRect();

                dragOffsetX =
                    event.clientX - rect.left;

                dragOffsetY =
                    event.clientY - rect.top;

                focusWindow(win);

                event.preventDefault();
            }
        );

    });


document.addEventListener("mousemove", event => {

    if (!draggedWindow) return;

    let x =
        event.clientX - dragOffsetX;

    let y =
        event.clientY - dragOffsetY;

    const maxX =
        window.innerWidth -
        draggedWindow.offsetWidth;

    const maxY =
        window.innerHeight -
        draggedWindow.offsetHeight -
        70;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(40, Math.min(y, maxY));

    draggedWindow.style.left = `${x}px`;
    draggedWindow.style.top = `${y}px`;

});


document.addEventListener("mouseup", () => {

    draggedWindow = null;

});


/* =========================================================
   SYSTEM MENUS
========================================================= */

document.querySelectorAll(".menu-button")
    .forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();

            const menuId =
                button.dataset.menu;

            const menu =
                document.getElementById(menuId);

            document
                .querySelectorAll(".dropdown-menu")
                .forEach(item => {

                    if (item !== menu) {
                        item.classList.remove("show");
                    }

                });

            menu.classList.toggle("show");

        });

    });


document.addEventListener("click", () => {

    document
        .querySelectorAll(".dropdown-menu")
        .forEach(menu => {

            menu.classList.remove("show");

        });

    controlCenter.classList.remove("show");

});


/* =========================================================
   SYSTEM MENU ACTIONS
========================================================= */

document.querySelectorAll("[data-action]")
    .forEach(button => {

        button.addEventListener("click", event => {

            const action =
                button.dataset.action;

            if (action === "about") {
                openApp("about");
            }

            if (action === "restart") {
                location.reload();
            }

            if (action === "sleep") {

                showNotification(
                    "Sleep mode",
                    "Good night, universe."
                );

                document.body.style.filter =
                    "brightness(.1)";

                setTimeout(() => {
                    document.body.style.filter =
                        "";
                }, 2000);
            }

            if (action === "toggleIcons") {

                desktopIcons.classList.toggle("hidden");

            }

            if (action === "wallpaper") {

                const wallpapers = [
                    "one",
                    "two",
                    "three",
                    "four"
                ];

                const current =
                    localStorage.getItem(
                        "nikhilosWallpaper"
                    ) || "one";

                const index =
                    wallpapers.indexOf(current);

                const next =
                    wallpapers[
                        (index + 1) %
                        wallpapers.length
                    ];

                setWallpaper(next);

            }

        });

    });


/* =========================================================
   CONTROL CENTER
========================================================= */

const controlButton =
    document.getElementById("controlButton");

controlButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        document
            .querySelectorAll(".dropdown-menu")
            .forEach(menu => {
                menu.classList.remove("show");
            });

        controlCenter.classList.toggle("show");

    }
);


controlCenter.addEventListener(
    "click",
    event => {
        event.stopPropagation();
    }
);


/* =========================================================
   SOUND
========================================================= */

let soundEnabled =
    localStorage.getItem("nikhilosSound")
    !== "off";

const soundButton =
    document.getElementById("soundButton");

const controlSound =
    document.getElementById("controlSound");


function updateSoundUI() {

    soundButton.textContent =
        soundEnabled ? "🔊" : "🔇";

    if (controlSound) {

        const small =
            controlSound.querySelector("small");

        const big =
            controlSound.querySelector("b");

        if (small) {
            small.textContent = "Sound";
        }

        if (big) {
            big.textContent =
                soundEnabled ? "On" : "Off";
        }

    }

}


function toggleSound() {

    soundEnabled = !soundEnabled;

    localStorage.setItem(
        "nikhilosSound",
        soundEnabled ? "on" : "off"
    );

    updateSoundUI();

    showNotification(
        "Sound",
        soundEnabled
            ? "Sound enabled."
            : "Sound disabled."
    );

}

soundButton.addEventListener(
    "click",
    toggleSound
);

controlSound.addEventListener(
    "click",
    toggleSound
);

updateSoundUI();


/* =========================================================
   NOTES
========================================================= */

const notesArea =
    document.getElementById("notesArea");

const noteSaved =
    document.getElementById("noteSaved");

const savedNotes =
    localStorage.getItem(
        "nikhilosNotes"
    );

if (savedNotes) {
    notesArea.value = savedNotes;
}


document
    .getElementById("saveNote")
    .addEventListener("click", () => {

        localStorage.setItem(
            "nikhilosNotes",
            notesArea.value
        );

        noteSaved.textContent =
            "Saved just now";

        showNotification(
            "Notes",
            "Your note was saved locally."
        );

        setTimeout(() => {

            noteSaved.textContent =
                "Saved locally";

        }, 2000);

    });


document
    .getElementById("newNote")
    .addEventListener("click", () => {

        notesArea.value = "";

        notesArea.focus();

        noteSaved.textContent =
            "New note";

    });


/* =========================================================
   CALCULATOR
========================================================= */

const calcExpression =
    document.getElementById(
        "calcExpression"
    );

const calcResult =
    document.getElementById(
        "calcResult"
    );

let calcValue = "";
let calcLastResult = "0";


function updateCalculator() {

    calcExpression.textContent =
        calcValue;

    calcResult.textContent =
        calcLastResult;

}


function calculate() {

    if (!calcValue) return;

    try {

        let expression =
            calcValue.replace(
                /%/g,
                "/100"
            );

        if (
            !/^[0-9+\-*/().\s]+$/
                .test(expression)
        ) {
            throw new Error("Invalid");
        }

        const result =
            Function(
                `"use strict"; return (${expression})`
            )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid");
        }

        calcLastResult =
            Number(result.toFixed(10))
                .toString();

    } catch {

        calcLastResult =
            "Error";

    }

    updateCalculator();
}


document
    .querySelectorAll("[data-calc]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.dataset.calc;

                if (value === "clear") {

                    calcValue = "";
                    calcLastResult = "0";

                } else if (value === "back") {

                    calcValue =
                        calcValue.slice(0, -1);

                } else if (value === "=") {

                    calculate();

                } else {

                    calcValue += value;

                    calcLastResult =
                        calcValue;
                }

                updateCalculator();

            }
        );

    });


/* =========================================================
   BROWSER
========================================================= */

const browserFrame =
    document.getElementById(
        "browserFrame"
    );

const browserHome =
    document.getElementById(
        "browserHome"
    );

const browserAddress =
    document.getElementById(
        "browserAddress"
    );

const browserSearch =
    document.getElementById(
        "browserSearch"
    );


function openBrowserURL(url) {

    if (!url) return;

    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {

        url =
            "https://www.google.com/search?q=" +
            encodeURIComponent(url);

    }

    browserAddress.value = url;

    browserHome.style.display =
        "none";

    browserFrame.style.display =
        "block";

    browserFrame.src = url;

}


document
    .getElementById("browserGo")
    .addEventListener(
        "click",
        () => {

            openBrowserURL(
                browserAddress.value.trim()
            );

        }
    );


browserAddress.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            openBrowserURL(
                browserAddress.value.trim()
            );

        }

    }
);


document
    .getElementById(
        "browserSearchButton"
    )
    .addEventListener(
        "click",
        () => {

            const query =
                browserSearch.value.trim();

            if (!query) return;

            openBrowserURL(
                "https://www.google.com/search?q=" +
                encodeURIComponent(query)
            );

        }
    );


browserSearch.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            const query =
                browserSearch.value.trim();

            if (!query) return;

            openBrowserURL(
                "https://www.google.com/search?q=" +
                encodeURIComponent(query)
            );

        }

    }
);


document
    .querySelectorAll(".quick-links button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                openBrowserURL(
                    button.dataset.url
                );

            }
        );

    });


document
    .getElementById("browserReload")
    .addEventListener(
        "click",
        () => {

            if (browserFrame.src) {
                browserFrame.src =
                    browserFrame.src;
            }

        }
    );


/* =========================================================
   WALLPAPERS
========================================================= */

function setWallpaper(name) {

    desktop.classList.remove(
        "wallpaper-two",
        "wallpaper-three",
        "wallpaper-four"
    );

    if (name !== "one") {
        desktop.classList.add(
            `wallpaper-${name}`
        );
    }

    localStorage.setItem(
        "nikhilosWallpaper",
        name
    );

    showNotification(
        "Wallpaper",
        `${name.charAt(0).toUpperCase() + name.slice(1)} wallpaper applied.`
    );

}


const savedWallpaper =
    localStorage.getItem(
        "nikhilosWallpaper"
    );

if (savedWallpaper) {
    setWallpaper(savedWallpaper);
}


document
    .querySelectorAll("[data-wallpaper]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                setWallpaper(
                    button.dataset.wallpaper
                );

            }
        );

    });


/* =========================================================
   DESKTOP ICON SETTING
========================================================= */

const iconsToggle =
    document.getElementById(
        "iconsToggle"
    );

const savedIcons =
    localStorage.getItem(
        "nikhilosIcons"
    );

if (savedIcons === "off") {

    desktopIcons.classList.add("hidden");

    iconsToggle.checked = false;

}


iconsToggle.addEventListener(
    "change",
    () => {

        const visible =
            iconsToggle.checked;

        desktopIcons.classList.toggle(
            "hidden",
            !visible
        );

        localStorage.setItem(
            "nikhilosIcons",
            visible ? "on" : "off"
        );

    }
);


/* =========================================================
   BRIGHTNESS
========================================================= */

const brightnessSlider =
    document.getElementById(
        "brightnessSlider"
    );

brightnessSlider.addEventListener(
    "input",
    () => {

        desktop.style.filter =
            `brightness(${brightnessSlider.value}%)`;

    }
);


/* =========================================================
   MINI GAME
========================================================= */

const gameStart =
    document.getElementById(
        "gameStart"
    );

const gameStar =
    document.getElementById(
        "gameStar"
    );

const gameScore =
    document.getElementById(
        "gameScore"
    );

const gameTimer =
    document.getElementById(
        "gameTimer"
    );

const startGameButton =
    document.getElementById(
        "startGame"
    );

const resetGameButton =
    document.getElementById(
        "resetGame"
    );

let score = 0;
let gameTime = 30;
let gameRunning = false;
let gameInterval;


function moveStar() {

    const area =
        gameStar.parentElement;

    const maxX =
        area.clientWidth -
        gameStar.offsetWidth -
        10;

    const maxY =
        area.clientHeight -
        gameStar.offsetHeight -
        10;

    const x =
        Math.random() *
        Math.max(10, maxX);

    const y =
        Math.random() *
        Math.max(10, maxY);

    gameStar.style.left =
        `${x}px`;

    gameStar.style.top =
        `${y}px`;

}


function startGame() {

    if (gameRunning) return;

    score = 0;
    gameTime = 30;
    gameRunning = true;

    gameScore.textContent =
        score;

    gameTimer.textContent =
        `${gameTime} seconds`;

    gameStart.style.display =
        "none";

    gameStar.style.display =
        "flex";

    moveStar();

    gameInterval =
        setInterval(() => {

            gameTime--;

            gameTimer.textContent =
                `${gameTime} seconds`;

            if (gameTime <= 0) {

                endGame();

            }

        }, 1000);

}


function endGame() {

    gameRunning = false;

    clearInterval(gameInterval);

    gameStar.style.display =
        "none";

    gameStart.style.display =
        "flex";

    gameStart.querySelector("h3")
        .textContent =
        `Game Over — ${score} points`;

    gameStart.querySelector("p")
        .textContent =
        "Press start to play again.";

}


function resetGame() {

    clearInterval(gameInterval);

    gameRunning = false;

    score = 0;
    gameTime = 30;

    gameScore.textContent =
        "0";

    gameTimer.textContent =
        "30 seconds";

    gameStar.style.display =
        "none";

    gameStart.style.display =
        "flex";

    gameStart.querySelector("h3")
        .textContent =
        "Catch the Star";

    gameStart.querySelector("p")
        .textContent =
        "Click the star as many times as you can.";

}


startGameButton.addEventListener(
    "click",
    startGame
);

resetGameButton.addEventListener(
    "click",
    resetGame
);


gameStar.addEventListener(
    "click",
    event => {

        if (!gameRunning) return;

        event.stopPropagation();

        score++;

        gameScore.textContent =
            score;

        moveStar();

    }
);


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "n"
        ) {

            event.preventDefault();

            openApp("notes");

        }

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "b"
        ) {

            event.preventDefault();

            openApp("browser");

        }

        if (event.key === "Escape") {

            controlCenter.classList.remove(
                "show"
            );

            document
                .querySelectorAll(
                    ".dropdown-menu"
                )
                .forEach(menu => {
                    menu.classList.remove(
                        "show"
                    );
                });

        }

    }
);


/* =========================================================
   DARK MODE
========================================================= */

const darkModeToggle =
    document.getElementById(
        "darkModeToggle"
    );

darkModeToggle.addEventListener(
    "change",
    () => {

        if (!darkModeToggle.checked) {

            desktop.style.filter =
                "brightness(1.2)";

            showNotification(
                "Appearance",
                "Brightness increased."
            );

        } else {

            desktop.style.filter =
                "";

        }

    }
);


/* =========================================================
   INITIAL CALCULATOR
========================================================= */

updateCalculator();


/* =========================================================
   INITIAL MESSAGE
========================================================= */

setTimeout(() => {

    if (
        !bootScreen.classList.contains(
            "hidden"
        )
    ) {
        return;
    }

    showNotification(
        "NikhilOS",
        "Everything is ready."
    );

}, 2500);
