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

export const getMovesForPiece = (board, i, j, turn) => {
  if (checkPlayer(board[i][j]) !== PLAYERS.P1 && checkPlayer(board[i][j]) !== PLAYERS.P2) return [];
  if (checkPlayer(board[i][j]) !== turn) return [];
  let nextMoves = [];
  let rowToMove = checkPlayer(board[i][j]) === PLAYERS.P1 ? i - 1 : i + 1;
  let currOpp = checkPlayer(board[i][j]) === PLAYERS.P1 ? PLAYERS.P2 : PLAYERS.P1;
  let rowToAttackOffset = checkPlayer(board[i][j]) === PLAYERS.P1 ? -1 : 1;
  if (board[i][j] === PLAYERS.K1 || board[i][j] === PLAYERS.K2) {
    return getKingMoves(board, [i, j]);
  }
  if (
    !board[rowToMove] ||
    i < 0 ||
    j < 0 ||
    i > board.length - 1 ||
    j > board[0].length - 1
  )
    return [];

  function normalMove() {
    if (board[rowToMove][j - 1] === '.') nextMoves.push([rowToMove, j - 1]);
    if (board[rowToMove][j + 1] === '.') nextMoves.push([rowToMove, j + 1]);
  }

  // can attack opponent piece
  if (
    board[rowToMove][j - 1] === currOpp ||
    board[rowToMove][j + 1] === currOpp
  ) {
    if (
      board[rowToMove][j - 1] === currOpp &&
      board[rowToMove + rowToAttackOffset] &&
      board[rowToMove + rowToAttackOffset][j - 2] === '.'
    ) {
      nextMoves.push([rowToMove + rowToAttackOffset, j - 2]);
    }
    if (
      board[rowToMove][j + 1] === currOpp &&
      board[rowToMove + rowToAttackOffset] &&
      board[rowToMove + rowToAttackOffset][j + 2] === '.'
    ) {
      nextMoves.push([rowToMove + rowToAttackOffset, j + 2]);
    }

    if (
      !board[rowToMove + rowToAttackOffset] ||
      (board[rowToMove + rowToAttackOffset] &&
        !nextMoves.length &&
        (board[rowToMove + rowToAttackOffset][j - 2] !== '.' ||
          board[rowToMove + rowToAttackOffset][j + 2] !== '.'))
    ) {
      normalMove();
    }
  } else {
    normalMove();
  }

  return nextMoves;
};

export const getKingMoves = (board, pieceCoordinate) => {
  const [x, y] = pieceCoordinate;
  let res = [];

  function fillMoves(rowIdx, lower = false) {
    let row = board[rowIdx];
    for (let j = 0; j < row.length; j++) {
      if (Math.abs(x - rowIdx) === Math.abs(y - j)) {
        if (limit.left && limit.right) break;
        if (row[j] === ".") {
          if (limit.left && j - y < 0) continue;
          if (limit.right && j - y > 0) continue;
          res.push([rowIdx, j]);
        } else {
          if (!limit.left && j - y < 0) {
            limit.left = true;
            if (checkPlayer(row[j]) !== checkPlayer(board[x][y])) {
              if (lower && board[rowIdx - 1] && board[rowIdx - 1][j - 1] === ".") {
                res.push([rowIdx - 1, j - 1]);
              }
              if (!lower && board[rowIdx + 1] && board[rowIdx + 1][j - 1] === ".") {
                res.push([rowIdx + 1, j - 1]);
              }
            }
          }
          if (!limit.right && j - y > 0) {
            limit.right = true;
            if (checkPlayer(row[j]) !== checkPlayer(board[x][y])) {
              if (lower && board[rowIdx - 1] && board[rowIdx - 1][j + 1] === ".") {
                res.push([rowIdx - 1, j + 1]);
              }
              if (!lower && board[rowIdx + 1] && board[rowIdx + 1][j + 1] === ".") {
                res.push([rowIdx + 1, j + 1]);
              }
            }
          }
        }
      }
    }
    console.log(limit)
  }

  let limit = {};
  for (let i = x + 1; i < board.length; i++) {
    fillMoves(i, false);
  }

  limit = {};
  for (let i = x - 1; i >= 0; i--) {
    fillMoves(i, true);
  }

  console.log('res return', res)
  return res;
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

export const getRowsWithHighlights = (highlightMoves = []) => {
  if (!highlightMoves.length) return {};
  const rowWithHighlights = {};
  for (let i = 0; i < highlightMoves.length; i++) {
    let t = highlightMoves[i];
    rowWithHighlights[t[0]] = rowWithHighlights[t[0]] || [];
    rowWithHighlights[t[0]].push(t[1]);
  }
  return rowWithHighlights;
};

export const checkPlayer = (playerPiece) => {
  if (playerPiece === ".") return;
  let num;
  if (typeof playerPiece === 'string') {
    num = Number(playerPiece);
  } else {
    num = playerPiece;
  }
  return num % 2 === 0 ? PLAYERS.P2 : PLAYERS.P1;
};
