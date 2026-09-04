import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import bgAsset from "@/assets/street-bg.png.asset.json";
import logoAsset from "@/assets/saloon-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deluxe Saloon — 90s Bollywood Barber Shop Radio" },
      {
        name: "description",
        content:
          "Deluxe Saloon streams 90s Bollywood bangers — the tapes that play all day at Indian barber shops.",
      },
      { property: "og:title", content: "Deluxe Saloon" },
      {
        property: "og:description",
        content: "90s Bollywood bangers that play at Indian barber shops.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Track = {
  title: string;
  artist: string;
  film: string;
  year: number;
  duration: number;
  tint: string;
};

const TRACKS: Track[] = [
  {
    title: "Pehla Nasha",
    artist: "Udit Narayan, Sadhana Sargam",
    film: "Jo Jeeta Wohi Sikandar",
    year: 1992,
    duration: 292,
    tint: "linear-gradient(135deg,#e0483f,#f2a541)",
  },
  {
    title: "Chura Ke Dil Mera",
    artist: "Kumar Sanu, Alka Yagnik",
    film: "Main Khiladi Tu Anari",
    year: 1994,
    duration: 331,
    tint: "linear-gradient(135deg,#2f6f6a,#c9d36a)",
  },
  {
    title: "Ae Kaash Ke Hum",
    artist: "Kumar Sanu",
    film: "Kabhi Haan Kabhi Naa",
    year: 1993,
    duration: 305,
    tint: "linear-gradient(135deg,#7b2d3b,#e08b5a)",
  },
  {
    title: "Tu Cheez Badi Hai",
    artist: "Udit Narayan, Neelam",
    film: "Mohra",
    year: 1994,
    duration: 268,
    tint: "linear-gradient(135deg,#b4442e,#f0c46a)",
  },
  {
    title: "Kuch Kuch Hota Hai",
    artist: "Udit Narayan, Alka Yagnik",
    film: "Kuch Kuch Hota Hai",
    year: 1998,
    duration: 314,
    tint: "linear-gradient(135deg,#3d5a80,#98c1d9)",
  },
  {
    title: "Sona Kitna Sona Hai",
    artist: "Poornima, Vinod Rathod",
    film: "Hero No. 1",
    year: 1997,
    duration: 287,
    tint: "linear-gradient(135deg,#8a5a2b,#e8b04b)",
  },
];

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Index() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [online, setOnline] = useState(28);
  const elapsedRef = useRef(0);

  const track = TRACKS[index] ?? TRACKS[0]!;

  useEffect(() => {
    elapsedRef.current = 0;
    setElapsed(0);
  }, [index]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      elapsedRef.current += 1;
      if (elapsedRef.current >= track.duration) {
        setIndex((i) => (i + 1) % TRACKS.length);
      } else {
        setElapsed(elapsedRef.current);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [playing, track.duration]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setOnline((n) => Math.max(12, Math.min(64, n + Math.round(Math.random() * 6) - 3)));
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const progress = (elapsed / track.duration) * 100;

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-between overflow-hidden">
      <div
        className="fixed inset-0 -z-10 bg-black bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgAsset.url})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80" />
      </div>

      {/* top bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-5">
        <span className="text-sm font-medium tabular-nums text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
          Deluxe Saloon
        </span>
        <span
          className="pointer-events-auto inline-flex items-center gap-2 text-sm font-medium text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]"
          aria-live="polite"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
          </span>
          <span className="tabular-nums">{online}</span>
          <span className="text-white/70">online</span>
        </span>
        <div className="pointer-events-auto flex items-center gap-1">
          <a
            href="https://open.spotify.com/playlist/2AVjI8Z57bqMJVtU3V9X1Q?si=rZ1U5KR5RuqZyP7s2dvJHw"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full p-2.5 text-sm font-medium text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] transition hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] active:scale-95 sm:px-3 sm:py-2"
            aria-label="Open on Spotify"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span className="hidden sm:inline">Spotify</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              aria-hidden="true"
            >
              <path d="M5 19L19 5M19 5H9M19 5V15" />
            </svg>
          </a>
          <a
            href="https://music.youtube.com/playlist?list=PLTJ1PnzCWyFw&si=LWHOgOar5xw7BKnT"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full p-2.5 text-sm font-medium text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)] transition hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] active:scale-95 sm:px-3 sm:py-2"
            aria-label="Open on YouTube Music"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
            </svg>
            <span className="hidden sm:inline">YT Music</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-70 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              aria-hidden="true"
            >
              <path d="M5 19L19 5M19 5H9M19 5V15" />
            </svg>
          </a>
        </div>
      </div>

      {/* hero */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-28 pb-10 text-center">
        <img
          src={logoAsset.url}
          alt="Deluxe Saloon"
          className="w-60 max-w-[70vw] -translate-y-2 drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] sm:w-80"
        />
        <h1 className="sr-only">Deluxe Saloon</h1>
      </div>

      {/* player */}
      <div className="z-20 w-full px-4 pb-6 sm:pb-8">
        <div className="mx-auto flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/15 bg-black/45 p-3 backdrop-blur-xl sm:gap-4 sm:p-4">
          <div
            className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl sm:h-16 sm:w-16"
            style={{ backgroundImage: track.tint }}
            aria-hidden="true"
          >
            <div className="flex items-end gap-[3px]">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-white/85"
                  style={{
                    height: 10 + i * 4,
                    animation: playing ? `saloon-eq 900ms ease-in-out ${i * 120}ms infinite alternate` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white sm:text-base">{track.title}</p>
            <p className="truncate text-xs text-white/60 sm:text-sm">
              {track.artist} · {track.film} ({track.year})
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] tabular-nums text-white/50">{fmt(elapsed)}</span>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white/80 transition-[width] duration-1000 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[11px] tabular-nums text-white/50">{fmt(track.duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous track"
              onClick={() => setIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length)}
              className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 5h2v14H6zM20 5v14l-11-7z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => setPlaying((p) => !p)}
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-black transition hover:bg-white/90 active:scale-95"
            >
              {playing ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 4l13 8-13 8z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              aria-label="Next track"
              onClick={() => setIndex((i) => (i + 1) % TRACKS.length)}
              className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16 5h2v14h-2zM4 5l11 7-11 7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
