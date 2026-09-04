# Play your own uploaded songs in the player

Every song you upload gets added to the player. Each file already carries its correct title, singer names, and its own album cover picture, so the player shows all of that automatically — no manual typing.

## What you'll get

- The player plays your real songs instead of the Spotify preview.
- Each song shows its own cover picture, title, and singers (Kumar Sanu, Alka Yagnik, Anuradha Paudwal, Udit Narayan and the rest, exactly as tagged in your files).
- All 30 songs uploaded so far go in, in alphabetical order; any further batches you send get appended the same way.
- Play, pause, previous, next, auto-play of the following song, the moving progress bar with elapsed and remaining time, and the animated waveform all keep working.
- The current glass look of the card stays exactly as it is.
- The Spotify and YouTube Music buttons at the top stay, so people can still open the full playlist there.

## How it will work

- Each song and its cover picture is stored on the fast delivery network, not inside the project, so the site stays light.
- The song list (title, singers, cover, file) lives in one simple list that is easy to extend when you send more songs later.
- Songs load only when needed, so the page still opens quickly.

## Technical notes

- Extract cover art per MP3 with ffmpeg, upload both audio and covers via `lovable-assets`, and write `.asset.json` pointers into `src/assets/tracks/`.
- Generate `src/lib/tracks.ts` from the ID3 tags (title, artist) plus the pointer URLs, ordered alphabetically.
- Rewrite `src/components/player/MusicPlayer.tsx` to drive a real `<audio>` element: play/pause, prev/next, `timeupdate` progress, `ended` auto-advance, `preload="none"`. Remove the Spotify iframe API controller and the expandable embed.
- Keep the existing liquid-glass styling and layout of the card untouched.
