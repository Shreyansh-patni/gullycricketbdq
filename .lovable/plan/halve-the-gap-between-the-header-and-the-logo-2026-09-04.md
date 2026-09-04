# Halve the gap between the header and the logo

## Goal
Reduce the vertical space between the fixed top header bar and the Deluxe Saloon logo by half.

## Changes

### 1. Reduce top padding on the hero container
- In `src/routes/index.tsx`, the hero wrapper currently uses `pt-44` (176 px) to push the logo down from the header.
- Change it to `pt-[88px]` so the logo sits half as far below the top bar while staying centered above the player.

## Verify
- Build the project and check the preview at desktop and mobile widths.
- Confirm the logo is visibly closer to the top bar and the overall vertical balance still looks good.
