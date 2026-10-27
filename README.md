# Valley Life Journey

**An original life-skills board adventure for the Naches Learning Hub**

Choose a starting path, pick a career, spin along a winding valley trail, and make choices about everyday spending, housing, education, work, community, and retirement. The goal is not simply to end with the most money: the game also rewards wellbeing, learning, and helping other people.

This project is **not affiliated with or a reproduction of** any commercial life-board game. Its name, artwork, decisions, and scoring system are original.

## Play

Once published with GitHub Pages, visit:

`https://jkramer-cloud.github.io/valley-life-journey/`

Or download `Valley_Life_Journey_Standalone.html` from the complete package to play offline in a modern browser.

## Features

- **1–4 players** on a single computer, taking turns. Solo play is fully supported.
- An illustrated **54-space winding valley board** with an animated six-number spinner.
- Starting choices for earning now or studying/training; **eight careers** with *fictional*, gameplay-only wages.
- More than **40 interactive life-event scenarios**, many with multiple choices.
- Four guaranteed milestones: **housing, relationships/caregiving, career development, and future planning**.
- Paychecks when passing payday spaces, simulated recurring living costs, financial trade-offs, optional saving, and debt.
- Track **cash, savings, debt, home equity, financial net worth, wellbeing, community involvement, and skills**.
- Retirement rankings that consider financial security **and** other types of success.
- Browser-local autosave, JSON save/restore, and downloadable CSV retirement results.
- Responsive layout, keyboard-accessible buttons and controls, reduced-motion support, and no third-party tracking.

## Gameplay and scoring

1. Choose how many people will play and enter first names or nicknames.
2. Each player chooses to begin working or enter a study/training path, then selects a career.
3. Players alternate spinning 1–6 spaces, paying recurring expenses, receiving wages when crossing payday spaces, and choosing responses to scenarios.
4. Important milestone spaces trigger even when a spin passes over them.
5. When every player reaches retirement at space 53, the game compares their paths.

Life balance score is calculated as:

`max(0, round(net worth / 450)) + (wellbeing × 2) + (community × 9) + (skills × 12)`

The purpose is to promote discussion of decision-making, trade-offs, opportunities, wellbeing, and personal values. Career wages, prices, lending, and financial outcomes are intentionally simplified and **are not accurate real-world guidance**. Careers and family structures should not be ranked as morally superior or inferior.

## GitHub Pages setup

1. Create a public GitHub repository named **`valley-life-journey`**.
2. Upload `index.html`, `styles.css`, `game.js`, and `README.md` from the GitHub-ready package to the repository's root.
3. In **Settings → Pages**, select **Deploy from a branch**, **main**, and **/(root)**.
4. Open the published site and test a new one-player game.

The game is a fully client-side static website. There is no server, database, Google sign-in requirement, paid asset, or external JavaScript dependency.

## Where progress is saved

Progress is saved in the browser's `localStorage` under `naches-valley-life-journey-v1` and may be cleared if a browser's site data is deleted. **Signing into Google does not synchronize game progress across devices.** Use **Save backup** to download a JSON file, or **Import backup** on the starting screen to restore it in another browser.

Please encourage students to use first names or nicknames rather than entering sensitive information.

## Classroom extensions

Suggested discussions include:

- How do spending decisions affect emergency savings and debt?
- Why can two people with similar salaries finish with different financial situations?
- How do education, experience, health, and community involvement influence a life?
- Why are there multiple reasonable answers to many questions?
- How do simplified games differ from real-world salaries, access, and opportunity?

## Version

**V1.0** — Original board-game release, October 2026.
