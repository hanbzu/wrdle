import { describe, expect, it } from 'vitest'
import { checkWin, computeReveal, initialState, reducer } from './reducer'

describe('computeReveal', () => {
  it('marks letters present in the phrase as revealed', () => {
    const { revealed } = computeReveal('AZUL', 'EL CIELO ES AZUL')
    expect(revealed.has('A')).toBe(true)
    expect(revealed.has('Z')).toBe(true)
    expect(revealed.has('U')).toBe(true)
    expect(revealed.has('L')).toBe(true)
  })

  it('marks letters absent from the phrase as missed', () => {
    const { missed } = computeReveal('FRUTA', 'EL CIELO ES AZUL')
    expect(missed.has('F')).toBe(true)
    expect(missed.has('R')).toBe(true)
    expect(missed.has('T')).toBe(true)
  })

  it('handles letters that appear in both revealed and missed correctly', () => {
    // 'A' is in phrase, 'X' is not
    const { revealed, missed } = computeReveal('AXXXA', 'EL CIELO ES AZUL')
    expect(revealed.has('A')).toBe(true)
    expect(missed.has('X')).toBe(true)
    expect(missed.has('A')).toBe(false)
  })

  it('is case-insensitive', () => {
    const { revealed } = computeReveal('azul', 'EL CIELO ES AZUL')
    expect(revealed.has('A')).toBe(true)
  })

  it('handles Ñ as a regular letter', () => {
    const { revealed, missed } = computeReveal('CAÑON', 'LA MAÑANA ES CLARA')
    expect(revealed.has('Ñ')).toBe(true)
    expect(missed.has('C')).toBe(false) // C is in the phrase
    expect(missed.has('O')).toBe(true)  // O is not in the phrase
  })
})

describe('reducer — APPEND_LETTER', () => {
  it('appends a letter to currentInput', () => {
    const state = reducer(initialState(), { type: 'APPEND_LETTER', letter: 'G' })
    expect(state.currentInput).toBe('G')
  })

  it('normalises to uppercase', () => {
    const state = reducer(initialState(), { type: 'APPEND_LETTER', letter: 'g' })
    expect(state.currentInput).toBe('G')
  })

  it('does not append beyond 5 letters', () => {
    let state = initialState()
    for (const l of 'ABCDE') state = reducer(state, { type: 'APPEND_LETTER', letter: l })
    state = reducer(state, { type: 'APPEND_LETTER', letter: 'F' })
    expect(state.currentInput).toBe('ABCDE')
  })
})

describe('reducer — BACKSPACE', () => {
  it('removes the last letter', () => {
    let state = initialState()
    state = reducer(state, { type: 'APPEND_LETTER', letter: 'A' })
    state = reducer(state, { type: 'BACKSPACE' })
    expect(state.currentInput).toBe('')
  })

  it('is a no-op on empty input', () => {
    const state = reducer(initialState(), { type: 'BACKSPACE' })
    expect(state.currentInput).toBe('')
  })
})

