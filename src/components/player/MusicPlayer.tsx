import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "@/lib/tracks";

function fmt(sec: number) {
  const total = Math.max(0, Math.floor(sec));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = tracks[index] ?? tracks[0];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % tracks.length);
  }, [tracks.length]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  // Load the new track when the index changes; keep playing if it was.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setPosition(0);
    setDuration(0);
    audio.load();
    if (playing && track?.audio) void audio.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !track?.audio) return;
    if (playing) {
      audio.pause();
    } else {
      void audio.play().catch(() => setPlaying(false));
    }
  };

  if (!track) return null;

  const progress = duration ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-xl rounded-[28px] bg-black/90 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-xl sm:p-6">
      <audio
        ref={audioRef}
        src={track.audio ?? undefined}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
      />

      {/* top row */}
      <div className="flex items-center gap-4">
        <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-white/10 sm:h-20 sm:w-20">
          {track.cover ? (
            <img src={track.cover} alt={`${track.title} cover art`} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold text-white sm:text-xl">{track.title}</p>
          <p className="truncate text-base text-white/45">{track.artist}</p>
        </div>
        <div className="flex items-end gap-[3px] pr-1" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-[#d9a58c]"
              style={{
                height: [8, 14, 18, 14, 9][i],
                animation: playing ? `saloon-eq 900ms ease-in-out ${i * 110}ms infinite alternate` : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* progress */}
      <div className="mt-5 flex items-center gap-3">
        <span className="text-sm tabular-nums text-white/60">{fmt(position)}</span>
        <div className="h-[6px] flex-1 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white/60 transition-[width] duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm tabular-nums text-white/60">−{fmt(Math.max(0, duration - position))}</span>
      </div>

      {/* controls */}
      <div className="mt-5 flex items-center justify-center gap-10 sm:gap-14">
        <button
          type="button"
          aria-label="Previous track"
          onClick={prev}
          className="text-white transition hover:opacity-80 active:scale-95"
        >
          <svg width="42" height="30" viewBox="0 0 42 30" fill="currentColor" aria-hidden="true">
            <path d="M20 5v20L4 15zM40 5v20L24 15z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={toggle}
          disabled={!track.audio}
          className="text-white transition hover:opacity-80 active:scale-95 disabled:opacity-40"
        >
          {playing ? (
            <svg width="34" height="38" viewBox="0 0 34 38" fill="currentColor" aria-hidden="true">
              <rect x="3" y="2" width="10" height="34" rx="3" />
              <rect x="21" y="2" width="10" height="34" rx="3" />
            </svg>
          ) : (
            <svg width="34" height="38" viewBox="0 0 34 38" fill="currentColor" aria-hidden="true">
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
          <svg width="42" height="30" viewBox="0 0 42 30" fill="currentColor" aria-hidden="true">
            <path d="M2 5v20l16-10zM22 5v20l16-10z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
