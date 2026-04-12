import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import type { GameAction } from '../game/types'

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
  dispatch,
}: {
  phrase: string
  dispatch: (action: GameAction) => void
}) {
  useEffect(() => {
    triggerConfetti()
  }, [])

  return (
    <div className="win-overlay">
      <div className="win-card">
        <p className="win-phrase">{phrase}</p>
        <button className="win-next" onClick={() => dispatch({ type: 'NEXT_LEVEL' })}>
          Siguiente
        </button>
      </div>
    </div>
  )
}
