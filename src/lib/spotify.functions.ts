import { createServerFn } from "@tanstack/react-start";

export type SpotifyTrack = {
  id: string;
  uri: string;
  title: string;
  artist: string;
  image: string | null;
  durationMs: number;
};

const PLAYLIST_ID = "2AVjI8Z57bqMJVtU3V9X1Q";

let tokenCache: { value: string; expiresAt: number } | null = null;
let tracksCache: { value: SpotifyTrack[]; expiresAt: number } | null = null;

async function getToken(id: string, secret: string) {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now) return tokenCache.value;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`Spotify token failed (${res.status})`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  tokenCache = { value: json.access_token, expiresAt: now + (json.expires_in - 60) * 1000 };
  return json.access_token;
}

export const getPlaylist = createServerFn({ method: "GET" }).handler(async (): Promise<SpotifyTrack[]> => {
  const now = Date.now();
  if (tracksCache && tracksCache.expiresAt > now) return tracksCache.value;

  const id = process.env["SPOTIFY_CLIENT_ID"];
  const secret = process.env["SPOTIFY_CLIENT_SECRET"];
  if (!id || !secret) return [];

  try {
    const token = await getToken(id, secret);
    const res = await fetch(
      `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks?limit=50&fields=items(track(id,uri,name,duration_ms,artists(name),album(images)))`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) throw new Error(`Spotify playlist failed (${res.status})`);
    const json = (await res.json()) as {
      items: Array<{
        track: {
          id: string | null;
          uri: string;
          name: string;
          duration_ms: number;
          artists: Array<{ name: string }>;
          album: { images: Array<{ url: string }> };
        } | null;
      }>;
    };

    const tracks: SpotifyTrack[] = json.items
      .map((item) => item.track)
      .filter((t): t is NonNullable<typeof t> => Boolean(t?.id))
      .map((t) => ({
        id: t.id as string,
        uri: t.uri,
        title: t.name,
        artist: t.artists.map((a) => a.name).join(", "),
        image: t.album.images[0]?.url ?? null,
        durationMs: t.duration_ms,
      }));

    tracksCache = { value: tracks, expiresAt: now + 5 * 60 * 1000 };
    return tracks;
  } catch {
    return [];
  }
});
