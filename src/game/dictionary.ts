import caTxt from '../dictionary/ca.txt?raw'
import euTxt from '../dictionary/eu.txt?raw'
import esTxt from '../dictionary/es.txt?raw'

const VOWELS = new Set('AEIOUÁÉÍÓÚÀÈÌÒÙÜ')

/** Derives the plural form of a word using Spanish/Catalan rules. */
function romanPlural(word: string): string {
  const last = word[word.length - 1]
  if (last === 'Z') return word.slice(0, -1) + 'CES'
  if (VOWELS.has(last)) return word + 'S'
  return word + 'ES'
}

/** Derives the absolutive definite plural of a Basque noun in definite form (ending in -a)
 * by appending 'K': zura → ZURAK, ohea → OHEAK. */
function basquePlural(word: string): string {
  return word + 'K'
}

/** Parses a raw word-list into a Set of uppercase 5-letter words.
 * When a `pluralize` function is provided, shorter base words are also passed
 * through it and the result is added if it is exactly 5 letters. */
function parseWordList(raw: string, pluralize?: (w: string) => string): Set<string> {
  const words = new Set<string>()
  for (const line of raw.split('\n')) {
    const word = line.trim().toUpperCase()
    if (!word || word.startsWith('#')) continue
    if (word.length === 5) {
      words.add(word)
    } else if (pluralize) {
      const plural = pluralize(word)
      if (plural.length === 5) words.add(plural)
    }
  }
  return words
}

/** Merged dictionary of all valid words (Spanish + Catalan + Basque), loaded at module init. */
export const dictionary: Set<string> = new Set([
  ...parseWordList(esTxt, romanPlural),
  ...parseWordList(caTxt, romanPlural),
  ...parseWordList(euTxt, basquePlural),
])

/** Returns true if the word is valid: exactly 5 letters and present in the dictionary. */
export function validateWord(word: string): boolean {
  return word.length === 5 && dictionary.has(word.toUpperCase())
}
