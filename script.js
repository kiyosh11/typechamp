const words = {
    short: ["neon", "code", "fast", "dark", "vibe", "glow", "type", "rush", "beat", "void", "fire", "snap", "zap", "byte", "zero", "link", "dash", "flux", "grid", "ping", "wave", "data", "loop", "node", "chip", "port", "user", "pass", "keys", "font", "css", "html", "web", "app", "api", "bug", "fix", "git", "log", "cmd", "dev", "ops", "test", "run", "play", "jump", "spin", "kick", "move", "stop"],
    medium: ["shadow", "rhythm", "static", "energy", "circuit", "strike", "system", "flicker", "stream", "ghost", "pulse", "drift", "surge", "clock", "grind", "blaze", "shift", "glitch", "binary", "hacker", "kernel", "matrix", "render", "script", "server", "packet", "buffer", "compile", "debug", "deploy", "engine", "filter", "inject", "markup", "module", "object", "parser", "proxy", "query", "router", "schema", "socket", "syntax", "thread", "vector", "motion", "signal", "fusion", "charge", "access", "update"],
    long: ["electricity", "synchronize", "frequencies", "vortexstream", "illuminated", "chaoticbeat", "digitalwave", "neoncircuit", "shadowtracer", "hyperenergy", "overclocked", "transmission", "algorithm", "bandwidth", "cyberspace", "database", "encryption", "framework", "interface", "javascript", "localhost", "mainframe", "networking", "optimize", "protocol", "recursion", "security", "template", "variable", "websocket", "authentication", "backtracking", "computation", "constructor", "destructuring", "filesystem", "generator", "inheritance", "middleware", "polymorphism", "repository", "serialization", "virtualization", "acceleration", "integration", "simulation", "configuration", "optimization", "visualization", "transformation"],
    hard: ["xylophone", "quixotic", "zephyr", "jinxed", "krypton", "vortex", "glyph", "phoenix", "cryptic", "zenith", "jagged", "whiplash", "juxtapose", "mnemonic", "phlegm", "pizzazz", "psyche", "rhapsody", "syzygy", "zodiac", "buzzword", "embezzle", "galvanize", "hyphen", "naphtha", "oxidize", "pneumonia", "quartz", "rhythm", "strength", "awkward", "banjo", "crypt", "dwarves", "fjord", "gazebo", "ivory", "jockey", "kayak", "luxury", "oxygen", "pixel", "sphinx", "squawk", "vortex", "whiskey", "yogurt", "zombie"]
};

const punctuation = [".", ",", "!", "?", ";", ":", "-", "'", "`", "\"", "(", ")", "[", "]", "{", "}"];
const sentenceDiv = document.getElementById("sentence");
const input = document.getElementById("input");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const settingsBtn = document.getElementById("settings-btn");
const countdownDiv = document.getElementById("countdown");
const wpmDiv = document.getElementById("wpm");
const errorsDiv = document.getElementById("errors");
const accuracyDiv = document.getElementById("accuracy");
const highScoreDiv = document.getElementById("high-score");
const caret = document.getElementById("caret");
const settingsPanel = document.getElementById("settings-panel");
const timeSetting = document.getElementById("time-setting");
const customTime = document.getElementById("custom-time");
const wordCountSetting = document.getElementById("word-count-setting");
const wordCountValue = document.getElementById("word-count-value");
const wordLengthSetting = document.getElementById("word-length-setting");
const difficultySetting = document.getElementById("difficulty-setting");
const punctuationSetting = document.getElementById("punctuation-setting");
const numbersSetting = document.getElementById("numbers-setting");
const themeSetting = document.getElementById("theme-setting");
const fontSizeSetting = document.getElementById("font-size-setting");
const caretSetting = document.getElementById("caret-setting");
const animationSetting = document.getElementById("animation-setting");
const showWpm = document.getElementById("show-wpm");
const showErrors = document.getElementById("show-errors");
const showAccuracy = document.getElementById("show-accuracy");
const closeSettings = document.getElementById("close-settings");

