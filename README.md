# Valley Life Journey V2 — Naches Valley Edition

An original, family-friendly **life-skills board game** designed for the Naches Learning Hub. Players travel through a stylized version of Naches Valley, make decisions about education, jobs, finances, housing, and community, and compare outcomes at retirement. This is not an adaptation of any proprietary board-game art or trademarked characters.

## Play

Host the files with GitHub Pages or any static website. Open `index.html`. The game runs without a login or external services.

- **Full Journey:** 90 progress spaces, 6 major milestones and 4 branching crossroads.
- **Quick Journey:** 50 progress spaces, 5 major milestones and 4 branching crossroads.
- **Opponents:** 1–4 total players; solo versus three computer rivals is the recommended setup. Five computer personalities are available, and human players can share a device.
- **Choices:** Start earning or study/train, choose among 18 simulated careers, make housing, friendship/family, career, money and community decisions, and navigate local event cards.
- **Crossroads:** Four locations have two **different routes with separately drawn spaces**. The paths reconnect. Each player's selected lane is kept independently and computer rivals select routes too.
- **Spin:** Roll 1–6, pay a simplified living expense each turn and receive fictional wages whenever passing a PAY space. Quiet spaces let the story continue without another pop-up. Major milestones and crossroads are **mandatory even when crossed over**.
- **Garage:** Four initial vehicle silhouettes, plus an Adventure Camper and Electric Explorer unlocked after two or four milestone stops. Family/care responsibilities add tiny passenger dots. Vehicles are cosmetic.
- **Number investment:** An optional probability mini-game. Pay a fictional $650 once to claim a spinner number; every player's subsequent spin of that number awards the owner a fictional $180. There are no guaranteed returns. This is NOT a depiction of a real investment product.
- **Retirement:** The ranking uses net worth, wellbeing, community and skills, with comparison graphs and CSV export. Computer speed, pause, fast-forward and browser save/restore remain available.

## Local inspiration

The illustrated board references the town of Naches, its historic depot, apple orchards, Naches River, Oak Creek Wildlife Area, White Pass, Tieton, and nearby Yakima communities. More than 25 newly written event cards use this setting. They are **fictional learning scenarios**, not real prices, salary estimates, guarantees of access, or reports of current conditions. The map is illustrative, not an accurate geographic or travel map.

## Upload to GitHub

1. Create or open your `valley-life-journey` repository.
2. Upload/replace `index.html`, `styles.css`, `game.js`, and `README.md` at the repository root.
3. In GitHub **Settings → Pages**, deploy from `main` and `/(root)`.
4. Open `https://jkramer-cloud.github.io/valley-life-journey/`.
5. Refresh with Ctrl+Shift+R after deploying.

The Naches Learning Hub already points to the same URL, so **no catalog edit is needed** when updating the game at that address.

## Storage and compatibility

Player data stays in the browser's localStorage for this site/browser profile (`naches-valley-life-journey-v1`). It does **not** automatically sync with Google accounts or across computers. Use **Save backup** to export JSON and **Import backup** to restore it. Before replacing an earlier version, export your existing game as a backup. Older in-progress games can resume but now use the longer Full Journey route by default; starting a new game is recommended for the complete V2 experience.

## Education and limitations

This is a **classroom simulation**, not personal financial advice. Salaries, costs, yields, loan mechanics, investments and event outcomes are intentionally fictional/simplified. All education pathways, family structures and life choices can be worthwhile. Access to actual parks and recreation locations can be seasonal or restricted; check real conditions before any trip. No accounts, advertising, analytics, or outside game assets are required.

## Files

- `index.html` — game interface
- `styles.css` — responsive presentation and map effects
- `game.js` — rules, scenarios, routes, computer opponents, persistence
- `README.md` — setup and documentation
