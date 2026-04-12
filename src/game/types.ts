/** All mutable state for one game session. */
export interface GameState {
  /** Index into the phrases array (0–4). */
  currentLevel: number
  /** Words submitted in the current attempt (max 5). */
  guesses: string[]
  /** Letters confirmed to appear somewhere in the phrase. */
  revealedChars: Set<string>
  /** Letters confirmed NOT to appear in the phrase. */
  missedChars: Set<string>
  /** Letters typed so far for the current word (max 5). */
  currentInput: string
}

/** All actions the reducer handles. */
export type GameAction =
  | { type: 'APPEND_LETTER'; letter: string }
  | { type: 'BACKSPACE' }
  | { type: 'SUBMIT_WORD' }
