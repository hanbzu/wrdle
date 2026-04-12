import caTxt from '../dictionary/ca.txt?raw'
import euTxt from '../dictionary/eu.txt?raw'
import esTxt from '../dictionary/es.txt?raw'

/** Parses a raw word-list text into a Set of uppercase 5-letter words. */
function parseWordList(raw: string): Set<string> {
  const words = new Set<string>()
  for (const line of raw.split('\n')) {
    const word = line.trim().toUpperCase()
    if (word.length === 5) words.add(word)
  }
  return words
}

/** Merged dictionary of all valid words (Spanish + Catalan + Basque), loaded at module init. */
export const dictionary: Set<string> = new Set([
  ...parseWordList(esTxt),
  ...parseWordList(caTxt),
  ...parseWordList(euTxt),
])

/** Returns true if the word is valid: exactly 5 letters and present in the dictionary. */
export function validateWord(word: string): boolean {
  return word.length === 5 && dictionary.has(word.toUpperCase())
}