let startTime, countdownInterval, timeLeft = 30, errors = 0, correctCharsCount = 0, totalCharsTyped = 0, targetText = "";
let highScore = getCookie("typeChampHighScore") || 0;
let practiceMode = false;
let sessionStats = { totalWPM: 0, totalErrors: 0, totalAccuracy: 0, tests: 0 };
highScoreDiv.textContent = `High Score: ${highScore}`;

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function generateText() {
    const length = parseInt(wordCountSetting.value);
    const difficulty = difficultySetting.value;
    const basePool = wordLengthSetting.value === "mixed" ? [...words.short, ...words.medium, ...words.long] : words[wordLengthSetting.value] || words.medium;
    const wordPool = difficulty === "hard" ? words.hard : (difficulty === "medium" ? [...basePool, ...words.hard.slice(0, Math.floor(basePool.length * 0.2))] : basePool);
    const shuffled = [...wordPool].sort(() => Math.random() - 0.5);
    let result = [];
    const usePunctuation = punctuationSetting.value === "on";
    const useNumbers = numbersSetting.value === "on";
    for (let i = 0; i < length; i++) {
        let word = shuffled[i % shuffled.length];
        if (useNumbers && Math.random() < 0.15) {
            word = Math.random() < 0.5 ? word + Math.floor(Math.random() * 100) : Math.floor(Math.random() * 100) + word;
        }
        result.push(word);
        if (usePunctuation && Math.random() < 0.2 && i < length - 1) {
            result.push(punctuation[Math.floor(Math.random() * punctuation.length)]);
        }
    }
    let joinedText = result.join(" ").replace(/\s+([.,!?;:])/g, '$1').trim();
    if (punctuation.includes(joinedText.slice(-1))) {
        joinedText = joinedText.slice(0, -1).trim() + joinedText.slice(-1);
    }
    return joinedText;
}

function updateCountdown() {
    countdownDiv.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        endTest();
    }
    timeLeft--;
}

function updateDisplay() {
    const typed = input.value;
    let html = "";
    errors = 0;
    correctCharsCount = 0;
    totalCharsTyped = typed.length;
    const animate = animationSetting.value === 'on';
    for (let i = 0; i < targetText.length; i++) {
        if (i < typed.length) {
            if (typed[i] === targetText[i]) {
                html += `<span class="correct${animate ? ' animate' : ''}">${targetText[i]}</span>`;
                correctCharsCount++;
            } else {
                html += `<span class="incorrect">${targetText[i]}</span>`;
                errors++;
            }
        } else {
            html += `<span>${targetText[i]}</span>`;
        }
    }
    for (let i = targetText.length; i < typed.length; i++) {
        html += `<span class="extra">${typed[i]}</span>`;
        errors++;
    }
    sentenceDiv.innerHTML = html;
    if (caretSetting.value !== "off") updateCaret();
    updateStats();
}

const debouncedUpdateDisplay = debounce(updateDisplay, 50);

function updateCaret() {
    const typedLength = input.value.length;
    let targetElement = sentenceDiv.children[typedLength];
    let leftPos = 0;
    let topPos = 0;
    if (typedLength === 0) {
        const sentenceRect = sentenceDiv.getBoundingClientRect();
        const firstChar = sentenceDiv.children[0];
        if (firstChar) {
            const firstRect = firstChar.getBoundingClientRect();
            leftPos = firstRect.left - sentenceRect.left;
            topPos = firstRect.top - sentenceRect.top;
        }
    } else if (typedLength <= targetText.length) {
        targetElement = sentenceDiv.children[typedLength - 1];
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const sentenceRect = sentenceDiv.getBoundingClientRect();
            leftPos = rect.right - sentenceRect.left;
            topPos = rect.top - sentenceRect.top;
        }
    } else {
        targetElement = sentenceDiv.children[sentenceDiv.children.length - 1];
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const sentenceRect = sentenceDiv.getBoundingClientRect();
            leftPos = rect.right - sentenceRect.left;
            topPos = rect.top - sentenceRect.top;
        }
    }
    if (targetElement || typedLength === 0) {
        caret.style.left = `${leftPos}px`;
        caret.style.top = `${topPos}px`;
        caret.className = caretSetting.value;
        caret.style.display = "block";
    } else {
        caret.style.display = "none";
    }
}

function calculateWPM() {
    if (!startTime || correctCharsCount === 0) return 0;
    const timeElapsed = (new Date() - startTime) / 1000 / 60;
    if (timeElapsed <= 0) return 0;
    const wordsTyped = correctCharsCount / 5;
    return Math.round(wordsTyped / timeElapsed);
}

function calculateAccuracy() {
    if (totalCharsTyped === 0) return 100;
    const correct = totalCharsTyped - errors;
    const accuracy = (correct / totalCharsTyped) * 100;
    return Math.round(Math.max(0, accuracy));
}

function updateStats() {
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    wpmDiv.textContent = `WPM: ${wpm}`;
    errorsDiv.textContent = `Errors: ${errors}`;
    accuracyDiv.textContent = `Accuracy: ${accuracy}%`;
    updateStatsVisibility();
}

const debouncedUpdateStats = debounce(updateStats, 100);

