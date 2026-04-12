import { phrases } from '../phrases'
import type { GameAction, GameState } from './types'

/** Returns the initial state for a fresh game. */
export function initialState(): GameState {
  return {
    currentLevel: 0,
    guesses: [],
    revealedChars: new Set(),
    missedChars: new Set(),
    currentInput: '',
  }
}

/**
 * Splits the letters of a guessed word into revealed (in phrase) and missed
 * (not in phrase) sets. Comparison is case-insensitive; spaces and punctuation
 * in the phrase are ignored.
 */
export function computeReveal(
  word: string,
  phrase: string,
): { revealed: Set<string>; missed: Set<string> } {
  const phraseLetters = new Set(phrase.toUpperCase().replace(/[^A-ZÑ]/g, '').split(''))
  const revealed = new Set<string>()
  const missed = new Set<string>()

  for (const letter of word.toUpperCase()) {
    if (phraseLetters.has(letter)) {
      revealed.add(letter)
    } else {
      missed.add(letter)
    }
  }

  return { revealed, missed }
}

/** Pure reducer for all game actions. */
export function reducer(state: GameState, action: GameAction): GameState {
  const phrase = phrases[state.currentLevel]

  switch (action.type) {
    case 'APPEND_LETTER': {
      if (state.currentInput.length >= 5) return state
      return { ...state, currentInput: state.currentInput + action.letter.toUpperCase() }
    }

    case 'BACKSPACE': {
      if (state.currentInput.length === 0) return state
      return { ...state, currentInput: state.currentInput.slice(0, -1) }
    }

    case 'SUBMIT_WORD': {
      if (state.currentInput.length !== 5) return state

      const word = state.currentInput
      const { revealed, missed } = computeReveal(word, phrase)

      const newRevealed = new Set([...state.revealedChars, ...revealed])
      const newMissed = new Set([...state.missedChars, ...missed])

      return {
        ...state,
        guesses: [...state.guesses, word],
        revealedChars: newRevealed,
        missedChars: newMissed,
        currentInput: '',
      }
    }

    default:
      return state
  }
}
