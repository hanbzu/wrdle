const MAX_GUESSES = 5
const WORD_LENGTH = 5

/** Returns the color class for a submitted guess tile letter. */
function tileColor(letter: string, revealedChars: Set<string>, missedChars: Set<string>) {
  if (!letter) return ''
  if (revealedChars.has(letter)) return 'green'
  if (missedChars.has(letter)) return 'gray'
  return ''
}

/** Renders a 5×5 grid of submitted guess tiles, with the current input shown in the next empty row. */
export function GuessHistory({
  guesses,
  revealedChars,
  missedChars,
  currentInput,
  invalidSubmit,
}: {
  guesses: string[]
  revealedChars: Set<string>
  missedChars: Set<string>
  currentInput: string
  invalidSubmit: number
}) {
  const activeRowIndex = guesses.length

  const rows = Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
    const isActive = rowIndex === activeRowIndex
    const word = isActive ? currentInput : (guesses[rowIndex] ?? '')
    const cells = Array.from({ length: WORD_LENGTH }, (_, colIndex) => word[colIndex] ?? '')
    return { rowIndex, cells, isActive }
  })

  return (
    <div className="guess-history">
      {rows.map(({ rowIndex, cells, isActive }) => (
        <div
          key={isActive ? `active-${invalidSubmit}` : rowIndex}
          className={`guess-row${isActive && invalidSubmit > 0 ? ' shake' : ''}`}
        >
          {cells.map((letter, colIndex) => (
            <span
              key={colIndex}
              className={['guess-tile', isActive && letter ? 'pending' : !isActive ? tileColor(letter, revealedChars, missedChars) : ''].filter(Boolean).join(' ')}
            >
              {letter}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
