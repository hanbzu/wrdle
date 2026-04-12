const WORD_LENGTH = 5

/** Renders the 5 tiles for the word currently being typed. */
export function WordInput({ input }: { input: string }) {
  const cells = Array.from({ length: WORD_LENGTH }, (_, i) => input[i] ?? '')

  return (
    <div className="word-input">
      {cells.map((letter, i) => (
        <span key={i} className={`word-input-tile ${letter ? 'filled' : 'empty'}`}>
          {letter}
        </span>
      ))}
    </div>
  )
}
