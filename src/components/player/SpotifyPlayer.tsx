import { useCallback, useEffect, useRef, useState } from "react";
import type { SpotifyTrack } from "@/lib/spotify.functions";

type Controller = {
  loadUri: (uri: string) => void;
  play: () => void;
  resume: () => void;
  pause: () => void;
  togglePlay: () => void;
  addListener: (event: string, cb: (e: { data: PlaybackData }) => void) => void;
  destroy: () => void;
};

type PlaybackData = { isPaused: boolean; isBuffering: boolean; duration: number; position: number };

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: {
      createController: (
        el: HTMLElement,
        options: { uri: string; width: string | number; height: string | number },
        cb: (controller: Controller) => void,
      ) => void;
    }) => void;
  }
}

function fmt(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SPOTIFY_PLAYLIST_URL =
  "https://open.spotify.com/playlist/2AVjI8Z57bqMJVtU3V9X1Q?si=rZ1U5KR5RuqZyP7s2dvJHw";

export function SpotifyPlayer({ tracks }: { tracks: SpotifyTrack[] }) {
  const embedRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<Controller | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);

  const track = tracks[index];

  const next = useCallback(() => {
    if (tracks.length) setIndex((i) => (i + 1) % tracks.length);
  }, [tracks.length]);

  const prev = useCallback(() => {
    if (tracks.length) setIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  // Load the Spotify iframe API once and create the controller.
  useEffect(() => {
    if (!track || controllerRef.current) return;
    let cancelled = false;

    const create = (api: NonNullable<Window["onSpotifyIframeApiReady"]> extends (a: infer A) => void ? A : never) => {
      if (cancelled || !embedRef.current) return;
      api.createController(embedRef.current, { uri: track.uri, width: "100%", height: 80 }, (controller) => {
        if (cancelled) return;
        controllerRef.current = controller;
        setReady(true);
        controller.addListener("playback_update", (e) => {
          setPosition(e.data.position);
          setDuration(e.data.duration);
          setPlaying(!e.data.isPaused);
          if (e.data.duration > 0 && e.data.position >= e.data.duration - 250 && !e.data.isPaused) {
            next();
          }
        });
      });
    };

    const existing = document.querySelector<HTMLScriptElement>('script[src*="embed/iframe-api"]');
    window.onSpotifyIframeApiReady = create;
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [track, next]);

  // Swap the loaded track when the index changes.
  const loadedUri = useRef<string | null>(null);
  useEffect(() => {
    const controller = controllerRef.current;
    if (!controller || !track) return;
    if (loadedUri.current === track.uri) return;
    const first = loadedUri.current === null;
    loadedUri.current = track.uri;
    controller.loadUri(track.uri);
    setPosition(0);
    setDuration(track.durationMs);
    if (!first) window.setTimeout(() => controller.play(), 400);
  }, [track, ready]);

  if (!track) {
    return (
      <div className="mx-auto w-full max-w-xl rounded-[28px] bg-black/90 p-6 text-center text-sm text-white/70 backdrop-blur-xl">
        Playlist unavailable right now.{" "}
        <a
          href={SPOTIFY_PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white underline underline-offset-4"
        >
          Open it on Spotify
        </a>
      </div>
    );
  }

  const totalMs = duration || track.durationMs;
  const progress = totalMs ? Math.min(100, (position / totalMs) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-xl rounded-[28px] bg-black/90 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-xl sm:p-6">
      {/* top row */}
      <div className="flex items-center gap-4">
        <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-white/10 sm:h-20 sm:w-20">
          {track.image ? (
            <img src={track.image} alt={`${track.title} cover art`} className="h-full w-full object-cover" />
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
        <span className="text-sm tabular-nums text-white/60">−{fmt(Math.max(0, totalMs - position))}</span>
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
          onClick={() => controllerRef.current?.togglePlay()}
          className="text-white transition hover:opacity-80 active:scale-95"
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

      {/* Spotify embed (required for playback + attribution) */}
      <div className="mt-4 overflow-hidden rounded-xl">
        <div ref={embedRef} />
      </div>
    </div>
  );
}
