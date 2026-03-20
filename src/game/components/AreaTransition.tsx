import { useEffect, useState } from 'react'
import { useGame } from '../../context/GameContext'
import { AREAS } from '../data/areas'

const AREA_COLORS: Record<string, string> = {
  'CPU Valley':        '#44aaff',
  'Process Plains':    '#44ff88',
  'Memory Mountains':  '#8866ff',
  'File Forest':       '#44cc44',
  'Sync Sanctuary':    '#cc44ff',
  'Network Nexus':     '#00ccff',
  'Kernel Castle':     '#ff6600',
}

export default function AreaTransition() {
  const { state, dispatch } = useGame()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (state.phase !== 'transition') return
    setVisible(true)
    const timer = setTimeout(() => {
      dispatch({
        type: 'SET_AREA',
        area: state.transitionArea,
        x: state.playerPos.x,
        y: state.playerPos.y,
      })
      setTimeout(() => setVisible(false), 300)
    }, 900)
    return () => clearTimeout(timer)
  }, [state.phase, state.transitionArea]) // eslint-disable-line

  if (state.phase !== 'transition' && !visible) return null

  const area = AREAS[state.transitionArea]
  const col = AREA_COLORS[state.transitionArea] ?? '#e8a020'

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.92)',
        animation: state.phase === 'transition' ? 'fadeIn 0.25s ease-out' : 'none',
      }}>
      {/* Divider lines */}
      <div style={{ position:'absolute', left:0, right:0, top:'50%', transform:'translateY(-28px)', height:1, background: `${col}33` }} />
      <div style={{ position:'absolute', left:0, right:0, top:'50%', transform:'translateY(28px)',  height:1, background: `${col}33` }} />

      <div className="flex flex-col items-center gap-3" style={{ animation: 'slideUp 0.35s ease-out' }}>
        <div className="font-pixel" style={{ fontSize: 7, color: `${col}99`, letterSpacing: '0.25em' }}>
          NOW ENTERING
        </div>
        <h2 className="font-pixel" style={{
          fontSize: 20, color: col,
          textShadow: `0 0 30px ${col}88, 0 0 60px ${col}44`,
          letterSpacing: '0.06em',
        }}>
          {state.transitionArea.toUpperCase()}
        </h2>
        {area && (
          <p className="font-vt text-center" style={{
            fontSize: 18, color: '#778899', maxWidth: 420, lineHeight: 1.5,
            padding: '0 24px',
          }}>
            {area.desc}
          </p>
        )}
      </div>
    </div>
  )
}
