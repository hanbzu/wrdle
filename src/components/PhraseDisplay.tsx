/** Renders the hidden phrase as a row of tiles — blanks for unrevealed letters, visible for spaces. */
export function PhraseDisplay({
  phrase,
  revealedChars,
}: {
  phrase: string
  revealedChars: Set<string>
}) {
  return (
    <div className="phrase-display">
      {phrase.split('').map((char, i) => {
        if (char === ' ') {
          return <span key={i} className="phrase-space" />
        }
        const revealed = revealedChars.has(char.toUpperCase())
        return (
          <span key={i} className={`phrase-tile ${revealed ? 'revealed' : 'hidden'}`}>
            {revealed ? char : ''}
          </span>
        )
      })}
    </div>
  )
}
