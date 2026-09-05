# 🏏 Gully Cricket BDQ

> **90s Nostalgia Radio & Street Ambiance**

_Streaming classic 90s Indian bangers — capturing the essence of street nostalgia and local barber shop radio._

---

## 🌆 The Concept

**Gully Cricket BDQ** brings back the raw nostalgia of Indian street culture and the distinct soundtrack of local neighborhood barber shops—where timeless 90s Bollywood hits play continuously from cassette players while life happens outside.

Inspired by [Deluxe Saloon](https://saloon.wtf), this web application combines an interactive radio player featuring iconic 90s & 2000s tracks with liquid-glass aesthetics, real-time digital clock HUD, live simulated listener counts, and quick links to streaming playlists.

---

## ✨ Features

- 🎵 **65+ Classic 90s Hits**: Curated audio library featuring legendary artists like Kumar Sanu, Alka Yagnik, Udit Narayan, Sonu Nigam, Pankaj Udhas, Altaf Raja, Anuradha Paudwal, Nusrat Fateh Ali Khan, and more.
- 🎛️ **Liquid Glass Audio Player**: Built with glassmorphism UI, real-time audio progress bar, time seeker, equalizer visualizer animation, play/pause/skip controls, and full tracklist drawer.
- 📻 **Nostalgic Ambiance & HUD**: Real-time digital clock, live simulated online listener count, retro street backdrop graphics, and custom branding.
- 🎧 **Playlist Links**: Quick-access shortcuts to stream full playlists on **Spotify** and **YouTube Music**.
- 📱 **Fully Responsive**: Optimized for seamless playback across mobile phones, tablets, and desktop displays.

---

## 🌐 Live Website

**[Visit Gully Cricket BDQ](https://gullycricketbdq.vercel.app/)**

---

## 🎨 Inspiration

Visual and radio experience concept inspired by **[Deluxe Saloon](https://saloon.wtf)**.

---

## 🛠️ Tech Stack

- **Framework**: [TanStack React Start](https://tanstack.com/start) (Fullstack React Framework)
- **Routing**: [TanStack React Router](https://tanstack.com/router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide React Icons](https://lucide.dev/)
- **State Management**: [TanStack React Query](https://tanstack.com/query)
- **Build Tooling & Server Engine**: [Vite](https://vitejs.dev/) & [Nitro](https://nitro.unjs.io/)
- **Language**: TypeScript

---

## 📁 Project Structure

```text
gullycricketbdq/
├── public/                # Static assets & icons
├── src/
│   ├── assets/            # Background images, logo assets, track audio & covers
│   ├── components/
│   │   ├── player/        # MusicPlayer component with equalizer and track controls
│   │   └── ui/            # Reusable UI components
│   ├── lib/
│   │   └── tracks.ts      # Curated playlist dataset with audio & cover references
│   ├── routes/
│   │   ├── __root.tsx     # Root route wrapper & html shell layout
│   │   └── index.tsx      # Main radio landing page & top HUD
│   ├── styles.css         # Global styles & custom equalizer keyframe animations
│   └── router.tsx         # Router configuration
├── package.json           # Scripts & dependencies
├── vite.config.ts         # Vite configuration with TanStack Start integration
└── tsconfig.json          # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js (v18+)** and **npm** or **Bun** installed on your system.

### 1. Clone the Repository

```bash
git clone https://github.com/Shreyansh-patni/gullycricketbdq.git
cd gullycricketbdq
```

### 2. Install Dependencies

Using **npm**:

```bash
npm install
```

Or using **Bun**:

```bash
bun install
```

### 3. Run Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the URL displayed in your terminal).

---

## 📜 Available Scripts

| Command             | Description                                    |
| :------------------ | :--------------------------------------------- |
| `npm run dev`       | Starts the Vite development server             |
| `npm run build`     | Builds the production bundle with Nitro        |
| `npm run build:dev` | Builds the project with development mode flags |
| `npm run preview`   | Previews the production build locally          |
| `npm run lint`      | Runs ESLint to check for code issues           |
| `npm run format`    | Formats codebase with Prettier                 |

---

## 👤 Author

Crafted by **[Shreyansh Patni](https://shreyanshpatni.dev)**.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
