const MAX_GUESSES = 5
const WORD_LENGTH = 5

/** Returns the color class for a submitted guess tile letter. */
function tileColor(letter: string, revealedChars: Set<string>, missedChars: Set<string>) {
  if (!letter) return ''
  if (revealedChars.has(letter)) return 'green'
  if (missedChars.has(letter)) return 'gray'
  return ''
}

/** Renders a 5×5 grid of submitted guess tiles, colored green/gray per letter. */
export function GuessHistory({
  guesses,
  revealedChars,
  missedChars,
}: {
  guesses: string[]
  revealedChars: Set<string>
  missedChars: Set<string>
}) {
  const rows = Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
    const word = guesses[rowIndex] ?? ''
    const cells = Array.from({ length: WORD_LENGTH }, (_, colIndex) => word[colIndex] ?? '')
    return { rowIndex, cells }
  })

  return (
    <div className="guess-history">
      {rows.map(({ rowIndex, cells }) => (
        <div key={rowIndex} className="guess-row">
          {cells.map((letter, colIndex) => (
            <span
              key={colIndex}
              className={`guess-tile ${tileColor(letter, revealedChars, missedChars)}`}
            >
              {letter}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
