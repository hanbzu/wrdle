import { useReducer } from 'react'
import type { GameAction, GameState } from './types'
import { initialState, reducer } from './reducer'

/** Wraps useReducer to expose game state and dispatch. */
export function useGame(): { state: GameState; dispatch: (action: GameAction) => void } {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  return { state, dispatch }
}
