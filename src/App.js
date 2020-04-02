import React from 'react';
import './App.css';
import Board from './Components/Board';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastBoard: [],
      board: [],
      turn: "P1"
    };
  }

  componentDidMount() {
    this.initializeBoard();
  }

  initializeBoard() {
    const board = [];
    for (let i = 0; i < 8; i++) {
      board[i] = [];
      for (let j = 0; j < 8; j++) {
        board[i][j] = "_";
        if (i % 2 !== j % 2) {
          if (i < 3) board[i][j] = "P2";
          if (i > 4) board[i][j] = "P1";
        }
      }
    }
    this.setState({
      board,
      turn: "P1"
    });
  }

  updateBoard(newBoard) {
    const {
      board,
      turn
    } = this.state;
    let newTurn = turn === "P1" ? "P2" : "P1";
    this.setState({
      lastBoard: board,
      board: newBoard,
      turn: newTurn
    })
  }

  getNextBoard(selectedPiece) {

  };

  render() {
    const {
      board,
      turn
    } = this.state;

    return (
      <Board board={board} turn={turn} />
    )
  }
}

export default App;
