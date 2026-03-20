/**
 * BattleWatcher: invisible component that listens for battle wins
 * and marks the associated NPC as defeated (so they don't battle again).
 */
import { useEffect, useRef } from 'react'
import { useGame } from '../../context/GameContext'

export default function BattleWatcher() {
  const { state, dispatch } = useGame()
  const prevBattleResult = useRef(state.battleResult)

  useEffect(() => {
    const prev = prevBattleResult.current
    const curr = state.battleResult
    prevBattleResult.current = curr

    if (prev !== 'win' && curr === 'win') {
      // A battle was just won — check if there's a pending NPC to mark defeated
      try {
        const raw = sessionStorage.getItem('pendingNpcDefeated')
        if (raw) {
          const { area, npcIndex } = JSON.parse(raw)
          dispatch({ type: 'MARK_NPC_DEFEATED', area, npcIndex })
          sessionStorage.removeItem('pendingNpcDefeated')
        }
      } catch {
        sessionStorage.removeItem('pendingNpcDefeated')
      }
    }
  }, [state.battleResult, dispatch])

  return null
}
