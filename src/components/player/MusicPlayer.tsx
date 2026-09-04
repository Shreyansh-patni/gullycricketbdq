import { useCallback, useEffect, useRef, useState } from "react";
import coverAsset from "@/assets/cover-default.jpg.asset.json";

const PLAYLIST_URI = "spotify:playlist:2AVjI8Z57bqMJVtU3V9X1Q";
const PLAYLIST_URL =
  "https://open.spotify.com/playlist/2AVjI8Z57bqMJVtU3V9X1Q?si=rZ1U5KR5RuqZyP7s2dvJHw";
const EMBED_URL = `https://open.spotify.com/embed/playlist/2AVjI8Z57bqMJVtU3V9X1Q?utm_source=generator&theme=0`;

type TrackMeta = { title: string; artist: string; cover: string | null };

type SpotifyIframeApi = {
  createController: (
    element: HTMLElement,
    options: { width: string; height: string; uri: string },
    callback: (controller: EmbedController) => void,
  ) => void;
};

type EmbedController = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  addListener: (
    event: "ready" | "playback_update" | "playback_started",
    cb: (e: { data?: PlaybackData }) => void,
  ) => void;
};

type PlaybackData = {
  isPaused?: boolean;
  isBuffering?: boolean;
  position?: number;
  duration?: number;
  trackURI?: string;
  metadata?: {
    title?: string;
    artists?: { name?: string }[];
    images?: { url?: string }[];
  };
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
    __spotifyIframeApi?: SpotifyIframeApi;
  }
}

function fmt(sec: number) {
  const total = Math.max(0, Math.floor(sec));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<EmbedController | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [track, setTrack] = useState<TrackMeta>({
    title: "Deluxe Saloon Radio",
    artist: "90s Bollywood barber shop mix",
    cover: coverAsset.url,
  });
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const init = (api: SpotifyIframeApi) => {
      if (controllerRef.current) return;
      api.createController(mount, { width: "0", height: "0", uri: PLAYLIST_URI }, (controller) => {
        controllerRef.current = controller;
        setReady(true);
        controller.addListener("playback_update", ({ data }) => {
          if (!data) return;
          setPlaying(!data.isPaused && !data.isBuffering);
          setPosition((data.position ?? 0) / 1000);
          setDuration((data.duration ?? 0) / 1000);
          const meta = data.metadata;
          if (meta?.title) {
            setTrack({
              title: meta.title,
              artist: meta.artists?.map((a) => a?.name).filter(Boolean).join(", ") || "",
              cover: meta.images?.[0]?.url ?? coverAsset.url,
            });
          }
        });
      });
    };

    if (window.__spotifyIframeApi) {
      init(window.__spotifyIframeApi);
      return;
    }
    window.onSpotifyIframeApiReady = (api) => {
      window.__spotifyIframeApi = api;
      init(api);
    };
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const toggle = useCallback(() => controllerRef.current?.togglePlay(), []);
  const next = useCallback(() => controllerRef.current?.next(), []);
  const prev = useCallback(() => controllerRef.current?.previous(), []);

  const progress = duration ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-[28px] bg-black/90 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 backdrop-blur-xl sm:p-6">
        {/* hidden Spotify controller */}
        <div ref={mountRef} className="hidden" aria-hidden="true" />

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
            disabled={!ready}
            className="text-white transition hover:opacity-80 active:scale-95 disabled:opacity-40"
          >
            <svg width="42" height="30" viewBox="0 0 42 30" fill="currentColor" aria-hidden="true">
              <path d="M20 5v20L4 15zM40 5v20L24 15z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={toggle}
            disabled={!ready}
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
            disabled={!ready}
            className="text-white transition hover:opacity-80 active:scale-95 disabled:opacity-40"
          >
            <svg width="42" height="30" viewBox="0 0 42 30" fill="currentColor" aria-hidden="true">
              <path d="M2 5v20l16-10zM22 5v20l16-10z" />
            </svg>
          </button>
        </div>

        {/* footer row */}
        <div className="mt-4 flex items-center justify-between text-xs text-white/40">
          <a href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer" className="transition hover:text-white/70">
            Open playlist on Spotify
          </a>
          <button
            type="button"
            onClick={() => setShowEmbed((v) => !v)}
            className="rounded-full border border-white/15 px-3 py-1 transition hover:border-white/40 hover:text-white/70"
          >
            {showEmbed ? "Hide playlist" : "Browse playlist"}
          </button>
        </div>
      </div>

      {/* expandable Spotify embed */}
      <div
        className={`grid transition-all duration-300 ${showEmbed ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          {showEmbed ? (
            <iframe
              data-testid="embed-iframe"
              title="Deluxe Saloon Spotify playlist"
              className="rounded-2xl"
              src={EMBED_URL}
              width="100%"
              height="352"
              frameBorder={0}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
