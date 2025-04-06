# typechamp - master your keys

typechamp is a dynamic, neon-themed typing speed test application designed to help users improve their typing skills. with customizable settings, multiple themes, and real-time feedback, it offers an engaging way to practice typing while tracking words per minute (wpm), accuracy, and errors.

## features
- **customizable settings**: adjust time, word count, difficulty, punctuation, numbers, theme, font size, caret style, and animations.
- **themes**: choose from neon (default), dark, light, cyber, or retro styles.
- **practice mode**: toggle infinite time for continuous practice.
- **stats tracking**: monitor wpm, errors, accuracy, and high scores with session averages.
- **responsive design**: works on desktops, tablets, and mobile devices.
- **keyboard shortcuts**: ctrl+s (start), ctrl+r (reset), ctrl+t (settings).
- **persistent settings**: saves preferences and high scores using cookies.

## prerequisites
- a modern web browser (e.g., chrome, firefox, edge, safari).
- an internet connection (for loading google fonts; otherwise, it runs offline).
- optional: a local server tool (e.g., python’s `http.server`, node.js `serve`, or vs code live server) for testing locally.

## setup instructions

1. **clone or download the project**:
   - if using git: `git clone https://github.com/kiyosh11/typechamp`
   - otherwise, download the zip file and extract it.

2. **project structure**:
   ensure your directory contains these files:
   
3. **verify files**:
- `index.html`: the main html file with structure and links to css/javascript.
- `styles.css`: contains all styling (ensure it’s linked correctly in `index.html`).
- `script.js`: handles the game logic and interactivity.

4. **run the application**:
- **option 1: local server (recommended)**:
  - open a terminal in the `typechamp` folder.
  - run one of these commands:
    - python: `python -m http.server 8000`
    - node.js: `npx serve`
  - open your browser and go to `http://localhost:8000` (or the port specified).
- **option 2: direct file**:
  - double-click `index.html` to open it in your browser. note: some browsers may block local css/javascript due to security policies, so a server is preferred.

## usage
1. **start typing**:
- click the "start" button or press `ctrl+s` to begin.
- type the displayed text in the input field.
- the timer starts with your first keystroke (unless in practice mode).

2. **customize settings**:
- click "settings" or press `ctrl+t` to open the settings panel.
- adjust options like time, word count, theme, etc.
- click "close" to save and apply changes.

3. **reset**:
- click "reset" or press `ctrl+r` to restart the test.

4. **practice mode**:
- check "practice mode" in the navbar for unlimited time practice.
- automatically restarts after completing each test.

5. **view stats**:
- real-time stats (wpm, errors, accuracy) display below the input.
- click "stats" in the navbar to see session averages.

## troubleshooting
- **css not loading**:
  - ensure `styles.css`ව

- **javascript errors**:
  - open devtools (f12) > "console" tab to check for errors.
  - ensure `script.js` is loaded at the bottom of `index.html` with `<script src="script.js"></script>`.

- **fonts not displaying**:
  - requires an internet connection for `@import url('https://fonts.googleapis.com/...')` in `styles.css`.
  - without internet, fallback fonts (system defaults) will apply.

## contributing
feel free to fork this project and submit pull requests with improvements! ideas:
- add more themes or animations.
- expand the word list with additional categories.
- implement leaderboards or multiplayer mode.

## license
this project is open-source and available under the [mit license](https://opensource.org/licenses/mit). use, modify, and distribute it as you like!

## credits
- built with html, css, and vanilla javascript.
- fonts: [orbitron](https://fonts.google.com/specimen/orbitron) and [roboto mono](https://fonts.google.com/specimen/roboto+mono) from google fonts.
- created by kiyosh11.
