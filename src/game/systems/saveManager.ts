import type { GameState } from '../../context/GameContext'

const SAVE_KEY = 'osmon_save_v1'

export function saveGame(state: GameState) {
  try {
    const data = {
      trainerName: state.trainerName,
      currentArea: state.currentArea,
      playerPos: state.playerPos,
      party: state.party,
      caught: Array.from(state.caught),
      seen: Array.from(state.seen),
      items: state.items,
      badges: state.badges,
      savedAt: Date.now(),
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Save failed:', e)
  }
}

export function loadGame(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return {
      ...data,
      caught: new Set(data.caught),
      seen: new Set(data.seen),
    }
  } catch {
    return null
  }
}

export function hasSave(): boolean {
  return !!localStorage.getItem(SAVE_KEY)
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY)
}
