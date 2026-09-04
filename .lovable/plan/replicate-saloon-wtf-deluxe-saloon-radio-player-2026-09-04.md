# Replicate saloon.wtf — "Deluxe Saloon" radio player

Recreate the single-page radio experience of saloon.wtf using the uploaded assets: `04.png` (ornate Saloon lettermark) as the logo and `03.png` (warm Indian street-cricket illustration) as the full-screen background.

## What the page looks like

```text
┌────────────────────────────────────────────┐
│        ● N online        [Spotify] [YT]    │  fixed pills over the image
│                                            │
│            [ Saloon logo ]                 │  ornate white lettermark
│                                            │
│        90s Bollywood bangers that          │
│        play at Indian barber shops         │
│                                            │
│      ┌──────────────────────────┐          │
│      │ cover | track | ▶ | meta │          │  glassy player card
│      └──────────────────────────┘          │
└────────────────────────────────────────────┘
  background: full-bleed street illustration, subtle
  black gradient top-to-bottom for legibility
```

## Pieces to build

- Full-screen fixed background using the 03.png illustration with a black gradient overlay
- Centered ornate Saloon logo (04.png)
- Tagline under the logo: "90s Bollywood bangers that play at Indian barber shops."
- Fixed "online" pill (pulsing green dot + count) at top center
- Fixed pills top-right linking out to the Spotify and YouTube Music playlists
- A glassy dark player card: album cover thumbnail, track title + artist, play/pause button, prev/next track buttons
- Playlist of 90s Bollywood-style tracks with local placeholder covers (generated or solid-color tiles); audio via free sample streams is not guaranteed, so the player will cycle tracks visually with a progress bar and animate an equalizer while "playing"
- Unique head metadata: title "Deluxe Saloon", description, og/twitter tags (no og:image since the background is a bundled asset)

## Technical notes

- Upload 03.png and 04.png to CDN assets via `lovable-assets` and reference the pointer URLs
- Track data in a small local array; player state in React (`useState`/`useRef`), no backend
- All colors via semantic tokens; set the site to a dark theme in `src/styles.css` since everything sits on a dark image
- No routing beyond `/` — the whole experience is the index page
