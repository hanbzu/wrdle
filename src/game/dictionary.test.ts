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