function showStats() {
    const avgWPM = sessionStats.tests ? Math.round(sessionStats.totalWPM / sessionStats.tests) : 0;
    const avgErrors = sessionStats.tests ? Math.round(sessionStats.totalErrors / sessionStats.tests) : 0;
    const avgAccuracy = sessionStats.tests ? Math.round(sessionStats.totalAccuracy / sessionStats.tests) : 0;
    alert(`Session Stats:\nAverage WPM: ${avgWPM}\nAverage Errors: ${avgErrors}\nAverage Accuracy: ${avgAccuracy}%\nTests Completed: ${sessionStats.tests}`);
}

function togglePracticeMode() {
    practiceMode = document.getElementById("practice-mode").checked;
    resetBtn.click();
    if (practiceMode) {
        timeLeft = Infinity;
        countdownDiv.textContent = "Time: ∞";
        startTest();
    } else {
        applySettings();
        startBtn.style.display = "block";
        input.placeholder = "Click Start - Champ Your Keys";
        input.disabled = true;
        sentenceDiv.innerHTML = '<span id="caret"></span>';
    }
}

function applySettings() {
    if (!practiceMode) {
        timeLeft = timeSetting.value === "custom" ? parseInt(customTime.value) : parseInt(timeSetting.value);
        if (isNaN(timeLeft) || timeLeft <= 0) timeLeft = 30;
        countdownDiv.textContent = `Time: ${timeLeft}s`;
    } else {
        countdownDiv.textContent = "Time: ∞";
    }
    wordCountValue.textContent = wordCountSetting.value;
    document.body.className = themeSetting.value;
    sentenceDiv.classList.remove('small', 'medium', 'large', 'x-large');
    sentenceDiv.classList.add(fontSizeSetting.value || 'medium');
    caret.style.display = caretSetting.value === "off" ? "none" : caret.style.display;
    updateStatsVisibility();
    saveSettings();
}

function updateStatsVisibility() {
    wpmDiv.style.display = showWpm.checked ? "inline-block" : "none";
    errorsDiv.style.display = showErrors.checked ? "inline-block" : "none";
    accuracyDiv.style.display = showAccuracy.checked ? "inline-block" : "none";
}

function loadSettings() {
    const settings = {
        time: getCookie("time") || "30",
        customTime: getCookie("customTime") || "30",
        wordCount: getCookie("wordCount") || "25",
        wordLength: getCookie("wordLength") || "medium",
        difficulty: getCookie("difficulty") || "easy",
        punctuation: getCookie("punctuation") || "off",
        numbers: getCookie("numbers") || "off",
        theme: getCookie("theme") || "neon",
        fontSize: getCookie("fontSize") || "medium",
        caret: getCookie("caret") || "off",
        animation: getCookie("animation") || "on",
        showWpm: getCookie("showWpm") !== "false",
        showErrors: getCookie("showErrors") !== "false",
        showAccuracy: getCookie("showAccuracy") !== "false"
    };
    timeSetting.value = settings.time;
    customTime.value = settings.customTime;
    customTime.style.display = settings.time === "custom" ? "inline-block" : "none";
    wordCountSetting.value = settings.wordCount;
    wordCountValue.textContent = settings.wordCount;
    wordLengthSetting.value = settings.wordLength;
    difficultySetting.value = settings.difficulty;
    punctuationSetting.value = settings.punctuation;
    numbersSetting.value = settings.numbers;
    themeSetting.value = settings.theme;
    fontSizeSetting.value = settings.fontSize;
    caretSetting.value = settings.caret;
    animationSetting.value = settings.animation;
    showWpm.checked = settings.showWpm;
    showErrors.checked = settings.showErrors;
    showAccuracy.checked = settings.showAccuracy;
    applySettings();
}

function saveSettings() {
    setCookie("time", timeSetting.value);
    setCookie("customTime", customTime.value);
    setCookie("wordCount", wordCountSetting.value);
    setCookie("wordLength", wordLengthSetting.value);
    setCookie("difficulty", difficultySetting.value);
    setCookie("punctuation", punctuationSetting.value);
    setCookie("numbers", numbersSetting.value);
    setCookie("theme", themeSetting.value);
    setCookie("fontSize", fontSizeSetting.value);
    setCookie("caret", caretSetting.value);
    setCookie("animation", animationSetting.value);
    setCookie("showWpm", showWpm.checked);
    setCookie("showErrors", showErrors.checked);
    setCookie("showAccuracy", showAccuracy.checked);
}

