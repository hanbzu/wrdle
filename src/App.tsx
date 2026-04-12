import './App.css'
import { GuessHistory } from './components/GuessHistory'
import { Keyboard } from './components/Keyboard'
import { PhraseDisplay } from './components/PhraseDisplay'
import { WinOverlay } from './components/WinOverlay'
import { useGame } from './game/useGame'
import { phrases } from './phrases'

/** Root game screen: phrase display, guess history, word input, and keyboard. */
function App() {
  const { state, dispatch } = useGame()
  const phrase = phrases[state.currentLevel]

  return (
    <div className="game">
      <main className="game-main">
        <PhraseDisplay phrase={phrase} revealedChars={state.revealedChars} />
        <GuessHistory
          guesses={state.guesses}
          revealedChars={state.revealedChars}
          missedChars={state.missedChars}
          currentInput={state.currentInput}
          invalidSubmit={state.invalidSubmit}
        />
      </main>

      <footer className="game-footer">
        <Keyboard
          dispatch={dispatch}
          revealedChars={state.revealedChars}
          missedChars={state.missedChars}
        />
      </footer>

      {state.gameStatus === 'won' && (
        <WinOverlay phrase={phrase} currentLevel={state.currentLevel} dispatch={dispatch} />
      )}
    </div>
  )
}

export default App
