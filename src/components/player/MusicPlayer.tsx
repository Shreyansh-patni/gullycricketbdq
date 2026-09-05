import { useCallback, useEffect, useRef, useState } from "react";
import { tracks } from "@/lib/tracks";

const PLAYLIST_URL =
  "https://open.spotify.com/playlist/2AVjI8Z57bqMJVtU3V9X1Q?si=rZ1U5KR5RuqZyP7s2dvJHw";

function fmt(sec: number) {
  const total = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showList, setShowList] = useState(false);

  const track = tracks[index] ?? tracks[0]!;

  const play = useCallback(() => {
    void audioRef.current?.play().catch(() => setPlaying(false));
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) play();
    else el.pause();
  }, [play]);

  const goto = useCallback((next: number) => {
    setIndex(((next % tracks.length) + tracks.length) % tracks.length);
    setPosition(0);
    setDuration(0);
  }, []);

  const next = useCallback(() => goto(index + 1), [goto, index]);
  const prev = useCallback(() => {
    const el = audioRef.current;
    if (el && el.currentTime > 3) {
      el.currentTime = 0;
      return;
    }
    goto(index - 1);
  }, [goto, index]);

  // when the track changes while playing, continue playback
  const wasPlaying = useRef(false);
  useEffect(() => {
    wasPlaying.current = playing;
  }, [playing]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.load();
    if (wasPlaying.current) void el.play().catch(() => setPlaying(false));
  }, [index]);

  const seek = useCallback((clientRatio: number) => {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    el.currentTime = clientRatio * el.duration;
  }, []);

  const progress = duration ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-[22rem]">
      <div className="relative overflow-hidden rounded-[20px] bg-white/5 p-3 shadow-[0_16px_40px_-14px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-1px_1px_rgba(255,255,255,0.06)] ring-1 ring-white/20 backdrop-blur-2xl backdrop-saturate-150 sm:p-4">
        {/* liquid glass sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_28%,transparent_45%,rgba(255,255,255,0.05)_80%,rgba(255,255,255,0.12)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/2 left-1/2 h-[140%] w-[80%] -translate-x-1/2 rounded-[100%] bg-white/8 blur-3xl"
        />

        <audio
          ref={audioRef}
          src={track.audio}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onEnded={next}
        />

        {/* top row */}
        <div className="relative flex items-center gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white/10 sm:h-13 sm:w-13">
            <img
              src={track.cover}
              alt={`${track.title} cover art`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white sm:text-base">{track.title}</p>
            {track.artist ? (
              <p className="truncate text-xs text-white/45 sm:text-sm">{track.artist}</p>
            ) : null}
          </div>
          <div className="flex items-end gap-[2px] pr-1" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-[2.5px] rounded-full bg-[#d9a58c]"
                style={{
                  height: [5, 9, 12, 9, 6][i],
                  animation: playing
                    ? `saloon-eq 900ms ease-in-out ${i * 110}ms infinite alternate`
                    : "none",
                }}
              />
            ))}
          </div>
        </div>

        {/* progress */}
        <div className="relative mt-3 flex items-center gap-2">
          <span className="text-xs tabular-nums text-white/60">{fmt(position)}</span>
          <div
            role="button"
            tabIndex={0}
            aria-label="Seek"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - r.left) / r.width);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") seek(Math.min(1, (position + 5) / (duration || 1)));
              if (e.key === "ArrowLeft") seek(Math.max(0, (position - 5) / (duration || 1)));
            }}
            className="h-[4px] flex-1 cursor-pointer overflow-hidden rounded-full bg-white/15"
          >
            <div
              className="h-full rounded-full bg-white/60 transition-[width] duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-white/60">
            −{fmt(Math.max(0, duration - position))}
          </span>
        </div>

        {/* controls */}
        <div className="relative mt-3 flex items-center justify-center gap-6 sm:gap-8">
          <button
            type="button"
            aria-label="Previous track"
            onClick={prev}
            className="text-white transition hover:opacity-80 active:scale-95"
          >
            <svg width="26" height="18" viewBox="0 0 42 30" fill="currentColor" aria-hidden="true">
              <path d="M20 5v20L4 15zM40 5v20L24 15z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={toggle}
            className="text-white transition hover:opacity-80 active:scale-95"
          >
            {playing ? (
              <svg
                width="22"
                height="24"
                viewBox="0 0 34 38"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="3" y="2" width="10" height="34" rx="3" />
                <rect x="21" y="2" width="10" height="34" rx="3" />
              </svg>
            ) : (
              <svg
                width="22"
                height="24"
                viewBox="0 0 34 38"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5 3l26 16L5 35z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            aria-label="Next track"
            onClick={next}
            className="text-white transition hover:opacity-80 active:scale-95"
          >
            <svg width="26" height="18" viewBox="0 0 42 30" fill="currentColor" aria-hidden="true">
              <path d="M2 5v20l16-10zM22 5v20l16-10z" />
            </svg>
          </button>
        </div>

        {/* footer row */}
        <div className="relative mt-3 flex items-center justify-between text-[10px] text-white/40">
          <a
            href={PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white/70"
          >
            Open playlist on Spotify
          </a>
          <button
            type="button"
            onClick={() => setShowList((v) => !v)}
            className="rounded-full border border-white/15 px-2.5 py-0.5 transition hover:border-white/40 hover:text-white/70"
          >
            {showList ? "Hide tracks" : `All ${tracks.length} tracks`}
          </button>
        </div>
      </div>

      {/* track list */}
      <div
        className={`grid transition-all duration-300 ${showList ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <ul className="max-h-48 overflow-y-auto rounded-2xl bg-white/5 p-1.5 ring-1 ring-white/15 backdrop-blur-2xl">
            {tracks.map((t, i) => (
              <li key={t.audio}>
                <button
                  type="button"
                  onClick={() => {
                    wasPlaying.current = true;
                    goto(i);
                  }}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition hover:bg-white/10 ${
                    i === index ? "bg-white/15" : ""
                  }`}
                >
                  <img
                    src={t.cover}
                    alt=""
                    loading="lazy"
                    className="h-7 w-7 rounded-md object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs text-white">{t.title}</span>
                    <span className="block truncate text-[10px] text-white/45">{t.artist}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
