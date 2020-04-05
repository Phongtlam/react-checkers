import React from 'react';
import './App.css';
import Board from './Components/Board';
import { getNewBoard, getMovesForPiece, replacePiece } from './utils';
import { PLAYERS } from './enums';
import Button from './Components/Button';
import { aiMove } from "./ai";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [],
      turn: PLAYERS.P1,
      highlightMoves: [],
      currentlySelected: [],
      lastGameStates: [],
      isAi: false
    };
    this.onPieceSelected = this.onPieceSelected.bind(this);
    this.onPieceDrop = this.onPieceDrop.bind(this);
    this.revertLastMove = this.revertLastMove.bind(this);
    this.initializeBoard = this.initializeBoard.bind(this);
    this.toggleAi = this.toggleAi.bind(this);
  }

  componentDidMount() {
    const lsGame = localStorage.getItem('react-checker');
    if (lsGame) {
      this.setState(JSON.parse(lsGame));
    } else {
      this.initializeBoard();
    }
    // document.addEventListener("unload", this.saveToLocalStorage);
  }

  // componentWillUnmount() {
  //   document.removeEventListener("unload", this.saveToLocalStorage);
  // }

  static saveToLocalStorage(state) {
    localStorage.setItem('react-checker', JSON.stringify(state));
  }

  initializeBoard() {
    this.setState({
      board: getNewBoard(),
      turn: PLAYERS.P1,
      highlightMoves: [],
      currentlySelected: [],
      lastGameStates: []
    }, () => {
      localStorage.removeItem('react-checker');
    });
  }

  revertLastMove() {
    if (!this.state.lastGameStates.length) return;
    let pop = this.state.lastGameStates.pop();
    this.setState({
      ...pop
    }, () => {
      localStorage.setItem('react-checker', JSON.stringify(pop));
    })
  }

  onPieceSelected(coordinate) {
    const { board, turn } = this.state;
    const { x, y } = coordinate;
    this.setState({
      highlightMoves: getMovesForPiece(board, x, y, turn),
      currentlySelected: [x, y],
    });
  }

  onPieceDrop(to, from) {
    const { highlightMoves, board, turn, currentlySelected } = this.state;
    if (!from) {
      from = currentlySelected
    }
    const { x, y } = to;
    if (x === from[0] && y === from[1]) return;
    for (let i = 0; i < highlightMoves.length; i++) {
      let move = highlightMoves[i];
      if (move[0] === x && move[1] === y) {
        let newBoard = [...board];
        replacePiece(newBoard, x, y, board[from[0]][from[1]]);
        replacePiece(newBoard, from[0], from[1], '.');
        // handle jump over
        if (Math.abs(x - from[0]) > 1) {
          let xOffset = x - from[0] > 0 ? -1 : 1;
          let yOffset = y < from[1] ? 1 : -1;
          replacePiece(newBoard, x + xOffset, y + yOffset, '.');
        }
        // king check
        if (x === 0 && turn === PLAYERS.P1) replacePiece(newBoard, x, y, PLAYERS.K1);
        if (x === 7 && turn === PLAYERS.P2) replacePiece(newBoard, x, y, PLAYERS.K2);

        this.setState((prevState) => {
          const newState = {
            board: newBoard,
            turn: prevState.turn === PLAYERS.P1 ? PLAYERS.P2 : PLAYERS.P1,
            highlightMoves: [],
            currentlySelected: []
          };
          App.saveToLocalStorage(newState);
          newState.lastGameStates = prevState.lastGameStates.concat(prevState);
          return newState;
        }, () => {
          this.runAI();
        });
        break;
      }
    }
  }

  runAI() {
    const { board, isAi } = this.state;
    if (isAi && this.state.turn === PLAYERS.P2) {
      const aiAction = aiMove(board);
      if (aiAction) {
        this.setState({
          highlightMoves: [aiAction.to],
          currentlySelected: aiAction.from
        }, () => {
          this.onPieceDrop({ x: aiAction.to[0], y: aiAction.to[1] }, aiAction.from);
        });
      }
    }
  }

  toggleAi() {
    this.setState({
      isAi: !this.state.isAi
    })
  }

  render() {
    const { board, turn, highlightMoves, isAi } = this.state;

    return (
      <div className="game-container">
        <Board
          board={board}
          turn={turn}
          onPieceSelected={this.onPieceSelected}
          highlightMoves={highlightMoves}
          onPieceDrop={this.onPieceDrop}
        />
        <div className="game-footer">
          <div>
            <p>Current Player Turn: {turn === PLAYERS.P1 ? 'PLAYER ONE' : 'PLAYER TWO'}</p>
            <p>AI IS {isAi ? 'ON' : 'OFF'}</p>
          </div>
          <Button onClick={this.revertLastMove} text={`REVERT LAST MOVE`}/>
          <Button onClick={this.initializeBoard} text={`NEW GAME`}/>
          <Button onClick={this.toggleAi} text={`AI ${isAi ? 'ON' : 'OFF'}`} className={isAi ? 'ai-button-on' : 'ai-button-off'} />
        </div>
      </div>
    );
  }
}

export default App;
