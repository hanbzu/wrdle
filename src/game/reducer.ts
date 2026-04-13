import { phrases } from '../phrases'
import { validateWord } from './dictionary'
import type { GameAction, GameState } from './types'

/** Returns the initial state for a fresh game, optionally starting at a given level index. */
export function initialState(startLevel = 0): GameState {
  const clampedLevel = Math.max(0, Math.min(startLevel, phrases.length - 1))
  return {
    currentLevel: clampedLevel,
    guesses: [],
    revealedChars: new Set(),
    missedChars: new Set(),
    currentInput: '',
    gameStatus: 'playing',
    invalidSubmit: 0,
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

/**
 * Returns true when every letter in the phrase (ignoring spaces and punctuation)
 * has been revealed.
 */
export function checkWin(phrase: string, revealedChars: Set<string>): boolean {
  const phraseLetters = phrase.toUpperCase().replace(/[^A-ZÑ]/g, '').split('')
  return phraseLetters.every((letter) => revealedChars.has(letter))
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

      // Reject words not in the dictionary
      if (!validateWord(word)) {
        return { ...state, invalidSubmit: state.invalidSubmit + 1 }
      }

      const { revealed, missed } = computeReveal(word, phrase)

      const newRevealed = new Set([...state.revealedChars, ...revealed])
      const newMissed = new Set([...state.missedChars, ...missed])
      const newGuesses = [...state.guesses, word]
      const won = checkWin(phrase, newRevealed)

      if (won) {
        return {
          ...state,
          guesses: newGuesses,
          revealedChars: newRevealed,
          missedChars: newMissed,
          currentInput: '',
          gameStatus: 'won',
        }
      }

      // 5th guess without a win — reset the attempt
      if (newGuesses.length >= 5) {
        return {
          ...state,
          guesses: [],
          revealedChars: new Set(),
          missedChars: new Set(),
          currentInput: '',
          gameStatus: 'playing',
        }
      }

      return {
        ...state,
        guesses: newGuesses,
        revealedChars: newRevealed,
        missedChars: newMissed,
        currentInput: '',
      }
    }

    case 'WIN': {
      return { ...state, gameStatus: 'won' }
    }

    case 'RESET_ATTEMPT': {
      return {
        ...state,
        guesses: [],
        revealedChars: new Set(),
        missedChars: new Set(),
        currentInput: '',
        gameStatus: 'playing',
      }
    }

    case 'NEXT_LEVEL': {
      const nextLevel = (state.currentLevel + 1) % phrases.length
      return {
        ...state,
        currentLevel: nextLevel,
        guesses: [],
        revealedChars: new Set(),
        missedChars: new Set(),
        currentInput: '',
        gameStatus: 'playing',
      }
    }

    default:
      return state
  }
}
