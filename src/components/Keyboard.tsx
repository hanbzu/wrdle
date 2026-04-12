import type { GameAction } from '../game/types'

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
]

/** Returns the color class for a keyboard key. */
function keyColor(key: string, revealedChars: Set<string>, missedChars: Set<string>) {
  if (revealedChars.has(key)) return 'green'
  if (missedChars.has(key)) return 'gray'
  return ''
}

/** On-screen QWERTY keyboard with A–Z + Ñ, Enter, and Backspace. Keys colored green/gray after use. */
export function Keyboard({
  dispatch,
  revealedChars,
  missedChars,
}: {
  dispatch: (action: GameAction) => void
  revealedChars: Set<string>
  missedChars: Set<string>
}) {
  function handleKey(key: string) {
    if (key === 'ENTER') {
      dispatch({ type: 'SUBMIT_WORD' })
    } else if (key === '⌫') {
      dispatch({ type: 'BACKSPACE' })
    } else {
      dispatch({ type: 'APPEND_LETTER', letter: key })
    }
  }

  return (
    <div className="keyboard">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className={[
                'key',
                key === 'ENTER' || key === '⌫' ? 'key-wide' : '',
                keyColor(key, revealedChars, missedChars),
              ]
                .filter(Boolean)
                .join(' ')}
              onPointerDown={(e) => { e.preventDefault(); handleKey(key) }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
