# wrdle

A phrase-mode Wordle game. Instead of guessing a single word, players uncover a hidden Spanish phrase by submitting valid 5-letter words. Any letter from a guess that appears anywhere in the phrase gets revealed across all its positions.

## Features

- 5 hardcoded Spanish phrases played as sequential levels
- Dictionary accepts Spanish, Catalan, and Basque words (including plurals)
- On-screen QWERTY keyboard with green/gray letter feedback
- 5 guesses per attempt; unlimited retries until the phrase is solved

## Development

```bash
pnpm dev        # start dev server
pnpm test       # run tests (watch mode)
pnpm lint       # lint
pnpm build      # type-check + build
```