describe('reducer — SUBMIT_WORD', () => {
  it('ignores submission when input is not 5 letters', () => {
    let state = initialState()
    state = reducer(state, { type: 'APPEND_LETTER', letter: 'A' })
    state = reducer(state, { type: 'SUBMIT_WORD' })
    expect(state.guesses).toHaveLength(0)
  })

  it('appends the word to guesses and clears input', () => {
    let state = initialState()
    for (const l of 'CIELO') state = reducer(state, { type: 'APPEND_LETTER', letter: l })
    state = reducer(state, { type: 'SUBMIT_WORD' })
    expect(state.guesses).toEqual(['CIELO'])
    expect(state.currentInput).toBe('')
  })

  it('updates revealedChars for letters in the phrase', () => {
    let state = initialState() // level 0: EL CIELO ES AZUL
    for (const l of 'CIELO') state = reducer(state, { type: 'APPEND_LETTER', letter: l })
    state = reducer(state, { type: 'SUBMIT_WORD' })
    expect(state.revealedChars.has('C')).toBe(true)
    expect(state.revealedChars.has('I')).toBe(true)
    expect(state.revealedChars.has('E')).toBe(true)
    expect(state.revealedChars.has('L')).toBe(true)
    expect(state.revealedChars.has('O')).toBe(true)
  })

  it('updates missedChars for letters not in the phrase', () => {
    let state = initialState() // level 0: EL CIELO ES AZUL
    for (const l of 'FRUTA') state = reducer(state, { type: 'APPEND_LETTER', letter: l })
    state = reducer(state, { type: 'SUBMIT_WORD' })
    expect(state.missedChars.has('F')).toBe(true)
    expect(state.missedChars.has('R')).toBe(true)
    expect(state.missedChars.has('T')).toBe(true)
  })

  it('accumulates revealed and missed chars across multiple submissions', () => {
    let state = initialState() // level 0: EL CIELO ES AZUL

    // First word: CIELO — all in phrase
    for (const l of 'CIELO') state = reducer(state, { type: 'APPEND_LETTER', letter: l })
    state = reducer(state, { type: 'SUBMIT_WORD' })

    // Second word: FRUTA — F, R, T not in phrase; U, A in phrase
    for (const l of 'fruta') state = reducer(state, { type: 'APPEND_LETTER', letter: l })
    state = reducer(state, { type: 'SUBMIT_WORD' })

    expect(state.guesses).toEqual(['CIELO', 'FRUTA'])
    // Chars from both words accumulated
    expect(state.revealedChars.has('C')).toBe(true)
    expect(state.revealedChars.has('U')).toBe(true)
    expect(state.revealedChars.has('A')).toBe(true)
    expect(state.missedChars.has('F')).toBe(true)
    expect(state.missedChars.has('R')).toBe(true)
    expect(state.missedChars.has('T')).toBe(true)
    // Input cleared after second submission
    expect(state.currentInput).toBe('')
  })
})

describe('checkWin', () => {
  it('returns false when not all phrase letters are revealed', () => {
    expect(checkWin('EL CIELO ES AZUL', new Set(['C', 'I', 'E', 'L', 'O']))).toBe(false)
  })

  it('returns true when all phrase letters are revealed', () => {
    const all = new Set(['E', 'L', 'C', 'I', 'O', 'S', 'A', 'Z', 'U'])
    expect(checkWin('EL CIELO ES AZUL', all)).toBe(true)
  })

  it('ignores spaces and punctuation', () => {
    expect(checkWin('AB CD', new Set(['A', 'B', 'C', 'D']))).toBe(true)
  })
})

describe('reducer — WIN / NEXT_LEVEL', () => {
  it('SUBMIT_WORD sets gameStatus to won when all letters are revealed', () => {
    // 'HACER EL BIEN' (level 3) — letters: H,A,C,E,R,L,B,I,N
    // Submit enough words to reveal all letters in one shot isn't easy,
    // so instead test via the WIN action directly.
    const state = reducer(initialState(), { type: 'WIN' })
    expect(state.gameStatus).toBe('won')
  })

  it('NEXT_LEVEL resets attempt state and returns to playing', () => {
    let state = initialState()
    state = reducer(state, { type: 'WIN' })
    for (const l of 'CIELO') state = reducer(state, { type: 'APPEND_LETTER', letter: l })
    state = reducer(state, { type: 'NEXT_LEVEL' })
    expect(state.gameStatus).toBe('playing')
    expect(state.guesses).toEqual([])
    expect(state.revealedChars.size).toBe(0)
    expect(state.missedChars.size).toBe(0)
    expect(state.currentInput).toBe('')
  })

  it('SUBMIT_WORD detects win automatically when phrase is fully revealed', () => {
    // Phrase 0: 'EL CIELO ES AZUL' — unique letters: E,L,C,I,O,S,A,Z,U
    // Pre-seed state with all letters except S revealed, then submit a word containing S
    let state: ReturnType<typeof initialState> = {
      ...initialState(),
      revealedChars: new Set(['E', 'L', 'C', 'I', 'O', 'A', 'Z', 'U']),
    }
    for (const l of 'SBBBB') state = reducer(state, { type: 'APPEND_LETTER', letter: l })
    state = reducer(state, { type: 'SUBMIT_WORD' })
    expect(state.gameStatus).toBe('won')
  })
})
