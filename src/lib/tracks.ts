import coverAsset from "@/assets/cover-default.jpg.asset.json";

export type Track = {
  id: string;
  title: string;
  artist: string;
  cover: string | null;
  audio: string | null;
};

// Songs play directly from audio files hosted on the site's CDN.
// Upload audio files in chat and they'll be wired in here.
export const TRACKS: Track[] = [
  { id: "1", title: "Pehla Nasha", artist: "Udit Narayan, Sadhana Sargam", cover: coverAsset.url, audio: null },
  { id: "2", title: "Chura Ke Dil Mera", artist: "Kumar Sanu, Alka Yagnik", cover: coverAsset.url, audio: null },
  { id: "3", title: "Ae Kaash Ke Hum", artist: "Kumar Sanu", cover: coverAsset.url, audio: null },
  { id: "4", title: "Tu Cheez Badi Hai", artist: "Udit Narayan, Neelam", cover: coverAsset.url, audio: null },
  { id: "5", title: "Kuch Kuch Hota Hai", artist: "Udit Narayan, Alka Yagnik", cover: coverAsset.url, audio: null },
  { id: "6", title: "Sona Kitna Sona Hai", artist: "Poornima, Vinod Rathod", cover: coverAsset.url, audio: null },
];