function startTest() {
    if (!input.disabled && startTime) return;
    targetText = generateText();
    input.value = "";
    errors = 0;
    correctCharsCount = 0;
    totalCharsTyped = 0;
    updateDisplay();
    input.disabled = false;
    input.focus();
    startBtn.style.display = "none";
    resetBtn.style.display = "none";
    applySettings();
    wpmDiv.textContent = "WPM: 0";
    errorsDiv.textContent = "Errors: 0";
    accuracyDiv.textContent = "Accuracy: 100%";
    startTime = null;
    clearInterval(countdownInterval);
    caret.style.display = (caretSetting.value !== "off") ? "block" : "none";
    updateCaret();
    input.placeholder = "Start typing...";
}

function endTest() {
    input.disabled = true;
    clearInterval(countdownInterval);
    const finalWPM = calculateWPM();
    const finalAccuracy = calculateAccuracy();
    if (!practiceMode) {
        if (finalWPM > highScore) {
            highScore = finalWPM;
            setCookie("typeChampHighScore", highScore);
            highScoreDiv.textContent = `High Score: ${highScore}`;
        }
        sessionStats.totalWPM += finalWPM;
        sessionStats.totalErrors += errors;
        sessionStats.totalAccuracy += finalAccuracy;
        sessionStats.tests++;
    }
    wpmDiv.textContent = `WPM: ${finalWPM}`;
    accuracyDiv.textContent = `Accuracy: ${finalAccuracy}%`;
    errorsDiv.textContent = `Errors: ${errors}`;
    sentenceDiv.textContent = `Finished! WPM: ${finalWPM} | Acc: ${finalAccuracy}% | Errors: ${errors}`;
    resetBtn.style.display = "inline-block";
    startBtn.style.display = "none";
    caret.style.display = "none";
    if (practiceMode) {
        setTimeout(startTest, 1500);
    } else {
        input.placeholder = "Click Reset to try again";
    }
}

input.addEventListener("input", (event) => {
    if (input.disabled) return;
    if (!startTime && !practiceMode) {
        const isModifier = event.inputType === 'insertText' && event.data === null;
        if (!isModifier) {
            startTime = new Date();
            if (timeLeft !== Infinity) {
                updateCountdown();
                countdownInterval = setInterval(updateCountdown, 1000);
            }
        }
    } else if (!startTime && practiceMode) {
        startTime = new Date();
    }
    debouncedUpdateDisplay();
    const typedText = input.value;
    if (typedText.length >= targetText.length && typedText === targetText) {
        endTest();
    }
});

input.addEventListener("keydown", (e) => {});

startBtn.addEventListener("click", startTest);

resetBtn.addEventListener("click", () => {
    clearInterval(countdownInterval);
    startTime = null;
    errors = 0;
    correctCharsCount = 0;
    totalCharsTyped = 0;
    resetBtn.style.display = "none";
    startBtn.style.display = "inline-block";
    sentenceDiv.innerHTML = '<span id="caret"></span>';
    input.value = "";
    input.disabled = true;
    input.placeholder = "Click Start - Champ Your Keys";
    applySettings();
    wpmDiv.textContent = "WPM: 0";
    errorsDiv.textContent = "Errors: 0";
    accuracyDiv.textContent = "Accuracy: 0%";
    caret.style.display = "none";
    updateStatsVisibility();
});

settingsBtn.addEventListener("click", () => {
    settingsPanel.style.display = "block";
});

closeSettings.addEventListener("click", () => {
    settingsPanel.style.display = "none";
    applySettings();
});

timeSetting.addEventListener("change", () => {
    customTime.style.display = timeSetting.value === "custom" ? "inline-block" : "none";
    if (timeSetting.value !== "custom") {
        applySettings();
    } else {
        customTime.focus();
    }
});

customTime.addEventListener("change", applySettings);

wordCountSetting.addEventListener("input", () => {
    wordCountValue.textContent = wordCountSetting.value;
});

[wordLengthSetting, difficultySetting, punctuationSetting, numbersSetting, themeSetting, fontSizeSetting, caretSetting, animationSetting, showWpm, showErrors, showAccuracy].forEach(el => {
    el.addEventListener("change", applySettings);
});

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
            case "s":
                e.preventDefault();
                if (startBtn.style.display !== "none") startBtn.click();
                break;
            case "r":
                e.preventDefault();
                if (input.disabled === false || resetBtn.style.display !== 'none') {
                    resetBtn.click();
                }
                break;
            case "t":
                e.preventDefault();
                if (settingsPanel.style.display === "none") {
                    settingsPanel.style.display = "block";
                } else {
                    settingsPanel.style.display = "none";
                    applySettings();
                }
                break;
        }
    }
});

loadSettings();
resetBtn.click();
