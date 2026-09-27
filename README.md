# 🎹 Surprise Piano

A high-performance, modern, responsive meme piano web application built with **React 19**, **Vite**, and **Web Audio API**.

---

## 🌟 Key Features

* **🎹 24 Dynamic Piano Keys**: Spanning Octaves 4 and 5 (C4 through B5) with custom meme and funny sound effects.
* **📱 Ultra-Responsive Mobile & Desktop View**: Designed with a 100vh viewport fit, adaptive drawer controls, and landscape mode rotation prompt.
* **🎛️ Audio FX Engine**: Built-in real-time Web Audio API effects chain including **Reverb**, **Delay**, and **Filter**.
* **🎚️ Master Controls**: Mute/Unmute, Master Volume Slider, and Playback Speed adjustment (0.5x to 2.0x).
* **⌨️ Keyboard & Touch Support**: Play effortlessly using desktop QWERTY key shortcuts (A-L, W-O, Z-M) or multi-touch on mobile devices.
* **🔌 Web MIDI Support**: Plug-and-play compatibility with external USB MIDI keyboards.
* **🌙 Dark / Light Themes**: Toggleable visual themes with persistent local storage.

---

## 💻 QWERTY Keyboard Layout Map

```
  Black Keys:    [W]  [E]        [T]  [Y]  [U]        [I]  [O]        [P]       [V]  [N]
  White Keys:  [A]  [S]  [D]   [F]  [G]  [H]  [J]   [K]  [L]  [Z]   [X]  [C]   [B]  [M]
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cid-piano
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Architecture

```text
cid-piano/
├── public/
│   └── sounds/              # Audio samples mapped to piano keys
├── src/
│   ├── audio/
│   │   └── audioManager.js  # Web Audio API engine & FX chain
│   ├── components/
│   │   ├── Header/          # Application header & actions
│   │   ├── Mobile/          # Mobile drawer sidebar controls
│   │   ├── Piano/           # Piano container & key renderer
│   │   └── VolumeControl/   # Desktop control bar & FX panel
│   ├── config/
│   │   └── pianoConfig.js   # 24-key layout configuration & MIDI maps
│   ├── hooks/
│   │   ├── useKeyboardShortcuts.js
│   │   └── useLocalStorage.js
│   ├── styles/
│   │   └── index.css        # Core design system & responsive UI rules
│   ├── App.jsx              # Main App layout & state orchestrator
│   └── main.jsx             # React root entry point
├── package.json
└── vite.config.js
```

---

## 🛠️ Tech Stack

* **Frontend Framework**: React 19
* **Build Tool**: Vite 8
* **Icon Library**: Lucide React
* **Styling**: Modern CSS variables, glassmorphism, responsive flexbox/grid layout
* **Audio Processing**: Native Browser Web Audio API & Web MIDI API
