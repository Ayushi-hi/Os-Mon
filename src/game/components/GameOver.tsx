import { useEffect, useRef } from 'react'
import { useGame } from '../../context/GameContext'

export default function GameOver() {
  const { dispatch } = useGame()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    let frame = 0
    let animId = 0

    const draw = () => {
      animId = requestAnimationFrame(draw)
      frame++
      ctx.fillStyle = 'rgba(0,0,0,0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Falling "bits"
      for (let i = 0; i < 3; i++) {
        const x = Math.random() * canvas.width
        const y = ((frame * 2 + i * 120) % canvas.height)
        ctx.fillStyle = `rgba(180,30,30,${Math.random() * 0.4 + 0.1})`
        ctx.font = `${10 + Math.floor(Math.random() * 8)}px monospace`
        ctx.fillText(Math.random() > 0.5 ? '1' : '0', x, y)
      }
    }
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  const goToTitle = () => {
    dispatch({ type: 'SET_PHASE', phase: 'title' })
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        goToTitle()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: '#000', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>

        {/* Glitch-style title */}
        <div style={{ position: 'relative' }}>
          <div className="font-pixel" style={{
            fontSize: 52, color: '#cc1111',
            textShadow: '3px 0 #ff4444, -3px 0 #880000, 0 0 40px #cc0000',
            letterSpacing: '0.08em',
            animation: 'gameover-glitch 2s infinite',
          }}>
            GAME OVER
          </div>
          <div className="font-pixel" style={{ fontSize: 10, color: '#551111', letterSpacing: '0.3em', marginTop: 6 }}>
            ALL OS-MONS HAVE FAINTED
          </div>
        </div>

        {/* Skull-ish icon made of text */}
        <div className="font-vt" style={{ fontSize: 72, color: '#cc2222', lineHeight: 1, opacity: 0.7 }}>
          ☠
        </div>

        <div className="font-vt" style={{ fontSize: 18, color: '#555', maxWidth: 360 }}>
          Your OS-Mons have run out of HP. The system has crashed...
        </div>

        <button
          className="font-pixel cursor-pointer"
          style={{
            marginTop: 12, padding: '14px 40px', fontSize: 12,
            background: '#cc1111', color: '#fff', border: '2px solid #ff4444',
            letterSpacing: '0.1em',
            transition: 'all 0.15s',
            boxShadow: '0 0 20px #cc111166',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#ff2222'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px #ff222288'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#cc1111'
            ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px #cc111166'
          }}
          onClick={goToTitle}>
          ▶ RETURN TO TITLE
        </button>

        <div className="font-pixel" style={{ fontSize: 7, color: '#333' }}>
          PRESS ENTER / SPACE / E TO CONTINUE
        </div>
      </div>

      <style>{`
        @keyframes gameover-glitch {
          0%, 90%, 100% { transform: none; }
          92% { transform: translate(3px, 0) skewX(2deg); }
          94% { transform: translate(-3px, 0) skewX(-2deg); }
          96% { transform: translate(2px, 1px); }
          98% { transform: translate(-2px, -1px) skewX(1deg); }
        }
      `}</style>
    </div>
  )
}
