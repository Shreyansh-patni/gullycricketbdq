# Make the song player more see-through and 40% smaller

## Goal

Adjust the liquid-glass song player so the street background shows through it clearly, then shrink the whole player by 40% while keeping it usable and visually balanced.

## Changes

### 1. Increase see-through-ness of the liquid-glass card

- Lower the main card background tint from `bg-white/10` to `bg-white/5` so the background image is clearly visible behind it.
- Keep `backdrop-blur-2xl` and `backdrop-saturate-150` so the frosted-glass feel remains.
- Slightly reduce the strength of the glossy sheen overlay (`rgba(255,255,255,0.28)` → `0.18`, etc.) and the blurred reflection (`bg-white/15` → `bg-white/8`) so they do not overpower the background.
- Keep the white ring at a subtle opacity so the card edge still reads against the busy background.

### 2. Shrink the player by ~40%

- Reduce the card’s `max-w-xl` to a smaller width (e.g. `max-w-md` or a custom narrower value) so the whole card is ~40% smaller in footprint.
- Scale down internal spacing: padding, margins, gap values proportionally.
- Reduce cover art from `72px/80px` to roughly `44px/52px`.
- Reduce title font from `text-lg sm:text-xl` to `text-sm sm:text-base` and artist text from `text-base` to `text-xs sm:text-sm`.
- Shrink transport buttons: previous/next SVGs from `42x30` to ~`26x18`, play/pause from `34x38` to ~`22x26`.
- Reduce progress bar height and time-label size.
- Reduce footer text and the "All tracks" pill size.
- Keep the track list below the card but shrink its max-height, cover thumbnails, and text sizes to match the smaller card.

### 3. Verify

- Build the project and check the preview at desktop and mobile widths.
- Confirm the street background is visible through the player, the glass effect still looks polished, and the player is noticeably smaller without feeling cramped.
