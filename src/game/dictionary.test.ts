import { describe, expect, it } from 'vitest'
import { dictionary, validateWord } from './dictionary'

describe('dictionary', () => {
  it('contains Spanish words from es.txt', () => {
    expect(dictionary.has('CIELO')).toBe(true)
    expect(dictionary.has('HACER')).toBe(true)
    expect(dictionary.has('FRUTA')).toBe(true)
  })

  it('contains Catalan words from ca.txt', () => {
    expect(dictionary.has('TAULA')).toBe(true)
    expect(dictionary.has('TEMPS')).toBe(true)
  })

  it('contains Basque words from eu.txt', () => {
    expect(dictionary.has('HANDI')).toBe(true)
    expect(dictionary.has('BERDE')).toBe(true)
    expect(dictionary.has('ALABA')).toBe(true) // from talaios word list
    expect(dictionary.has('HAIZE')).toBe(true)
  })

  it('only contains 5-letter words', () => {
    for (const word of dictionary) {
      expect(word.length).toBe(5)
    }
  })

  it('stores words in uppercase', () => {
    for (const word of dictionary) {
      expect(word).toBe(word.toUpperCase())
    }
  })
})

describe('validateWord', () => {
  it('accepts a known Spanish word', () => {
    expect(validateWord('cielo')).toBe(true)
    expect(validateWord('CIELO')).toBe(true)
  })

  it('rejects a word not in the dictionary', () => {
    expect(validateWord('XZQWP')).toBe(false)
  })

  it('rejects words shorter than 5 letters', () => {
    expect(validateWord('HOLA')).toBe(false)
  })

  it('rejects words longer than 5 letters', () => {
    expect(validateWord('CASITA')).toBe(false)
  })
})

describe('plural generation', () => {
  it('includes Spanish plurals from vowel-ending base words (4-letter → +s)', () => {
    expect(dictionary.has('COSAS')).toBe(true) // cosa + s
    expect(dictionary.has('PASOS')).toBe(true) // paso + s
    expect(dictionary.has('BASES')).toBe(true) // base + s
  })

  it('includes Spanish plurals from consonant-ending base words (3-letter → +es)', () => {
    expect(dictionary.has('BARES')).toBe(true) // bar + es
    expect(dictionary.has('SOLES')).toBe(true) // sol + es
    expect(dictionary.has('PANES')).toBe(true) // pan + es
  })

  it('includes Spanish plurals from z-ending base words (3-letter → ces)', () => {
    expect(dictionary.has('LUCES')).toBe(true) // luz → luces
    expect(dictionary.has('VOCES')).toBe(true) // voz → voces
    expect(dictionary.has('VECES')).toBe(true) // vez → veces
    expect(dictionary.has('PECES')).toBe(true) // pez → peces
  })

  it('includes Catalan plurals derived from base words', () => {
    expect(dictionary.has('NOTAS')).toBe(true) // nota + s
    expect(dictionary.has('ZONAS')).toBe(true) // zona + s
  })

  it('includes Basque absolutive definite plurals (4-letter article form + k)', () => {
    expect(dictionary.has('ZURAK')).toBe(true) // zura + k
    expect(dictionary.has('OHEAK')).toBe(true) // ohea + k
    expect(dictionary.has('GAUAK')).toBe(true) // gaua + k
    expect(dictionary.has('AHOAK')).toBe(true) // ahoa + k
    expect(dictionary.has('OINAK')).toBe(true) // oina + k
  })
})
