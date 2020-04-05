import React from 'react';
import './App.css';
import Board from './Components/Board';
import { getNewBoard, getMovesForPiece, replacePiece } from './utils';
import { PLAYERS } from './enums';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [],
      turn: PLAYERS.P1,
      highlightMoves: [],
      currentlySelected: [],
      lastGameStates: []
    };
    this.onPieceSelected = this.onPieceSelected.bind(this);
    this.onPieceDrop = this.onPieceDrop.bind(this);
    this.revertLastMove = this.revertLastMove.bind(this);
    this.initializeBoard = this.initializeBoard.bind(this);
  }

  componentDidMount() {
    this.initializeBoard();
  }

  initializeBoard() {
    this.setState({
      board: getNewBoard(),
      turn: PLAYERS.P1,
      highlightMoves: [],
      currentlySelected: [],
      lastGameStates: []
    });
  }

  revertLastMove() {
    if (!this.state.lastGameStates.length) return;
    let pop = this.state.lastGameStates.pop();
    this.setState({
      ...pop
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

  onPieceDrop(to) {
    const { highlightMoves, board, turn, currentlySelected } = this.state;
    const { x, y } = to;
    for (let i = 0; i < highlightMoves.length; i++) {
      let move = highlightMoves[i];
      if (move[0] === x && move[1] === y) {
        let newBoard = [...board];
        replacePiece(newBoard, x, y, board[currentlySelected[0]][currentlySelected[1]]);
        replacePiece(newBoard, currentlySelected[0], currentlySelected[1], '.');
        // handle jump over
        if (Math.abs(x - currentlySelected[0]) > 1) {
          let xOffSet = turn === PLAYERS.P1 ? 1 : -1;
          if (y < currentlySelected[1]) {
            replacePiece(newBoard, x + xOffSet, y + 1, '.');
          } else if (y > currentlySelected[1]) {
            replacePiece(newBoard, x + xOffSet, y - 1, '.');
          }
        }
        // king check
        if (x === 0 && turn === PLAYERS.P1) replacePiece(newBoard, x, y, PLAYERS.K1);
        if (x === 7 && turn === PLAYERS.P2) replacePiece(newBoard, x, y, PLAYERS.K2);

        this.setState((prevState) => ({
          lastGameStates: prevState.lastGameStates.concat(prevState),
          board: newBoard,
          turn: prevState.turn === PLAYERS.P1 ? PLAYERS.P2 : PLAYERS.P1,
          highlightMoves: [],
          currentlySelected: [],
        }));
        break;
      }
    }
  }

  render() {
    const { board, turn, highlightMoves } = this.state;

    return (
      <div>
        <Board
          board={board}
          turn={turn}
          onPieceSelected={this.onPieceSelected}
          highlightMoves={highlightMoves}
          onPieceDrop={this.onPieceDrop}
        />
        <button onClick={this.revertLastMove}>REVERT LAST MOVE</button>
        <button onClick={this.initializeBoard}>NEW GAME</button>
      </div>
    );
  }
}

export default App;
