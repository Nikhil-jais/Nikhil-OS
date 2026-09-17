// ==================== BACKGROUND MUSIC ====================

const bgMusic = new Audio("assets/audio/music.mp3");

bgMusic.loop = true;
bgMusic.volume = 0.35;

// Start music after the player's first click
document.addEventListener("click", () => {
    bgMusic.play().catch(() => {});
}, { once: true });

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const storage = {
    get(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        } catch {
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {}
    }
};


/* =========================================
   BOOT
========================================= */

const bootScreen = $("#bootScreen");

setTimeout(() => {
    if (bootScreen) {
        bootScreen.style.opacity = "0";

        setTimeout(() => {
            bootScreen.remove();
        }, 500);
    }
}, 1800);


/* =========================================
   WINDOW SYSTEM
========================================= */

let highestZ = 50;

function openWindow(id) {

    const windowElement = $("#" + id);

    if (!windowElement) return;

    $$(".window").forEach(windowItem => {
        windowItem.classList.remove("active");
    });

    windowElement.classList.add("active");

    highestZ++;

    windowElement.style.zIndex = highestZ;
}

function closeWindow(windowElement) {

    if (!windowElement) return;

    windowElement.classList.remove("active");

    if (windowElement.id === "cameraWindow") {
        stopCamera();
    }

    if (windowElement.id === "videoWindow") {
        stopRecording();
    }
}

$$("[data-open]").forEach(button => {

    button.addEventListener("click", () => {
        openWindow(button.dataset.open);
    });

});

$$(".window").forEach(windowElement => {

    const closeButton = $(".close", windowElement);
    const minimizeButton = $(".minimize", windowElement);

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            closeWindow(windowElement);
        });
    }

    if (minimizeButton) {
        minimizeButton.addEventListener("click", () => {
            windowElement.classList.remove("active");
        });
    }

    windowElement.addEventListener("pointerdown", () => {
        highestZ++;
        windowElement.style.zIndex = highestZ;
    });

});


$("#topSettings")?.addEventListener("click", () => {
    openWindow("settingsWindow");
});


/* =========================================
   DRAGGABLE WINDOWS
========================================= */

$$(".window-header").forEach(header => {

    let dragging = false;

    let startX = 0;
    let startY = 0;

    let originalX = 0;
    let originalY = 0;

    header.addEventListener("pointerdown", event => {

        if (event.target.closest("button")) {
            return;
        }

        const windowElement = header.closest(".window");

        if (!windowElement) return;

        const rect = windowElement.getBoundingClientRect();

        dragging = true;

        startX = event.clientX;
        startY = event.clientY;

        originalX = rect.left;
        originalY = rect.top;

        windowElement.style.transform = "none";

        windowElement.style.left = originalX + "px";
        windowElement.style.top = originalY + "px";

        header.setPointerCapture(event.pointerId);

    });

    header.addEventListener("pointermove", event => {

        if (!dragging) return;

        const windowElement = header.closest(".window");

        const newX = Math.max(
            5,
            Math.min(
                window.innerWidth - windowElement.offsetWidth - 5,
                originalX + event.clientX - startX
            )
        );

        const newY = Math.max(
            5,
            Math.min(
                window.innerHeight - windowElement.offsetHeight - 70,
                originalY + event.clientY - startY
            )
        );

        windowElement.style.left = newX + "px";
        windowElement.style.top = newY + "px";

    });

    header.addEventListener("pointerup", () => {
        dragging = false;
    });

});


/* =========================================
   CLOCK
========================================= */

function updateClock() {

    const now = new Date();

    $("#clock").textContent =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
}

updateClock();

setInterval(updateClock, 1000);


/* =========================================
   NOTES
========================================= */

const notesKey = "nikhilOS_notes";

$("#notesArea").value =
    storage.get(notesKey, "");

$("#saveNotes").addEventListener("click", () => {

    storage.set(
        notesKey,
        $("#notesArea").value
    );

    $("#notesStatus").textContent =
        "Saved just now ✓";

    setTimeout(() => {
        $("#notesStatus").textContent =
            "Saved locally";
    }, 1800);

});


/* =========================================
   MUSIC
========================================= */

const music = $("#bgMusic");

let musicEnabled =
    storage.get("nikhilOS_music", true);

music.volume = 0.22;

$("#soundToggle").checked =
    musicEnabled;

async function startMusic() {

    if (!musicEnabled) return;

    try {

        await music.play();

        $("#musicStatus").textContent =
            "Music is ON";

    } catch {

        $("#musicStatus").textContent =
            "Click once to start";

    }
}

document.addEventListener(
    "pointerdown",
    startMusic,
    { once: true }
);

$("#soundToggle").addEventListener(
    "change",
    event => {

        musicEnabled =
            event.target.checked;

        storage.set(
            "nikhilOS_music",
            musicEnabled
        );

        if (musicEnabled) {
            startMusic();
        } else {
            music.pause();
        }

        $("#musicStatus").textContent =
            musicEnabled
                ? "Music is ON"
                : "Music is OFF";
    }
);


/* =========================================
   THEMES
========================================= */

const themes = [
    "light",
    "dark",
    "yellow",
    "pink"
];

let currentTheme =
    storage.get(
        "nikhilOS_theme",
        "light"
    );

function applyTheme(theme) {

    if (!themes.includes(theme)) {
        theme = "light";
    }

    currentTheme = theme;

    storage.set(
        "nikhilOS_theme",
        theme
    );

    document.body.classList.remove(
        "theme-dark",
        "theme-yellow",
        "theme-pink"
    );

    if (theme !== "light") {

        document.body.classList.add(
            "theme-" + theme
        );
    }

    $$(".theme-card").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.theme === theme
        );

    });

    const moods = {

        light:
            "☀️ Happy little day",

        dark:
            "🌙 Cozy night",

        yellow:
            "💛 Golden adventure",

        pink:
            "💗 Sakura dream"

    };

    $("#moodText").textContent =
        moods[theme];

}

applyTheme(currentTheme);

$$(".theme-card").forEach(button => {

    button.addEventListener(
        "click",
        () => {
            applyTheme(
                button.dataset.theme
            );
        }
    );

});


/* =========================================
   PETALS / PARTICLES
========================================= */

let petalsEnabled =
    storage.get(
        "nikhilOS_petals",
        true
    );

$("#petalToggle").checked =
    petalsEnabled;

let particleInterval;

function createParticle() {

    if (!petalsEnabled) return;

    const particle =
        document.createElement("span");

    particle.className = "particle";

    particle.textContent =
        [
            "🌸",
            "✦",
            "✨",
            "🍃",
            "🩷"
        ][
            Math.floor(
                Math.random() * 5
            )
        ];

    particle.style.left =
        Math.random() * 100 + "%";

    particle.style.top =
        "-30px";

    particle.style.setProperty(
        "--duration",
        5 + Math.random() * 5 + "s"
    );

    particle.style.fontSize =
        9 + Math.random() * 12 + "px";

    $("#particleLayer").appendChild(
        particle
    );

    setTimeout(() => {
        particle.remove();
    }, 10000);
}

