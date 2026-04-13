import { useEffect, useReducer } from 'react'
import type { GameAction, GameState } from './types'
import { initialState, reducer } from './reducer'

/** Parses the `?level=N` query param (1-based) and returns a 0-based index, or 0 if absent/invalid. */
function levelFromUrl(): number {
  const param = new URLSearchParams(window.location.search).get('level')
  const n = parseInt(param ?? '', 10)
  return isNaN(n) ? 0 : n - 1
}

/** Wraps useReducer to expose game state and dispatch. Syncs `?level` query param with current level. */
export function useGame(): { state: GameState; dispatch: (action: GameAction) => void } {
  const [state, dispatch] = useReducer(reducer, undefined, () => initialState(levelFromUrl()))

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set('level', String(state.currentLevel + 1))
    const newUrl = `${window.location.pathname}?${params}`
    window.history.replaceState(null, '', newUrl)
  }, [state.currentLevel])

  return { state, dispatch }
}
