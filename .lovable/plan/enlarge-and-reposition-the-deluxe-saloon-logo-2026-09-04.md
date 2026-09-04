# Enlarge and reposition the Deluxe Saloon logo

## Goal
Make the homepage logo 20–25% larger, shift it slightly higher, and ensure it sits roughly 150–200 px below the top header bar.

## Changes

### 1. Increase logo size by 20–25%
- In `src/routes/index.tsx`, update the logo image width from `w-60 sm:w-80` to `w-72 sm:w-96`.
- Keep `max-w-[70vw]` so it still fits narrow viewports.
- Preserve the existing drop shadow.

### 2. Shift the logo slightly upward
- Change the vertical offset from `-translate-y-5` to `-translate-y-7` so the logo moves a little higher on the screen.

### 3. Position the logo 150–200 px below the header
- The logo currently lives inside a centered hero container with `pt-28` (112 px) top padding.
- Increase that top padding from `pt-28` to `pt-44` (176 px) so the logo sits ~150–200 px below the fixed top bar while remaining visually centered above the player.

## Verify
- Build the project and check the preview at desktop and mobile widths.
- Confirm the logo is noticeably larger, sits a bit higher within its area, and the gap from the top bar feels like 150–200 px.
