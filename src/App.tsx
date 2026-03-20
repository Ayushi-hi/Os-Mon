import { GameProvider, useGame } from './context/GameContext'
import TitleScreen from './game/components/TitleScreen'
import GameCanvas from './game/components/GameCanvas'
import GameUI from './game/components/GameUI'
import BattleScreen from './game/components/BattleScreen'
import DialogueBox from './game/components/DialogueBox'
import QuizModal from './game/components/QuizModal'
import InventoryPanel from './game/components/InventoryPanel'
import AreaTransition from './game/components/AreaTransition'
import GameOver from './game/components/GameOver'
import BattleWatcher from './game/components/BattleWatcher'
import MusicController from './game/components/MusicController'

function Game() {
  const { state } = useGame()
  const isTitle = state.phase === 'title'
  const isGameOver = state.phase === 'gameover'
  const started = !isTitle && !isGameOver

  return (
    <div style={{ width:'100vw', height:'100vh', overflow:'hidden', position:'relative', background:'#050510' }}>
      <BattleWatcher />
      {isTitle && <TitleScreen />}

      {isGameOver && <GameOver />}

      {started && (
        <>
          {/* 3D canvas — always full size, always mounted */}
          <div style={{ position:'absolute', inset:0 }}>
            <GameCanvas />
          </div>

          {/* Battle overlays the canvas */}
          {state.phase === 'battle' && (
            <div style={{ position:'absolute', inset:0, zIndex:20 }}>
              <BattleScreen />
            </div>
          )}

          {/* HUD */}
          <GameUI />

          {/* Music */}
          <MusicController />

          {/* Dialogue */}
          {state.phase === 'dialogue' && <DialogueBox />}

          {/* Quiz */}
          {state.phase === 'quiz' && <QuizModal />}

          {/* Inventory */}
          {state.phase === 'inventory' && <InventoryPanel />}

          {/* Area transition */}
          <AreaTransition />
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  )
}
