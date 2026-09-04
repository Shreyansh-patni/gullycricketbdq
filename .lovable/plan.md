# Play your own uploaded songs in the player

All 20 songs you sent are ready. Each file already carries its correct title, singer names, and its own album cover picture, so the player can show all of that automatically.

## What you'll get

- The player plays your real songs instead of the Spotify preview.
- Each song shows its own cover picture, title, and singers. The list, in order:
  1. Sanam Bewafa — Lata Mangeshkar, Vipin Sachdeva
  2. Sochenge Tumhe Pyar — Kumar Sanu
  3. Tera Naam Liya — Manhar Udhas, Anuradha Paudwal
  4. Tere Dar Par Sanam (Male Version) — Kumar Sanu
  5. Tere Dard Se Dil — Kumar Sanu
  6. Tere Dard Se Dil (Jhankar Beats) — Kumar Sanu
  7. Teri Umeed Tera Intezar — Kumar Sanu, Sadhana Sargam
  8. Too Shayar Hai Main Teri Shayari — Alka Yagnik
  9. Tu Meri Zindagi Hai — Anuradha Paudwal, Kumar Sanu
  10. Tu Pyar Hai Kisi Aur Ka — Anuradha Paudwal
  11. Tujhko Na Dekhun — Udit Narayan, Sunidhi Chauhan
  12. Tum Dil Ki Dhadkan Mein — Kumar Sanu
  13. Tum Dil Ki Dhadkan Mein — Abhijeet, Alka Yagnik
  14. Tum Se Achcha Kaun Hai Chand Tare Phool — Tauseef Akhtar
  15. Tum To Thehre Pardesi — Altaf Raja
  16. Tumhein Apna Banane Ki Kasam Khai Hai — Kumar Sanu
  17. Tumsa Koi Pyaara — Kumar Sanu, Alka Yagnik
  18. Tumse Milna — Udit Narayan, Alka Yagnik
  19. Tumse Milne Ko Dil — Alka Yagnik, Kumar Sanu
  20. Woh Meri Neend Mera Chain — Sadhana Sargam
- Play, pause, previous, next, auto-play of the following song, the moving progress bar with elapsed and remaining time, and the animated waveform all keep working.
- The current glass look of the card stays exactly as it is.
- The Spotify and YouTube Music buttons at the top stay, so people can still open the full playlist there.

## How it will work

- Each song and its cover picture is stored on the fast delivery network, not inside the project, so the site stays light.
- The song list (title, singers, cover, file) lives in one simple list that is easy to extend when you send more songs later.
- Songs load only when needed, so the page still opens quickly.

## Technical notes

- Extract cover art per MP3 with ffmpeg, upload both audio and covers via `lovable-assets`, and write `.asset.json` pointers into `src/assets/tracks/`.
- Add `src/lib/tracks.ts` exporting the ordered track list (title, artist, cover URL, audio URL) built from the ID3 tags read from the uploads.
- Rewrite `src/components/player/MusicPlayer.tsx` to drive a real `<audio>` element: play/pause, prev/next, `timeupdate` progress, `ended` auto-advance, `preload="none"`. Remove the Spotify iframe API controller and the expandable embed.
- Keep the existing liquid-glass styling and layout of the card untouched.
