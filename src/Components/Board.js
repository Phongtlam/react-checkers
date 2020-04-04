import React from 'react';
import '../Styles/Board.css';
import { classNames, getColor } from '../utils';

const Board = ({ board, turn, onPieceSelected, highlightMoves }) => (
  <div>
    {board.map((row, i) => (
      <Row
        key={i}
        xCoord={i}
        row={row}
        turn={turn}
        highlightMoves={highlightMoves}
        onPieceSelected={onPieceSelected}
      />
    ))}
  </div>
);

const Row = ({ xCoord, row, turn, onPieceSelected }) => {
  const squares = [];
  for (let i = 0; i < row.length; i++) {
    squares.push(
      <Square
        key={`${xCoord}-${i}`}
        xCoord={xCoord}
        yCoord={i}
        playerPiece={row[i]}
        turn={turn}
        onPieceSelected={onPieceSelected}
      />
    );
  }
  return <div className={`board-row board-row-${xCoord}`}>{squares}</div>;
};

const Square = ({ xCoord, yCoord, playerPiece, onPieceSelected }) => {
  const isDraggable = playerPiece !== '.';
  function onDragStart() {
    onPieceSelected({ x: xCoord, y: yCoord });
  }
  return (
    <div
      className={classNames(
        'board-square',
        `board-square-${getColor(xCoord, yCoord)}`,
        {
          'board-square-highlight': true,
        }
      )}
    >
      <div
        className={`board-square-player-piece board-square-${playerPiece}`}
        draggable={isDraggable}
        onDragStart={onDragStart}
      />
    </div>
  );
};

export default Board;