function restartParticles() {

    clearInterval(
        particleInterval
    );

    if (petalsEnabled) {

        particleInterval =
            setInterval(
                createParticle,
                650
            );
    }
}

restartParticles();

$("#petalToggle").addEventListener(
    "change",
    event => {

        petalsEnabled =
            event.target.checked;

        storage.set(
            "nikhilOS_petals",
            petalsEnabled
        );

        restartParticles();
    }
);


/* =========================================
   ROAMING ANIMALS
========================================= */

let animalsEnabled =
    storage.get(
        "nikhilOS_animals",
        true
    );

$("#animalToggle").checked =
    animalsEnabled;

const animals = [
    "🐱",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐥",
    "🐶",
    "🦋"
];

function createAnimals() {

    $("#animalLayer").innerHTML = "";

    if (!animalsEnabled) {
        return;
    }

    animals.slice(0, 7).forEach(
        (animal, index) => {

            const element =
                document.createElement("span");

            element.className =
                "animal";

            element.textContent =
                animal;

            element.style.top =
                25 +
                index * 8 +
                Math.random() * 7 +
                "%";

            element.style.left =
                -10 -
                index * 5 +
                "vw";

            element.style.setProperty(
                "--duration",
                18 + index * 4 + "s"
            );

            element.style.animationDelay =
                -index * 3 + "s";

            $("#animalLayer").appendChild(
                element
            );
        }
    );
}

createAnimals();

$("#animalToggle").addEventListener(
    "change",
    event => {

        animalsEnabled =
            event.target.checked;

        storage.set(
            "nikhilOS_animals",
            animalsEnabled
        );

        createAnimals();
    }
);


/* =========================================
   GOOD DEEDS
========================================= */

let goodDeeds =
    storage.get(
        "nikhilOS_goodDeeds",
        0
    );

const goodDeedMessages = [
    "A tiny kindness can brighten someone's day. 🌱",
    "Your little garden grew! 🌸",
    "Kindness +1. Keep going. ✨",
    "You planted a happy thought. 🌷",
    "Tiny good actions still matter. 💛",
    "Your world feels a little warmer today. 🦋"
];

function updateDeeds() {

    $("#deedCount").textContent =
        "Good deeds: " + goodDeeds;
}

updateDeeds();

$("#goodDeedButton").addEventListener(
    "click",
    () => {

        goodDeeds++;

        storage.set(
            "nikhilOS_goodDeeds",
            goodDeeds
        );

        updateDeeds();

        $("#goodDeedText").textContent =
            goodDeedMessages[
                Math.floor(
                    Math.random() *
                    goodDeedMessages.length
                )
            ];

        for (let i = 0; i < 7; i++) {

            setTimeout(() => {

                const particle =
                    document.createElement("span");

                particle.className =
                    "particle";

                particle.textContent =
                    "💖";

                particle.style.left =
                    40 + Math.random() * 20 + "%";

                particle.style.top =
                    40 + Math.random() * 10 + "%";

                particle.style.setProperty(
                    "--duration",
                    "2s"
                );

                $("#particleLayer")
                    .appendChild(particle);

                setTimeout(
                    () => particle.remove(),
                    2100
                );

            }, i * 90);
        }

    }
);


/* =========================================
   SLEEP MODE
========================================= */

$("#sleepButton").addEventListener(
    "click",
    () => {
        $("#sleepOverlay")
            .classList.add("active");
    }
);

$("#sleepOverlay").addEventListener(
    "click",
    () => {
        $("#sleepOverlay")
            .classList.remove("active");
    }
);


/* =========================================
   CAMERA
========================================= */

let cameraStream = null;

async function startCamera() {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        $("#cameraStatus").textContent =
            "Your browser does not support camera access.";

        return;
    }

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });

        $("#cameraPreview").srcObject =
            cameraStream;

        $("#cameraStatus").textContent =
            "Camera is live! 📷";

    } catch {

        $("#cameraStatus").textContent =
            "Camera permission was not granted.";

    }
}

function stopCamera() {

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(track => {
                track.stop();
            });

        cameraStream = null;
    }

    if ($("#cameraPreview")) {
        $("#cameraPreview").srcObject = null;
    }
}

$("#startCamera").addEventListener(
    "click",
    startCamera
);

$("#takePhoto").addEventListener(
    "click",
    () => {

        if (!cameraStream) {

            $("#cameraStatus").textContent =
                "Start the camera first.";

            return;
        }

        const video =
            $("#cameraPreview");

        const canvas =
            $("#cameraCanvas");

        canvas.width =
            video.videoWidth || 640;

        canvas.height =
            video.videoHeight || 480;

        const context =
            canvas.getContext("2d");

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const image =
            document.createElement("img");

        image.src =
            canvas.toDataURL("image/png");

        $("#photoGallery")
            .prepend(image);

        $("#cameraStatus").textContent =
            "Photo captured! ✨";

    }
);


/* =========================================
   VIDEO RECORDER
========================================= */

let recordingStream = null;
let recorder = null;
let recordingChunks = [];
let recordingStart = 0;
let recordingTimer = null;

async function prepareRecorder() {

    recordingStream =
        await navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true
            });

    $("#recordPreview").srcObject =
        recordingStream;
}

async function startRecording() {

    try {

        if (!recordingStream) {
            await prepareRecorder();
        }

        recordingChunks = [];

        recorder =
            new MediaRecorder(
                recordingStream
            );

        recorder.ondataavailable =
            event => {

                if (event.data.size > 0) {

                    recordingChunks.push(
                        event.data
                    );
                }
            };

        recorder.onstop = () => {

            const blob =
                new Blob(
                    recordingChunks,
                    {
                        type:
                            recorder.mimeType ||
                            "video/webm"
                    }
                );

            const url =
                URL.createObjectURL(blob);

            $("#recordPlayback").src =
                url;

            $("#recordPlayback").hidden =
                false;

            $("#downloadRecording").href =
                url;

            $("#downloadRecording").download =
                "nikhilOS-video.webm";

            $("#downloadRecording").hidden =
                false;
        };

        recorder.start();

        recordingStart =
            Date.now();

        $("#recordDot")
            .classList.add("recording");

        $("#recordStatus").textContent =
            "Recording...";

        $("#startRecording").disabled =
            true;

        $("#stopRecording").disabled =
            false;

        clearInterval(recordingTimer);

        recordingTimer =
            setInterval(() => {

                const seconds =
                    Math.floor(
                        (Date.now() -
                            recordingStart) /
                        1000
                    );

                const minutes =
                    Math.floor(
                        seconds / 60
                    );

                const remaining =
                    seconds % 60;

                $("#recordTimer").textContent =
                    String(minutes).padStart(
                        2,
                        "0"
                    ) +
                    ":" +
                    String(remaining).padStart(
                        2,
                        "0"
                    );

            }, 250);

    } catch {

        $("#recordStatus").textContent =
            "Camera or microphone permission was not granted.";

    }
}

function stopRecording() {

    if (
        recorder &&
        recorder.state !== "inactive"
    ) {

        recorder.stop();
    }

    if (recordingStream) {

        recordingStream
            .getTracks()
            .forEach(track => {
                track.stop();
            });

        recordingStream = null;
    }

    clearInterval(
        recordingTimer
    );

    $("#recordDot")
        .classList.remove("recording");

    $("#recordStatus").textContent =
        "Ready";

    $("#startRecording").disabled =
        false;

    $("#stopRecording").disabled =
        true;
}

