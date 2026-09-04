# Add a social-media footer bar

## Goal
Add a bottom footer that mirrors the top header’s glassy style and contains the user’s name plus social-media icons for GitHub, X, Reddit, and Instagram.

## Changes

### 1. Add a fixed bottom bar in `src/routes/index.tsx`
- Insert a new fixed footer below the player area, using the same transparent/glass aesthetic as the top bar:
  - White text with a subtle drop-shadow.
  - Hover state that adds a soft white background and stronger shadow, matching the Spotify/YouTube Music link behavior.
  - Rounded pill-shaped buttons for each social icon.

### 2. Populate footer content
- Left side: text link reading **shreyansh patni** linking to `https://shreyanshpatni.dev`.
- Right side: icon-only buttons for **GitHub**, **X**, **Reddit**, and **Instagram**.
  - Use `lucide-react` icons where available (e.g. `Github`, `Instagram`) and inline SVGs for X and Reddit if needed.
  - All social links will use placeholder `href="#"` so the user can update them later.

### 3. Preserve existing layout
- Keep the current top bar, hero, and player untouched.
- Add enough bottom padding to the page/player area so the footer never overlaps the player or track list.

## Verify
- Build the project and check the preview at desktop and mobile widths.
- Confirm the footer sits at the bottom, matches the header style, and the icons/name are clearly visible without overlapping the player.
