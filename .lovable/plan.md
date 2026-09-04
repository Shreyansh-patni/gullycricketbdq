# Redesign the song player + connect it to your Spotify playlist

## What you'll get

A player card styled like the reference image: rounded black card, square cover art on the left, song title in bold with the artist underneath, a small animated sound-wave mark on the right, an elapsed / remaining time row around a slim progress bar, and large chunky rewind / pause / fast-forward icons underneath.

The songs and cover images come live from your Spotify playlist, and pressing play plays the music through Spotify's own embedded player (30-second clips for signed-out visitors, full songs for anyone signed into Spotify in the same browser).

## How it works

1. **Backend (Lovable Cloud)** — enabled so the site can talk to Spotify securely with your app credentials. You'll need to create a free Spotify developer app and give me its two keys (Client ID and Client Secret); I'll store them privately.
2. **Playlist data** — the site fetches your playlist's tracks: title, artist, cover image, duration, and Spotify track link. Cached briefly so it loads fast.
3. **Playback** — Spotify's embedded player is loaded invisibly behind the custom card. Play/pause and the next/previous buttons drive it, and the progress bar follows the real playback position. Clicking a track jumps to it.
4. **Fallback** — if the playlist can't be reached, the card shows a short message with a link to open the playlist on Spotify, instead of breaking the page.

## Notes and limits

- Spotify does not allow full-length playback on a website without each visitor logging in with Premium, so signed-out visitors hear the 30-second clip Spotify provides. Visitors already signed into Spotify in that browser hear the full track.
- Spotify's terms require its embed to be present, so a slim Spotify attribution stays visible on the card.
- The rest of the page (background, logo, clock, visitor count, top links) stays as it is.

## Technical detail

- Enable Lovable Cloud; store `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` as secrets.
- `src/lib/spotify.functions.ts`: `getPlaylist` server function — client-credentials token, `GET /v1/playlists/{id}/tracks`, mapped to `{ id, uri, title, artist, image, durationMs }`, in-memory token + 5 min response cache.
- Route loader/`useQuery` feeds the player; loading state is a skeleton in the same card shape.
- New `src/components/player/*`: `PlayerCard`, `CoverArt`, `TransportControls`, `ProgressBar`, `WaveMark` (reuses the existing `saloon-eq` animation).
- Spotify iframe API (`https://open.spotify.com/embed/iframe-api/v1`) loaded client-side only, controller created after hydration; `playback_update` events drive position, `togglePlay`/`loadUri` drive controls.
- Tokens are colors already in `src/styles.css`; no hardcoded color classes.
