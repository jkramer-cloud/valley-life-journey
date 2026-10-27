# Valley Life Journey — Computer Rivals Edition (v1.1)

An original classroom-friendly life-path board game for the Naches Learning Hub. Students manage money, jobs, learning, housing, wellbeing, and community choices from their first job to retirement.

## New in v1.1

- **Solo play vs. 3 computer opponents by default.** Choose up to 3 AI opponents and up to 4 total players.
- Mix human players and computer opponents, or play pass-and-play with up to 4 people and no computers.
- **Five AI personalities:** Careful Casey (saves and avoids debt), Risky Riley (takes financial chances), Balanced Bailey (balances competing goals), Ambitious Alex (develops skills and earnings), and Adventurous Avery (values experiences and wellbeing).
- Each rival independently selects a starting path and career, spins, handles paydays, makes event decisions, and reaches retirement.
- **Computer controls:** Normal / Fast / Slow speed, Pause/Resume computers, and **To my turn** to immediately finish pending rival turns. AI turn controls disappear in games with no bots.
- **At retirement:** compare score rankings plus four breakdown charts for financial security, wellbeing, community impact, and learning.
- Exported results CSV now distinguishes human and computer players and identifies each bot's decision style.
- Your existing browser save data and v1 JSON backups remain compatible.

## Play

1. Open the game. Leave the defaults at **1 person + 3 computers** for a competitive solo experience, or choose another combination (maximum four players total).
2. Enter human names and optionally choose the computer personalities and speed.
3. For human players, select **Start earning** or **Study or train**, and choose a career. Computer players choose these automatically.
4. During your turn, click **Spin & move**, then choose between the life scenarios offered.
5. After the turn, click **Next player**. Computer turns proceed automatically; watch them or skip to your turn.
6. When everyone reaches space 53, compare retirement outcomes and download the results CSV.

## Files for GitHub Pages

- `index.html` — interface
- `styles.css` — styling and responsive layout
- `game.js` — gameplay, scoring, and computer opponent engine
- `README.md` — this guide

Upload all four files to the root of the `valley-life-journey` repository. Enable Pages: **Settings → Pages → Deploy from a branch → main / (root)**.

The Learning Hub continues to link to `https://jkramer-cloud.github.io/valley-life-journey/`; **no Learning Hub catalog change is needed to publish v1.1**.

## Saving progress

The game autosaves to `localStorage` in the current browser profile using the existing V1 key `naches-valley-life-journey-v1`. Use **Save backup** to download a JSON save file before replacing versions; use **Import backup** to restore it. Switching devices or browser profiles does not automatically transfer saves. Computer speed and pause settings are also saved.

## How the computer opponents decide

The rivals are *scripted decision-making opponents*, not generative AI, and do not connect to the internet. Their selectable profiles weight cash, savings, debt, income, community, happiness, skills, and financial risk differently, plus a small random variation. Outcomes are purposely simplified; they are not financial predictions or advice.

## Classroom notes

- Ages: aimed broadly at grades 5–12.
- Finances, salaries, credit/debt, and lifecycle decisions are deliberately fictional and should not be treated as actual financial guidance.
- No sign-in, advertising, telemetry, or external services.
- V1.2 is fully playable on desktop and supports narrower screens.
- The software does not collect or transmit student information. Only names entered into the local game are saved within that browser profile.

## License / attribution

Original educational game developed for Naches Learning Hub. You may add a project license in GitHub when ready.


### V1.2 changes
- Aligns all six spinner colors, numbers, and pointer positions. Fixes results drifting from the pointer after repeated spins.
- Adds an upcoming milestone preview under the board and highlights the current player's token.
- Keeps existing computer rivals, save key, and game logic.
