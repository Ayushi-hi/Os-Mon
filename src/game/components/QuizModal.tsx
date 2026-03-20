import { useGame } from '../../context/GameContext'

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function QuizModal() {
  const { state, dispatch } = useGame()
  const { currentQuiz, quizAnswered, quizCorrect } = state

  if (!currentQuiz) return null

  const close = () => {
    dispatch({ type: 'SET_PHASE', phase: 'exploring' })
  }

  const handleAnswer = (index: number) => {
    dispatch({ type: 'ANSWER_QUIZ', index })

    // Mark the NPC that triggered this quiz as defeated/done
    try {
      const raw = sessionStorage.getItem('pendingNpcQuiz')
      if (raw) {
        const { area, npcIndex } = JSON.parse(raw)
        dispatch({ type: 'MARK_NPC_DEFEATED', area, npcIndex })
        sessionStorage.removeItem('pendingNpcQuiz')
      }
    } catch {
      sessionStorage.removeItem('pendingNpcQuiz')
    }
  }

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="anim-fadeIn w-full max-w-2xl flex flex-col gap-4"
        style={{ background: '#050510', border: '3px solid #7a44cc', padding: 24, maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-pixel text-sm" style={{ color: '#7a44cc' }}>
              ⚡ OS KNOWLEDGE QUIZ
            </h2>
            <p className="font-pixel mt-1" style={{ fontSize: 8, color: '#667799' }}>
              TOPIC: {currentQuiz.topic.toUpperCase()} · +{currentQuiz.xpReward} XP
            </p>
          </div>
          {!quizAnswered && (
            <button className="font-pixel text-xs cursor-pointer"
              style={{ background: 'none', border: '1px solid #333', color: '#556', padding: '4px 8px' }}
              onClick={close}>✕</button>
          )}
        </div>

        {/* Question */}
        <div className="font-vt text-xl leading-relaxed p-4"
          style={{ background: '#0d0d1a', border: '2px solid #1a3a6e', color: '#eee', lineHeight: 1.65 }}>
          {currentQuiz.question}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2">
          {currentQuiz.options.map((opt, i) => {
            let bg = '#101830', borderCol = '#1a3a6e', color = '#eee'
            if (quizAnswered) {
              if (i === currentQuiz.correctIndex) {
                bg = '#0d2a0d'; borderCol = '#44bb44'; color = '#88ff88'
              } else {
                bg = '#1a0808'; borderCol = '#553333'; color = '#886666'
              }
            }
            return (
              <button
                key={i}
                className="font-pixel text-left cursor-pointer transition-all"
                disabled={quizAnswered}
                style={{ fontSize: 8, padding: '12px 14px', background: bg, border: `2px solid ${borderCol}`, color, lineHeight: 1.7 }}
                onMouseEnter={e => { if (!quizAnswered) (e.currentTarget as HTMLButtonElement).style.background = '#1a3a6e' }}
                onMouseLeave={e => { if (!quizAnswered) (e.currentTarget as HTMLButtonElement).style.background = bg }}
                onClick={() => handleAnswer(i)}>
                <span style={{ color: '#7a44cc', marginRight: 10 }}>[{OPTION_LABELS[i]}]</span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {quizAnswered && (
          <div className="anim-fadeIn">
            <div className="font-pixel text-xs mb-2" style={{ color: quizCorrect ? '#88ff88' : '#ff8888' }}>
              {quizCorrect ? `✓ CORRECT! +${currentQuiz.xpReward} XP` : '✗ INCORRECT'}
            </div>
            {quizCorrect && state.levelUpMsg && (
              <div className="font-pixel mb-2" style={{ fontSize:8, color:'#e8a020', background:'#1a1200', padding:'6px 10px', border:'1px solid #e8a020' }}>
                ★ {state.levelUpMsg}
              </div>
            )}
            <div className="font-vt text-lg leading-relaxed p-4"
              style={{ background: '#0a0a1a', border: '1px solid #2a2a4a', color: '#aabbcc', whiteSpace: 'pre-line', lineHeight: 1.65 }}>
              {currentQuiz.explanation}
            </div>
            <button
              className="font-pixel text-xs mt-3 px-6 py-2 cursor-pointer clip-corner-sm"
              style={{ background: '#e8a020', color: '#000', border: 'none' }}
              onClick={close}>
              CONTINUE ▶
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
