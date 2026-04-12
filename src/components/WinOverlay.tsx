import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import type { GameAction } from '../game/types'
import { phrases } from '../phrases'

/** Fires a confetti burst on mount. */
function triggerConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.5 },
  })
}

/** Full-screen overlay shown when the player solves the phrase. */
export function WinOverlay({
  phrase,
  currentLevel,
  dispatch,
}: {
  phrase: string
  currentLevel: number
  dispatch: (action: GameAction) => void
}) {
  useEffect(() => {
    triggerConfetti()
  }, [])

  const isLastLevel = currentLevel === phrases.length - 1
  const buttonLabel = isLastLevel ? 'Empezar de nuevo' : 'Siguiente'

  return (
    <div className="win-overlay">
      <div className="win-card">
        <p className="win-phrase">{phrase}</p>
        <button className="win-next" onClick={() => dispatch({ type: 'NEXT_LEVEL' })}>
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}