$("#startRecording").addEventListener(
    "click",
    startRecording
);

$("#stopRecording").addEventListener(
    "click",
    stopRecording
);


/* =========================================
   ORIGINAL ANIME-INSPIRED GALLERY
========================================= */

const galleryScenes = [
    ["Sky Train","A tiny train above the clouds","🚋","#7ed5ff","#ffb7d8"],
    ["Sakura Street","Lanterns after the rain","🏮","#ffc6df","#9b83ed"],
    ["Forest Friend","A quiet green afternoon","🦊","#9fe3bb","#75b9ff"],
    ["Moon City","Lights in a sleepy city","🌙","#292551","#8d82ff"],
    ["Golden Hill","A warm sunset walk","🌄","#ffd77a","#ff9b75"],
    ["Ocean Day","A little blue adventure","🌊","#7dd9ee","#a6a4ff"],
    ["Cloud Café","Coffee above the clouds","☕","#d7eaff","#ffb7ca"],
    ["Star Garden","A garden under the stars","🌟","#6d67b5","#e8b7ff"],
    ["Rainy Window","A cozy room","☔","#8ab2d9","#c7b2ef"],
    ["Summer Path","A bright path home","🌻","#91e0a2","#ffe48c"],
    ["Tiny Shrine","Quiet evening lights","⛩️","#f5b5c9","#ffc96e"],
    ["Dream Lake","Reflections and fireflies","🪷","#86cfe1","#c9a7f5"]
];

