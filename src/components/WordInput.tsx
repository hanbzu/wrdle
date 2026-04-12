const WORD_LENGTH = 5

/**
 * Renders the 5 tiles for the word currently being typed.
 * When `invalid` is true the row shakes to indicate a rejected word.
 */
export function WordInput({ input, invalid }: { input: string; invalid: boolean }) {
  const cells = Array.from({ length: WORD_LENGTH }, (_, i) => input[i] ?? '')

  return (
    <div className={`word-input${invalid ? ' shake' : ''}`}>
      {cells.map((letter, i) => (
        <span key={i} className={`word-input-tile ${letter ? 'filled' : 'empty'}`}>
          {letter}
        </span>
      ))}
    </div>
  )
}
