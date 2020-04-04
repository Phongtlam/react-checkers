import React from 'react';
import './App.css';
import Board from './Components/Board';
import { getNewBoard, getMovesForPiece } from './utils';
import { PLAYERS } from './enums';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastBoard: [],
      board: [],
      turn: PLAYERS.P1,
      highlightMoves: [],
    };
    this.onPieceSelected = this.onPieceSelected.bind(this);
  }

  componentDidMount() {
    this.initializeBoard();
  }

  initializeBoard() {
    this.setState({
      board: getNewBoard(),
      turn: PLAYERS.P1,
    });
  }

  onPieceSelected(coordinate) {
    const { board, turn } = this.state;
    const { x, y } = coordinate;
    this.setState({
      highlightMoves: getMovesForPiece(board, x, y),
    });
  }

  render() {
    const { board, turn, highlightMoves } = this.state;

    return (
      <Board
        board={board}
        turn={turn}
        onPieceSelected={this.onPieceSelected}
        highlightMoves={highlightMoves}
      />
    );
  }
}

export default App;
