# OS-Mon Academy 🎮

A fully 3D, browser-based Pokémon-style educational RPG about Operating Systems concepts, built with **React + Vite + TypeScript + Three.js + TailwindCSS**.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

---

## 🏗 Project Structure

```
src/
├── App.tsx                          ← Root component, phase orchestrator
├── main.tsx                         ← React entry point
├── index.css                        ← @import fonts → @tailwind → custom CSS
│
├── context/
│   └── GameContext.tsx              ← Global state (useReducer), all game actions
│
└── game/
    ├── components/
    │   ├── GameCanvas.tsx           ← Three.js 3D world + WASD movement + encounters
    │   ├── MonSprite.tsx            ← Per-mon 3D sprite (5 shape variants, animated)
    │   ├── TitleScreen.tsx          ← Animated 3D title with showcase mons
    │   ├── BattleScreen.tsx         ← Turn-based battle UI with 3D mon renders
    │   ├── DialogueBox.tsx          ← Typewriter NPC dialogue box
    │   ├── QuizModal.tsx            ← Terminal-style OS knowledge quiz
    │   ├── InventoryPanel.tsx       ← Roster / OS-Dex / Info tabs
    │   ├── GameUI.tsx               ← HUD overlay (HP bars, area name, controls)
    │   └── AreaTransition.tsx       ← Black screen area transition
    │
    ├── data/
    │   ├── osmons.ts                ← All 18 OS-Mons + 50 moves
    │   ├── areas.ts                 ← 7 areas with tile maps, NPCs, portals
    │   └── quizQuestions.ts         ← 10 OS concept quiz questions
    │
    └── systems/
        ├── battleSystem.ts          ← Damage calc, status effects, XP
        ├── catchingSystem.ts        ← Ball catch probability formula
        ├── inputHandler.ts          ← Keyboard singleton (skips form elements)
        └── saveManager.ts           ← localStorage save/load
```

---

## 🎮 Controls

| Key | Action |
|-----|--------|
| WASD / Arrow Keys | Move player |
| E / Enter | Interact with NPC or Quiz Station |
| Space | Open inventory menu |
| Escape | Close menus |

---

## 🌍 Areas

| Area | OS-Mons | Theme |
|------|---------|-------|
| CPU Valley | Processus, Threadax, CPUScheduler, Queuemon, Contextus | Scheduling |
| Process Plains | Processus, Threadax, Queuemon, Contextus | Processes & IPC |
| Memory Mountains | Cachemon, PageSwap, Segmentian | Virtual Memory |
| File Forest | Filesaur, Inodeer, Buffering | Filesystems |
| Sync Sanctuary | DeadLockus, Syncro, Mutexor, Monitormon | Concurrency |
| Network Nexus | Networkit | Networking |
| Kernel Castle | CPUScheduler, Kernelion, Interruptus | Kernel internals |

---

## 👾 OS-Mons (18 total)

Each OS-Mon represents a real OS concept:

| # | Name | Concept | Rarity | Type |
|---|------|---------|--------|------|
| 1 | Processus | Processes | Basic | Process |
| 2 | Threadax | Threading | Basic | Process |
| 3 | Cachemon | Memory Cache | Common | Memory |
| 4 | DeadLockus | Deadlocks | Rare | Kernel |
| 5 | PageSwap | Virtual Memory | Common | Memory |
| 6 | CPUScheduler | CPU Scheduling | **Legendary** | Kernel |
| 7 | Filesaur | File Systems | Common | FileSystem |
| 8 | Kernelion | OS Kernel | **Legendary** | Kernel |
| 9 | Syncro | Synchronization | Rare | Sync |
| 10 | Networkit | Networking | Common | Network |
| 11 | Segmentian | Segmentation | Uncommon | Memory |
| 12 | Inodeer | Inodes | Common | FileSystem |
| 13 | Queuemon | Process Queues | Common | Process |
| 14 | Buffering | Buffers | Uncommon | Memory |
| 15 | Contextus | Context Switch | Rare | Kernel |
| 16 | Interruptus | Interrupts | Uncommon | Kernel |
| 17 | Mutexor | Mutual Exclusion | Rare | Sync |
| 18 | Monitormon | Monitors | Uncommon | Sync |

---

## 📚 Quiz Topics

1. Deadlock — Coffman conditions
2. Process vs Thread differences
3. TLB (Translation Lookaside Buffer)
4. CPU scheduling & starvation
5. Page fault handling sequence
6. fork() return values
7. Thrashing in virtual memory
8. Mutex vs Semaphore
9. Unix inode structure
10. Race conditions & prevention

---

## 🛠 Tech Stack

- **React 18** + **TypeScript** — UI + state management
- **Three.js r160** — Full 3D rendering (world, battle sprites, title screen)
- **TailwindCSS 3** — Utility-class UI panels
- **Vite 5** — Dev server + build
- **localStorage** — Auto-save system

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/three": "^0.160.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.12"
  }
}
```
# Os-Mon
# Os-Mon
# Os-Mon
# Os-Mon
