import { useEffect, useState, useCallback, useRef } from 'react'
import { useGame } from '../../context/GameContext'

export default function DialogueBox() {
  const { state, dispatch } = useGame()
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentLine = state.dialogueLines[state.dialogueIndex]

  const advance = useCallback(() => {
    if (!done) {
      setDisplayed(currentLine?.text ?? '')
      setDone(true)
      return
    }
    const text = currentLine?.text ?? ''
    if (text.includes('[QUIZ]')) {
      dispatch({ type: 'START_QUIZ' })
      return
    }
    dispatch({ type: 'ADVANCE_DIALOGUE' })
    setDisplayed('')
    setDone(false)
  }, [done, currentLine, dispatch])

  // Typewriter effect
  useEffect(() => {
    if (!currentLine) return
    setDisplayed('')
    setDone(false)
    let i = 0
    const text = currentLine.text
    const tick = () => {
      i++
      setDisplayed(text.slice(0, i))
      if (i < text.length) {
        timerRef.current = setTimeout(tick, 22)
      } else {
        setDone(true)
      }
    }
    timerRef.current = setTimeout(tick, 22)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [state.dialogueIndex, state.dialogueLines])

  // Key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      if (['input', 'textarea', 'button'].includes(tag)) return
      if (e.key === 'Enter' || e.key === 'e' || e.key === 'E' || e.key === ' ') {
        e.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [advance])

  if (!currentLine) return null

  const speakerColor = currentLine.color ?? '#e8a020'
  const totalLines = state.dialogueLines.length
  const idx = state.dialogueIndex

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 anim-slideUp"
      style={{ background: 'rgba(5,5,16,0.97)', borderTop: '3px solid #1a3a6e' }}>
      <div className="absolute -top-8 left-4 font-pixel text-xs px-3 py-1"
        style={{ background: '#050510', border: `2px solid ${speakerColor}`, color: speakerColor }}>
        {currentLine.speaker}
      </div>
      <div className="px-6 py-4 flex flex-col gap-2" style={{ minHeight: '100px' }}>
        <p className="font-vt text-xl leading-relaxed" style={{ color: '#eaeaea', minHeight: '3.2em' }}>
          {displayed}
          {!done && <span className="anim-blink" style={{ color: speakerColor }}>▌</span>}
        </p>
        <div className="flex items-center justify-between">
          <div className="font-pixel text-xs" style={{ color: '#445566' }}>
            {idx + 1} / {totalLines}
          </div>
          {done && (
            <button
              className="font-pixel text-xs anim-blink cursor-pointer"
              style={{ background: 'none', border: 'none', color: '#e8a020' }}
              onClick={advance}>
              {idx + 1 < totalLines ? '▼ NEXT' : '▼ CLOSE'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
