import { PLAYERS } from '../enums';

export const getColor = (x, y) => {
  let color = 'black';
  if (x % 2 === y % 2) {
    color = 'white';
  }
  return color;
};

export const getNewBoard = () => {
  const board = [];
  for (let i = 0; i < 8; i++) {
    board[i] = '........';
    for (let j = 0; j < 8; j++) {
      if (i % 2 !== j % 2) {
        if (i < 3) {
          board[i] = board[i].substring(0, j) + '2' + board[i].substring(j + 1);
        }
        if (i > 4) {
          board[i] = board[i].substring(0, j) + '1' + board[i].substring(j + 1);
        }
      }
    }
  }
  return board;
};

// export const getP1Moves = board => {
//   let newBoard = [];
//   for (let i = board.length; i >= 0; i--) {
//     const currRow = board[i];
//     for (let j = 0; j < currRow.length; j++) {
//       if (currRow[j] === PLAYERS.P1) {
//         getMovesForPiece(board, i, j).forEach(move => {
//           replacePiece(board, i, j, PLAYERS.P2)
//         });
//       }
//     }
//   }
// };

export const getMovesForPiece = (board, i, j) => {
  if (board[i][j] !== PLAYERS.P1 && board[i][j] !== PLAYERS.P2) return;
  let nextMoves = [];
  let rowToMove = board[i][j] === PLAYERS.P1 ? i - 1 : i + 1;
  let currOpp = board[i][j] === PLAYERS.P1 ? PLAYERS.P2 : PLAYERS.P1;

  if (board[rowToMove]) {
    if (
      board[rowToMove][j - 1] === currOpp ||
      board[rowToMove][j + 1] === currOpp
    ) {
      if (
        board[rowToMove][j - 1] === currOpp &&
        board[rowToMove - 1] &&
        board[rowToMove - 1][j - 2]
      )
        nextMoves.push([rowToMove - 1, j - 2]);
      if (
        board[rowToMove][j + 1] === currOpp &&
        board[rowToMove - 1] &&
        board[rowToMove - 1][j + 2]
      )
        nextMoves.push([rowToMove - 1, j + 2]);
    } else {
      if (board[rowToMove][j - 1] === '.') nextMoves.push([rowToMove, j - 1]);
      if (board[rowToMove][j + 1] === '.') nextMoves.push([rowToMove, j + 1]);
    }
  }

  return nextMoves;
};

export const replacePiece = (board, i, j, newPiece) => {
  board[i] = board[i].substring(0, j) + newPiece + board[i].substr(j + 1);
};

export const classNames = (...args) => {
  let res = [];
  for (let i = 0; i < args.length; i++) {
    if (typeof args[i] === 'string') res.push(args[i]);
    if (typeof args[i] === 'object') {
      Object.keys(args[i]).forEach((key) => {
        if (args[i][key]) res.push(key);
      });
    }
  }
  return res.join(' ');
};

export const getRowsWithHighlights = (highlightMoves) => {
  const rowWithHighlights = {};
  for (let i = 0; i < highlightMoves.length; i++) {
    let t = highlightMoves[i];
    rowWithHighlights[t[0]] = rowWithHighlights[t[0]] || [];
    rowWithHighlights[t[0]].push(t[1]);
  }
  return rowWithHighlights;
};