function createSceneSVG(scene) {

    const [
        title,
        description,
        emoji,
        color1,
        color2
    ] = scene;

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400">
<defs>
<linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
<stop stop-color="${color1}"/>
<stop offset="1" stop-color="${color2}"/>
</linearGradient>
</defs>

<rect width="500" height="400" fill="url(#background)"/>

<circle
cx="400"
cy="75"
r="48"
fill="rgba(255,255,255,.55)"
/>

<path
d="M0 280 Q100 210 190 275 T380 255 T500 270 V400 H0Z"
fill="rgba(40,110,100,.35)"
/>

<path
d="M0 325 Q120 270 250 325 T500 310 V400 H0Z"
fill="rgba(40,100,90,.45)"
/>

<circle cx="70" cy="95" r="5" fill="white"/>
<circle cx="115" cy="150" r="4" fill="white"/>
<circle cx="330" cy="140" r="4" fill="white"/>
<circle cx="430" cy="190" r="5" fill="white"/>

<text
x="250"
y="225"
text-anchor="middle"
font-size="70"
>${emoji}</text>

<text
x="250"
y="350"
text-anchor="middle"
font-family="Arial"
font-size="24"
font-weight="700"
fill="white"
>${title}</text>

</svg>
`;

    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );
}

$("#galleryGrid").innerHTML =
    galleryScenes
        .map(
            (scene, index) => {

                return `
<div class="gallery-card">

<img
src="${createSceneSVG(scene)}"
alt="${scene[0]}"
>

<b>${scene[0]}</b>

<small>
${scene[1]}
</small>

</div>
`;
            }
        )
        .join("");


/* =========================================
   GITHUB PROFILE
========================================= */

const savedGithubUsername =
    storage.get(
        "nikhilOS_github",
        "Nikhil-jais"
    );

$("#githubUsername").value =
    savedGithubUsername;

async function loadGithubProfile() {

    const username =
        $("#githubUsername")
            .value
            .trim();

    if (!username) return;

    storage.set(
        "nikhilOS_github",
        username
    );

    $("#githubProfile").innerHTML =
        `<div class="empty">
            Loading GitHub profile ✨
        </div>`;

    try {

        const userResponse =
            await fetch(
                "https://api.github.com/users/" +
                encodeURIComponent(username)
            );

        if (!userResponse.ok) {
            throw new Error("Profile not found");
        }

        const user =
            await userResponse.json();

        let repositories = [];

        try {

            const repositoryResponse =
                await fetch(
                    user.repos_url +
                    "?sort=updated&per_page=6"
                );

            if (repositoryResponse.ok) {

                repositories =
                    await repositoryResponse.json();
            }

        } catch {}

        $("#githubProfile").innerHTML = `

<div class="github-card">

<div class="github-main">

<img
src="${user.avatar_url}"
alt="GitHub avatar"
>

<div>

<h2>
${escapeHTML(user.name || user.login)}
</h2>

<p>
@${escapeHTML(user.login)}
</p>

<p>
${escapeHTML(
    user.bio ||
    "Building little things on the internet ✨"
)}
</p>

</div>

</div>


<div class="github-stats">

<div class="github-stat">
<b>${user.public_repos}</b>
<small>Public repos</small>
</div>

<div class="github-stat">
<b>${user.followers}</b>
<small>Followers</small>
</div>

<div class="github-stat">
<b>${user.following}</b>
<small>Following</small>
</div>

</div>


<div class="repo-list">

${repositories
    .map(repo => {

        return `
<div class="repo">

<b>
${escapeHTML(repo.name)}
</b>

<span>
${escapeHTML(
    repo.description ||
    "No description"
)}
 · ⭐ ${repo.stargazers_count}

</span>

</div>
`;

    })
    .join("")}

</div>

</div>
`;

    } catch {

        $("#githubProfile").innerHTML =
            `<div class="empty">
                Could not load this public profile.
                Check the username or internet connection.
            </div>`;
    }
}

function escapeHTML(value) {

    return String(value)
        .replace(
            /[&<>"']/g,
            character => {

                const map = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#039;"
                };

                return map[character];
            }
        );
}

$("#loadGithub").addEventListener(
    "click",
    loadGithubProfile
);

$("#githubUsername").addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            loadGithubProfile();
        }
    }
);


/* =========================================
   SELF MESSAGES
========================================= */

const chatKey =
    "nikhilOS_messages";

let messages =
    storage.get(
        chatKey,
        []
    );

function renderMessages() {

    $("#chatMessages").innerHTML =
        messages
            .map(message => {

                return `
<div class="bubble">

${escapeHTML(message.text)}

<small>
${escapeHTML(message.time)}
</small>

</div>
`;

            })
            .join("");

    $("#chatMessages").scrollTop =
        $("#chatMessages").scrollHeight;
}

renderMessages();

$("#chatForm").addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const input =
            $("#chatInput");

        const text =
            input.value.trim();

        if (!text) return;

        messages.push({
            text,
            time:
                new Date()
                    .toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )
        });

        messages =
            messages.slice(-100);

        storage.set(
            chatKey,
            messages
        );

        input.value = "";

        renderMessages();
    }
);


/* =========================================
   GAME CENTER
========================================= */

const gameDefinitions = [

    ["reaction","⚡","Lightning Reflex","Wait for the green flash.","Reaction"],

    ["stars","⭐","Star Catcher","Catch the moving stars.","Catch"],

    ["ball","🏀","Bouncy Ball","Catch the bouncing ball.","Catch"],

    ["neko","🐱","Neko Chase","Catch the sneaky cat.","Catch"],

    ["memory","🧠","Memory Garden","Match every pair.","Memory"],

    ["math","➕","Math Dash","Solve as many sums as possible.","Brain"],

    ["color","🎨","Color Call","Tap the requested color.","Brain"],

    ["whack","🔨","Mochi Whack","Hit the mochi.","Arcade"],

    ["typing","⌨️","Speed Type","Type the displayed word.","Typing"],

    ["sequence","🔴","Color Sequence","Remember the sequence.","Memory"],

    ["balloon","🎈","Balloon Pop","Pop floating balloons.","Catch"],

    ["fish","🐟","Fish Catch","Catch the quick fish.","Catch"],

    ["crystal","💎","Crystal Hunt","Collect crystals.","Catch"],

    ["runner","🏃","Tiny Runner","Jump over obstacles.","Run"],

    ["frog","🐸","Frog Jump","Jump over obstacles.","Jump"],

    ["dodge","🛸","Meteor Dodge","Avoid meteors.","Dodge"],

    ["rocket","🚀","Rocket Road","Fly through the meteor lane.","Road"],

    ["duck","🦆","Duck Dash","Protect the duck.","Road"],

    ["snake","🐍","Garden Snake","Classic snake controls.","Arcade"],

    ["pong","🏓","Pocket Pong","Return the ball.","Arcade"],

    ["breakout","🧱","Star Breaker","Break the blocks.","Arcade"],

    ["maze","🗺️","Tiny Maze","Find the exit.","Puzzle"]

];

$("#gamesGrid").innerHTML =
    gameDefinitions
        .map(game => {

            return `
<article class="game-card">

<span class="game-tag">
${game[4]}
</span>

<span class="emoji">
${game[1]}
</span>

<b>
${game[2]}
</b>

<p>
${game[3]}
</p>

<button data-game="${game[0]}">
Play
</button>

</article>
`;

        })
        .join("");


let selectedGame = null;
let gameScore = 0;
let gameTime = 20;
let gameTimer = null;
let gameCleanup = () => {};
let gameRunning = false;

let bestScore =
    storage.get(
        "nikhilOS_bestScore",
        0
    );

$("#bestScore").textContent =
    bestScore;


function updateGameScore(value) {

    gameScore = value;

    $("#gameScore").textContent =
        gameScore;
}


function startGameTimer(seconds) {

    clearInterval(gameTimer);

    gameTime = seconds;

    $("#gameTime").textContent =
        gameTime;

    gameTimer =
        setInterval(() => {

            gameTime--;

            $("#gameTime").textContent =
                gameTime;

            if (gameTime <= 0) {
                finishGame();
            }

        }, 1000);
}


function finishGame(message = "Time's up! ✨") {

    if (!gameRunning) return;

    gameRunning = false;

    clearInterval(gameTimer);

    gameCleanup();

    if (gameScore > bestScore) {

        bestScore =
            gameScore;

        storage.set(
            "nikhilOS_bestScore",
            bestScore
        );

        $("#bestScore").textContent =
            bestScore;
    }

    $("#gameMessage").textContent =
        message +
        " Score: " +
        gameScore;
}


function resetArena() {

    const arena =
        $("#gameArena");

    arena.innerHTML = `
<div id="gameMessage" class="game-message">
Get ready...
</div>
`;

    return arena;
}


function randomPosition() {

    return [
        5 + Math.random() * 85,
        8 + Math.random() * 78
    ];
}


function placeElement(element) {

    const [
        x,
        y
    ] = randomPosition();

    element.style.left =
        x + "%";

    element.style.top =
        y + "%";
}


$$("[data-game]").forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                launchGame(
                    button.dataset.game
                );
            }
        );

    }
);


function launchGame(id) {

    selectedGame = id;

    const definition =
        gameDefinitions.find(
            game => game[0] === id
        );

    if (!definition) return;

    openWindow(
        "gamePlayWindow"
    );

    $("#gameTitle").textContent =
        definition[2];

    $("#gameDescription").textContent =
        definition[3];

    updateGameScore(0);

    clearInterval(gameTimer);

    gameCleanup();

    gameRunning = true;

    const games = {

        reaction: gameReaction,

        stars: gameMovingTarget,

        ball: gameMovingTarget,

        neko: gameMovingTarget,

        balloon: gameMovingTarget,

        fish: gameMovingTarget,

        crystal: gameMovingTarget,

        memory: gameMemory,

        math: gameMath,

        color: gameColor,

        whack: gameWhack,

        typing: gameTyping,

        sequence: gameSequence,

        runner: gameRunner,

        frog: gameRunner,

        dodge: gameDodge,

        rocket: gameDodge,

        duck: gameDodge,

        snake: gameSnake,

        pong: gamePong,

        breakout: gameBreakout,

        maze: gameMaze

    };

    games[id]();
}


$("#startGame").addEventListener(
    "click",
    () => {

        if (selectedGame) {
            launchGame(
                selectedGame
            );
        }

    }
);


$("#restartGame").addEventListener(
    "click",
    () => {

        if (selectedGame) {
            launchGame(
                selectedGame
            );
        }

    }
);


$("#backToGames").addEventListener(
    "click",
    () => {

        clearInterval(gameTimer);

        gameCleanup();

        openWindow(
            "gamesWindow"
        );
    }
);


/* =========================================
   GAME 1 — REACTION
========================================= */

function gameReaction() {

    const arena =
        resetArena();

    const message =
        $("#gameMessage");

    message.textContent =
        "Wait...";

    let ready = false;
    let finished = false;

    const delay =
        1200 +
        Math.random() * 2500;

    const timeout =
        setTimeout(() => {

            if (!gameRunning) return;

            ready = true;

            message.textContent =
                "GO!";

            const target =
                document.createElement(
                    "button"
                );

            target.className =
                "game-target";

            target.textContent =
                "⚡";

            target.style.background =
                "#74d99b";

            target.style.left =
                "46%";

            target.style.top =
                "42%";

            arena.appendChild(
                target
            );

            target.addEventListener(
                "click",
                () => {

                    if (finished) return;

                    finished = true;

                    updateGameScore(
                        10
                    );

                    clearInterval(
                        gameTimer
                    );

                    gameRunning = false;

                    message.textContent =
                        "Lightning fast! ⚡";
                }
            );

        }, delay);

    arena.addEventListener(
        "click",
        event => {

            if (
                !ready &&
                event.target === arena
            ) {

                clearTimeout(
                    timeout
                );

                gameRunning = false;

                clearInterval(
                    gameTimer
                );

                message.textContent =
                    "Too early! 😭";
            }

        }
    );

    startGameTimer(7);

    gameCleanup = () => {

        clearTimeout(timeout);

        arena.onclick = null;
    };
}


/* =========================================
   MOVING TARGET GAMES
========================================= */

function gameMovingTarget() {

    const arena =
        resetArena();

    const message =
        $("#gameMessage");

    message.textContent =
        "Catch it!";

    const target =
        document.createElement(
            "button"
        );

    target.className =
        "game-target";

    const emojis = {

        stars:"⭐",

        ball:"🏀",

        neko:"🐱",

        balloon:"🎈",

        fish:"🐟",

        crystal:"💎"

    };

    target.textContent =
        emojis[selectedGame] ||
        "✨";

    arena.appendChild(
        target
    );

    function move() {
        placeElement(target);
    }

    target.addEventListener(
        "click",
        () => {

            updateGameScore(
                gameScore + 1
            );

            move();

        }
    );

    move();

    startGameTimer(20);

    gameCleanup = () => {
        target.remove();
    };
}


/* =========================================
   MEMORY
========================================= */

function gameMemory() {

    const arena =
        resetArena();

    const message =
        $("#gameMessage");

    message.textContent =
        "Find the pairs!";

    const values = [
        "🌸","🌸",
        "⭐","⭐",
        "🐱","🐱",
        "🍀","🍀",
        "💎","💎",
        "🌙","🌙",
        "🍓","🍓",
        "🦋","🦋"
    ].sort(
        () => Math.random() - .5
    );

    const board =
        document.createElement(
            "div"
        );

    board.className =
        "memory-board";

    arena.appendChild(
        board
    );

    let selected = [];
    let matches = 0;
    let locked = false;

    values.forEach(value => {

        const card =
            document.createElement(
                "button"
            );

        card.className =
            "memory-card";

        card.textContent =
            "?";

        card.dataset.value =
            value;

        board.appendChild(
            card
        );

        card.addEventListener(
            "click",
            () => {

                if (
                    locked ||
                    selected.includes(card) ||
                    card.classList.contains("open")
                ) {
                    return;
                }

                card.classList.add("open");

                card.textContent =
                    value;

                selected.push(card);

                if (
                    selected.length === 2
                ) {

                    locked = true;

                    if (
                        selected[0]
                            .dataset.value ===
                        selected[1]
                            .dataset.value
                    ) {

                        matches++;

                        updateGameScore(
                            matches * 2
                        );

                        selected = [];

                        locked = false;

                        if (
                            matches === 8
                        ) {

                            clearInterval(
                                gameTimer
                            );

                            gameRunning = false;

                            message.textContent =
                                "Garden complete! 🌸";
                        }

                    } else {

                        setTimeout(
                            () => {

                                selected.forEach(
                                    item => {

                                        item.classList.remove(
                                            "open"
                                        );

                                        item.textContent =
                                            "?";
                                    }
                                );

                                selected = [];

                                locked = false;

                            },
                            600
                        );
                    }
                }

            }
        );

    });

    startGameTimer(40);

    gameCleanup = () => {
        board.remove();
    };
}


/* =========================================
   MATH
========================================= */

function gameMath() {

    const arena =
        resetArena();

    const message =
        $("#gameMessage");

    message.textContent =
        "Solve!";

    const container =
        document.createElement(
            "div"
        );

    container.className =
        "math-game";

    const question =
        document.createElement(
            "div"
        );

    question.className =
        "math-question";

    const buttons =
        document.createElement(
            "div"
        );

    buttons.className =
        "answer-buttons";

    container.appendChild(
        question
    );

    container.appendChild(
        buttons
    );

    arena.appendChild(
        container
    );

    function nextQuestion() {

        const a =
            Math.floor(
                Math.random() * 12
            ) + 1;

        const b =
            Math.floor(
                Math.random() * 12
            ) + 1;

        const answer =
            a + b;

        question.textContent =
            a +
            " + " +
            b +
            " = ?";

        buttons.innerHTML = "";

        const choices = [
            answer,
            answer + 1,
            answer - 1,
            answer + 3
        ].sort(
            () => Math.random() - .5
        );

        choices.forEach(
            choice => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.textContent =
                    choice;

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            choice === answer
                        ) {

                            updateGameScore(
                                gameScore + 1
                            );

                            nextQuestion();

                        } else {

                            message.textContent =
                                "Try the next one!";

                        }

                    }
                );

                buttons.appendChild(
                    button
                );
            }
        );
    }

    nextQuestion();

    startGameTimer(20);

    gameCleanup = () => {
        container.remove();
    };
}


/* =========================================
   COLOR
========================================= */

function gameColor() {

    const arena =
        resetArena();

    const message =
        $("#gameMessage");

    const colors = [
        ["Pink","#ff79b1"],
        ["Purple","#9b83ed"],
        ["Blue","#70c9ed"],
        ["Yellow","#ffd96b"]
    ];

    const container =
        document.createElement(
            "div"
        );

    container.className =
        "math-game";

    const question =
        document.createElement(
            "div"
        );

    question.className =
        "math-question";

    const buttons =
        document.createElement(
            "div"
        );

    buttons.className =
        "answer-buttons";

    container.appendChild(
        question
    );

    container.appendChild(
        buttons
    );

    arena.appendChild(
        container
    );

    let current;

    function next() {

        current =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];

        question.textContent =
            "Tap " +
            current[0];

        buttons.innerHTML = "";

        colors.forEach(
            color => {

                const button =
                    document.createElement(
                        "button"
                    );

                button.textContent =
                    color[0];

                button.style.background =
                    color[1];

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            color[0] ===
                            current[0]
                        ) {

                            updateGameScore(
                                gameScore + 1
                            );

                            next();

                        } else {

                            message.textContent =
                                "Wrong color! 🎨";
                        }

                    }
                );

                buttons.appendChild(
                    button
                );

            }
        );
    }

    next();

    startGameTimer(20);

    gameCleanup = () => {
        container.remove();
    };
}


/* =========================================
   WHACK
========================================= */

function gameWhack() {

    const arena =
        resetArena();

    const target =
        document.createElement(
            "button"
        );

    target.className =
        "game-target";

    target.textContent =
        "🍡";

    arena.appendChild(
        target
    );

    function move() {
        placeElement(target);
    }

    target.addEventListener(
        "click",
        () => {

            updateGameScore(
                gameScore + 1
            );

            move();
        }
    );

    move();

    startGameTimer(20);

    gameCleanup = () => {
        target.remove();
    };
}


/* =========================================
   TYPING
========================================= */

function gameTyping() {

    const arena =
        resetArena();

    const container =
        document.createElement(
            "div"
        );

    container.className =
        "typing-game";

    container.innerHTML = `
<div class="typing-word"></div>
<input
class="typing-input"
autocomplete="off"
spellcheck="false"
placeholder="Type the word..."
>
`;

    arena.appendChild(
        container
    );

    const wordElement =
        $(".typing-word", container);

    const input =
        $(".typing-input", container);

    const words = [
        "sakura",
        "neko",
        "starlight",
        "sunshine",
        "moon",
        "rainbow",
        "adventure",
        "dream",
        "forest",
        "kindness",
        "pixel",
        "galaxy"
    ];

    let word;

    function nextWord() {

        word =
            words[
                Math.floor(
                    Math.random() *
                    words.length
                )
            ];

        wordElement.textContent =
            word;

        input.value = "";

        input.focus();
    }

    input.addEventListener(
        "input",
        () => {

            if (
                input.value
                    .toLowerCase() ===
                word
            ) {

                updateGameScore(
                    gameScore + 1
                );

                nextWord();
            }

        }
    );

    nextWord();

    startGameTimer(25);

    gameCleanup = () => {
        container.remove();
    };
}


/* =========================================
   SEQUENCE
========================================= */

function gameSequence() {

    const arena =
        resetArena();

    const message =
        $("#gameMessage");

    const colors = [
        "🔴",
        "🔵",
        "🟡",
        "🟢"
    ];

    const buttons =
        document.createElement(
            "div"
        );

    buttons.className =
        "answer-buttons";

    arena.appendChild(
        buttons
    );

    let sequence = [];
    let playerSequence = [];
    let round = 3;

    function createSequence() {

        sequence = [];

        playerSequence = [];

        for (
            let i = 0;
            i < round;
            i++
        ) {

            sequence.push(
                colors[
                    Math.floor(
                        Math.random() *
                        colors.length
                    )
                ]
            );
        }

        message.textContent =
            "Watch...";

        sequence.forEach(
            (item, index) => {

                setTimeout(
                    () => {

                        message.textContent =
                            item;

                    },
                    index * 550
                );

            }
        );

        setTimeout(
            () => {

                message.textContent =
                    "Repeat it!";

                buttons.innerHTML = "";

                colors.forEach(
                    (color, index) => {

                        const button =
                            document.createElement(
                                "button"
                            );

                        button.textContent =
                            color;

                        button.addEventListener(
                            "click",
                            () => {

                                playerSequence.push(
                                    colors[index]
                                );

                                const position =
                                    playerSequence.length - 1;

                                if (
                                    playerSequence[position] !==
                                    sequence[position]
                                ) {

                                    clearInterval(
                                        gameTimer
                                    );

                                    gameRunning = false;

                                    message.textContent =
                                        "Oops! Sequence broken.";

                                    return;
                                }

                                if (
                                    playerSequence.length ===
                                    sequence.length
                                ) {

                                    updateGameScore(
                                        gameScore + round
                                    );

                                    round++;

                                    setTimeout(
                                        createSequence,
                                        400
                                    );
                                }

                            }
                        );

                        buttons.appendChild(
                            button
                        );

                    }
                );

            },
            round * 550 + 300
        );
    }

    createSequence();

    startGameTimer(40);

    gameCleanup = () => {
        buttons.remove();
    };
}


/* =========================================
   RUNNER / FROG
========================================= */

function gameRunner() {

    const arena =
        resetArena();

    const message =
        $("#gameMessage");

    message.textContent =
        "Press SPACE, ↑ or tap to jump!";

    const player =
        document.createElement(
            "div"
        );

    player.textContent =
        selectedGame === "frog"
            ? "🐸"
            : "🏃";

    player.style.cssText =
        `
position:absolute;
left:12%;
bottom:18px;
font-size:38px;
transition:bottom .15s;
`;

    const obstacle =
        document.createElement(
            "div"
        );

    obstacle.textContent =
        selectedGame === "frog"
            ? "🪨"
            : "🌵";

    obstacle.style.cssText =
        `
position:absolute;
right:-10%;
bottom:17px;
font-size:30px;
`;

    arena.appendChild(
        player
    );

    arena.appendChild(
        obstacle
    );

    let jumping = false;
    let x = 100;

    function jump() {

        if (
            jumping ||
            !gameRunning
        ) {
            return;
        }

        jumping = true;

        player.style.bottom =
            "125px";

        setTimeout(
            () => {

                player.style.bottom =
                    "18px";

                setTimeout(
                    () => {
                        jumping = false;
                    },
                    150
                );

            },
            300
        );
    }

    function keyboard(event) {

        if (
            event.code === "Space" ||
            event.key === "ArrowUp"
        ) {
            jump();
        }
    }

    document.addEventListener(
        "keydown",
        keyboard
    );

    arena.addEventListener(
        "pointerdown",
        jump
    );

    const loop =
        setInterval(
            () => {

                x -= 2.4;

                if (x < -10) {

                    x = 100;

                    updateGameScore(
                        gameScore + 1
                    );
                }

                obstacle.style.right =
                    (100 - x) + "%";

                if (
                    x < 22 &&
                    x > 5 &&
                    !jumping
                ) {

                    finishGame(
                        "Bonk! 💥"
                    );
                }

            },
            45
        );

    startGameTimer(25);

    gameCleanup = () => {

        clearInterval(loop);

        document.removeEventListener(
            "keydown",
            keyboard
        );

        player.remove();

        obstacle.remove();
    };
}


/* =========================================
   DODGE / ROCKET / DUCK
========================================= */

function gameDodge() {

    const arena =
        resetArena();

    const message =
        $("#gameMessage");

    message.textContent =
        "Move with ← → or your mouse.";

    const player =
        document.createElement(
            "div"
        );

    player.textContent =
        selectedGame === "rocket"
            ? "🚀"
            : selectedGame === "duck"
                ? "🦆"
                : "🛸";

    player.style.cssText =
        `
position:absolute;
left:48%;
bottom:15px;
font-size:36px;
`;

    arena.appendChild(
        player
    );

    let playerX = 48;

    const objects = [];

    function movePlayer(value) {

        playerX =
            Math.max(
                3,
                Math.min(
                    92,
                    value
                )
            );

        player.style.left =
            playerX + "%";
    }

    function keyboard(event) {

        if (
            event.key ===
            "ArrowLeft"
        ) {

            movePlayer(
                playerX - 5
            );
        }

        if (
            event.key ===
            "ArrowRight"
        ) {

            movePlayer(
                playerX + 5
            );
        }
    }

    document.addEventListener(
        "keydown",
        keyboard
    );

    arena.addEventListener(
        "pointermove",
        event => {

            const rect =
                arena.getBoundingClientRect();

            const value =
                (
                    (event.clientX -
                        rect.left) /
                    rect.width
                ) * 100;

            movePlayer(value);
        }
    );

    const spawn =
        setInterval(
            () => {

                const object =
                    document.createElement(
                        "div"
                    );

                object.textContent =
                    selectedGame === "duck"
                        ? "🪨"
                        : "☄️";

                object.style.cssText =
                    `
position:absolute;
top:-35px;
font-size:27px;
`;

                object.style.left =
                    3 +
                    Math.random() *
                    90 +
                    "%";

                arena.appendChild(
                    object
                );

                objects.push({
                    element:object,
                    y:-35,
                    x:parseFloat(
                        object.style.left
                    )
                });

            },
            550
        );

    const loop =
        setInterval(
            () => {

                for (
                    let i = objects.length - 1;
                    i >= 0;
                    i--
                ) {

                    const object =
                        objects[i];

                    object.y += 4;

                    object.element.style.top =
                        object.y + "px";

                    if (
                        object.y > 360
                    ) {

                        object.element.remove();

                        objects.splice(
                            i,
                            1
                        );

                        updateGameScore(
                            gameScore + 1
                        );

                        continue;
                    }

                    if (
                        object.y > 285 &&
                        Math.abs(
                            object.x -
                            playerX
                        ) < 8
                    ) {

                        finishGame(
                            "You got hit! 💫"
                        );

                        return;
                    }
                }

            },
            45
        );

    startGameTimer(25);

    gameCleanup = () => {

        clearInterval(spawn);
        clearInterval(loop);

        document.removeEventListener(
            "keydown",
            keyboard
        );

        objects.forEach(
            object => {
                object.element.remove();
            }
        );

        player.remove();
    };
}


/* =========================================
   SNAKE
========================================= */

function gameSnake() {

    const arena =
        resetArena();

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.className =
        "game-canvas";

    canvas.width = 620;
    canvas.height = 360;

    arena.appendChild(
        canvas
    );

    const context =
        canvas.getContext("2d");

    const size = 18;

    const columns = 34;
    const rows = 20;

    let snake = [
        {
            x:10,
            y:10
        }
    ];

    let direction = {
        x:1,
        y:0
    };

    let nextDirection =
        direction;

    let food = {
        x:20,
        y:10
    };

    function keyboard(event) {

        if (
            event.key === "ArrowUp" &&
            direction.y !== 1
        ) {

            nextDirection = {
                x:0,
                y:-1
            };
        }

        if (
            event.key === "ArrowDown" &&
            direction.y !== -1
        ) {

            nextDirection = {
                x:0,
                y:1
            };
        }

        if (
            event.key === "ArrowLeft" &&
            direction.x !== 1
        ) {

            nextDirection = {
                x:-1,
                y:0
            };
        }

        if (
            event.key === "ArrowRight" &&
            direction.x !== -1
        ) {

            nextDirection = {
                x:1,
                y:0
            };
        }
    }

    document.addEventListener(
        "keydown",
        keyboard
    );

    function draw() {

        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        context.fillStyle =
            "rgba(255,255,255,.55)";

        context.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        context.font =
            "18px sans-serif";

        context.fillText(
            "🍓",
            food.x * size,
            food.y * size + 17
        );

        snake.forEach(
            (part,index) => {

                context.fillText(
                    index === 0
                        ? "🐍"
                        : "🟢",
                    part.x * size,
                    part.y * size + 17
                );

            }
        );
    }

    const loop =
        setInterval(
            () => {

                direction =
                    nextDirection;

                const head = {
                    x:
                        snake[0].x +
                        direction.x,

                    y:
                        snake[0].y +
                        direction.y
                };

                const hitWall =
                    head.x < 0 ||
                    head.y < 0 ||
                    head.x >= columns ||
                    head.y >= rows;

                const hitSelf =
                    snake.some(
                        part =>
                            part.x === head.x &&
                            part.y === head.y
                    );

                if (
                    hitWall ||
                    hitSelf
                ) {

                    finishGame(
                        "Snake took a nap! 🐍"
                    );

                    return;
                }

                snake.unshift(
                    head
                );

                if (
                    head.x === food.x &&
                    head.y === food.y
                ) {

                    updateGameScore(
                        gameScore + 1
                    );

                    food = {
                        x:
                            Math.floor(
                                Math.random() *
                                columns
                            ),

                        y:
                            Math.floor(
                                Math.random() *
                                rows
                            )
                    };

                } else {

                    snake.pop();
                }

                draw();

            },
            120
        );

    draw();

    startGameTimer(40);

    gameCleanup = () => {

        clearInterval(loop);

        document.removeEventListener(
            "keydown",
            keyboard
        );

        canvas.remove();
    };
}


/* =========================================
   PONG
========================================= */

function gamePong() {

    const arena =
        resetArena();

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.className =
        "game-canvas";

    canvas.width = 620;
    canvas.height = 360;

    arena.appendChild(
        canvas
    );

    const context =
        canvas.getContext("2d");

    let paddleY = 145;

    let ballX = 310;
    let ballY = 180;

    let velocityX = -4;
    let velocityY = 3;

    function keyboard(event) {

        if (
            event.key === "ArrowUp"
        ) {
            paddleY -= 20;
        }

        if (
            event.key === "ArrowDown"
        ) {
            paddleY += 20;
        }

        paddleY =
            Math.max(
                0,
                Math.min(
                    290,
                    paddleY
                )
            );
    }

    document.addEventListener(
        "keydown",
        keyboard
    );

    arena.addEventListener(
        "pointermove",
        event => {

            const rect =
                arena.getBoundingClientRect();

            paddleY =
                (
                    (event.clientY -
                        rect.top) /
                    rect.height
                ) * 360 - 35;

            paddleY =
                Math.max(
                    0,
                    Math.min(
                        290,
                        paddleY
                    )
                );
        }
    );

    const loop =
        setInterval(
            () => {

                ballX += velocityX;
                ballY += velocityY;

                if (
                    ballY < 0 ||
                    ballY > 350
                ) {

                    velocityY *= -1;
                }

                if (
                    ballX > 570 &&
                    ballY > paddleY &&
                    ballY < paddleY + 70
                ) {

                    velocityX =
                        -Math.abs(
                            velocityX
                        );

                    updateGameScore(
                        gameScore + 1
                    );
                }

                if (
                    ballX < 25
                ) {

                    ballX = 310;
                    ballY = 180;

                    velocityX = 4;

                    updateGameScore(
                        Math.max(
                            0,
                            gameScore - 1
                        )
                    );
                }

                context.clearRect(
                    0,
                    0,
                    620,
                    360
                );

                context.fillStyle =
                    "rgba(255,255,255,.5)";

                context.fillRect(
                    0,
                    0,
                    620,
                    360
                );

                context.fillStyle =
                    "#9b83ed";

                context.fillRect(
                    14,
                    paddleY,
                    12,
                    70
                );

                context.fillStyle =
                    "#ff8fb8";

                context.fillRect(
                    594,
                    145,
                    12,
                    70
                );

                context.beginPath();

                context.arc(
                    ballX,
                    ballY,
                    9,
                    0,
                    Math.PI * 2
                );

                context.fill();

            },
            30
        );

    startGameTimer(30);

    gameCleanup = () => {

        clearInterval(loop);

        document.removeEventListener(
            "keydown",
            keyboard
        );

        canvas.remove();
    };
}


/* =========================================
   BREAKOUT
========================================= */

function gameBreakout() {

    const arena =
        resetArena();

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.className =
        "game-canvas";

    canvas.width = 620;
    canvas.height = 360;

    arena.appendChild(
        canvas
    );

    const context =
        canvas.getContext("2d");

    let paddleX = 270;

    let ballX = 310;
    let ballY = 300;

    let velocityX = 3;
    let velocityY = -4;

    const blocks = [];

    for (
        let row = 0;
        row < 4;
        row++
    ) {

        for (
            let column = 0;
            column < 9;
            column++
        ) {

            blocks.push({
                x:35 + column * 60,
                y:35 + row * 27,
                active:true
            });

        }
    }

    function keyboard(event) {

        if (
            event.key === "ArrowLeft"
        ) {
            paddleX -= 25;
        }

        if (
            event.key === "ArrowRight"
        ) {
            paddleX += 25;
        }

        paddleX =
            Math.max(
                0,
                Math.min(
                    540,
                    paddleX
                )
            );
    }

    document.addEventListener(
        "keydown",
        keyboard
    );

    arena.addEventListener(
        "pointermove",
        event => {

            const rect =
                arena.getBoundingClientRect();

            paddleX =
                (
                    (event.clientX -
                        rect.left) /
                    rect.width
                ) * 620 - 40;

            paddleX =
                Math.max(
                    0,
                    Math.min(
                        540,
                        paddleX
                    )
                );
        }
    );

    const loop =
        setInterval(
            () => {

                ballX += velocityX;
                ballY += velocityY;

                if (
                    ballX < 8 ||
                    ballX > 612
                ) {

                    velocityX *= -1;
                }

                if (
                    ballY < 8
                ) {

                    velocityY =
                        Math.abs(
                            velocityY
                        );
                }

                if (
                    ballY > 330 &&
                    ballX > paddleX &&
                    ballX < paddleX + 80
                ) {

                    velocityY =
                        -Math.abs(
                            velocityY
                        );
                }

                if (
                    ballY > 360
                ) {

                    ballX = 310;
                    ballY = 300;

                    velocityX = 3;
                    velocityY = -4;

                    updateGameScore(
                        Math.max(
                            0,
                            gameScore - 1
                        )
                    );
                }

                blocks.forEach(
                    block => {

                        if (
                            block.active &&
                            ballX > block.x &&
                            ballX <
                                block.x + 50 &&
                            ballY > block.y &&
                            ballY <
                                block.y + 17
                        ) {

                            block.active =
                                false;

                            velocityY *= -1;

                            updateGameScore(
                                gameScore + 1
                            );
                        }

                    }
                );

                context.clearRect(
                    0,
                    0,
                    620,
                    360
                );

                blocks.forEach(
                    block => {

                        if (
                            block.active
                        ) {

                            context.fillStyle =
                                "#ff8fb8";

                            context.fillRect(
                                block.x,
                                block.y,
                                50,
                                17
                            );
                        }
                    }
                );

                context.fillStyle =
                    "#9b83ed";

                context.fillRect(
                    paddleX,
                    335,
                    80,
                    10
                );

                context.beginPath();

                context.arc(
                    ballX,
                    ballY,
                    8,
                    0,
                    Math.PI * 2
                );

                context.fill();

            },
            30
        );

    startGameTimer(45);

    gameCleanup = () => {

        clearInterval(loop);

        document.removeEventListener(
            "keydown",
            keyboard
        );

        canvas.remove();
    };
}


/* =========================================
   MAZE
========================================= */

function gameMaze() {

    const arena =
        resetArena();

    const message =
        $("#gameMessage");

    const maze = [

        ["S","0","1","0","0","0","0"],

        ["0","0","1","0","1","1","0"],

        ["1","0","0","0","0","1","0"],

        ["1","1","1","1","0","1","0"],

        ["0","0","0","0","0","0","E"]

    ];

    let player = {
        row:0,
        column:0
    };

    const board =
        document.createElement(
            "div"
        );

    board.style.cssText =
        `
display:grid;
grid-template-columns:repeat(7,45px);
gap:4px;
justify-content:center;
padding-top:50px;
`;

    arena.appendChild(
        board
    );

    function drawMaze() {

        board.innerHTML = "";

        maze.forEach(
            (row,rowIndex) => {

                row.forEach(
                    (cell,columnIndex) => {

                        const tile =
                            document.createElement(
                                "div"
                            );

                        const playerHere =
                            player.row === rowIndex &&
                            player.column === columnIndex;

                        tile.style.cssText =
                            `
width:45px;
height:45px;
border-radius:10px;
display:grid;
place-items:center;
background:${
    playerHere
        ? "#ff8fb8"
        : cell === "1"
            ? "#786e88"
            : "rgba(255,255,255,.65)"
};
`;

                        if (
                            playerHere
                        ) {
                            tile.textContent =
                                "🧚";
                        } else if (
                            cell === "E"
                        ) {
                            tile.textContent =
                                "🏁";
                        }

                        board.appendChild(
                            tile
                        );

                    }
                );

            }
        );
    }

    drawMaze();

    function keyboard(event) {

        let newRow =
            player.row;

        let newColumn =
            player.column;

        if (
            event.key === "ArrowUp"
        ) {
            newRow--;
        }

        if (
            event.key === "ArrowDown"
        ) {
            newRow++;
        }

        if (
            event.key === "ArrowLeft"
        ) {
            newColumn--;
        }

        if (
            event.key === "ArrowRight"
        ) {
            newColumn++;
        }

        if (
            newRow < 0 ||
            newRow >= maze.length ||
            newColumn < 0 ||
            newColumn >= maze[0].length
        ) {
            return;
        }

        if (
            maze[newRow][newColumn] === "1"
        ) {
            return;
        }

        player.row =
            newRow;

        player.column =
            newColumn;

        drawMaze();

        if (
            maze[newRow][newColumn] === "E"
        ) {

            updateGameScore(10);

            clearInterval(
                gameTimer
            );

            gameRunning = false;

            message.textContent =
                "You found the exit! 🏁";
        }

    }

    document.addEventListener(
        "keydown",
        keyboard
    );

    startGameTimer(45);

    gameCleanup = () => {

        document.removeEventListener(
            "keydown",
            keyboard
        );

        board.remove();
    };
}


/* =========================================
   FAIRY SCROLL WAND
========================================= */

function checkScroll() {

    const scrollPosition =
        window.scrollY ||
        document.documentElement.scrollTop;

    $("#fairyScroll")
        .classList.toggle(
            "visible",
            scrollPosition > 50
        );
}

window.addEventListener(
    "scroll",
    checkScroll,
    {
        passive:true
    }
);

$("#fairyScroll").addEventListener(
    "click",
    () => {

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            setTimeout(
                () => {

                    const sparkle =
                        document.createElement(
                            "span"
                        );

                    sparkle.className =
                        "particle";

                    sparkle.textContent =
                        "✦";

                    sparkle.style.left =
                        88 +
                        Math.random() *
                        8 +
                        "%";

                    sparkle.style.top =
                        70 +
                        Math.random() *
                        10 +
                        "%";

                    sparkle.style.setProperty(
                        "--duration",
                        "1.3s"
                    );

                    $("#particleLayer")
                        .appendChild(
                            sparkle
                        );

                    setTimeout(
                        () =>
                            sparkle.remove(),
                        1400
                    );

                },
                i * 70
            );
        }

    }
);


/* =========================================
   KEYBOARD SHORTCUTS
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            $$(".window.active")
                .forEach(
                    windowElement => {
                        windowElement
                            .classList
                            .remove("active");
                    }
                );
        }

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "s" &&
            $("#notesWindow")
                .classList
                .contains("active")
        ) {

            event.preventDefault();

            $("#saveNotes").click();
        }

    }
);


/* =========================================
   LITTLE RANDOM MOOD
========================================= */

const moods = [
    "✨ Something nice might happen.",
    "🌸 Take a tiny break.",
    "🦋 Keep exploring.",
    "⭐ One small idea can become a big project.",
    "🐱 Neko says hello.",
    "🌱 Build something today.",
    "🎮 Time for a quick game?",
    "☁️ The little city is peaceful today."
];

setInterval(
    () => {

        if (
            !document.hidden
        ) {

            $("#moodText").textContent =
                moods[
                    Math.floor(
                        Math.random() *
                        moods.length
                    )
                ];
        }

    },
    12000
);
