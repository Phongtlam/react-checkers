import React from 'react';
import '../Styles/Board.css';
import { classNames, getColor, getRowsWithHighlights } from '../utils';
import { PLAYERS } from '../enums';

const Board = ({ board, turn, onPieceSelected, highlightMoves }) => {
  const rowsWithHighlights = getRowsWithHighlights(highlightMoves);
  return (
    <div>
      {board.map((row, i) => (
        <Row
          key={i}
          xCoord={i}
          row={row}
          turn={turn}
          highlightMoves={highlightMoves}
          onPieceSelected={onPieceSelected}
          hasHighlightedSquares={rowsWithHighlights[i]}
        />
      ))}
    </div>
  );
};

const Row = ({ xCoord, row, turn, onPieceSelected, hasHighlightedSquares }) => {
  const squares = [];
  function checkHighlight(index) {
    return !!(
      Array.isArray(hasHighlightedSquares) &&
      hasHighlightedSquares.indexOf(index) !== -1
    );
  }
  for (let i = 0; i < row.length; i++) {
    squares.push(
      <Square
        key={`${xCoord}-${i}`}
        xCoord={xCoord}
        yCoord={i}
        playerPiece={row[i]}
        turn={turn}
        onPieceSelected={onPieceSelected}
        isHighlighted={checkHighlight(i)}
      />
    );
  }
  return <div className={`board-row board-row-${xCoord}`}>{squares}</div>;
};

const Square = ({
  xCoord,
  yCoord,
  playerPiece,
  onPieceSelected,
  isHighlighted,
  turn,
}) => {
  const isDraggable = playerPiece !== '.';
  function onDragStart() {
    onPieceSelected({ x: xCoord, y: yCoord });
  }
  return (
    <div
      className={classNames(
        'board-square',
        `board-square-${getColor(xCoord, yCoord)}`
      )}
    >
      <div
        className={classNames('board-square-player-piece', {
          'board-square-highlight-1': isHighlighted && turn === PLAYERS.P1,
          'board-square-highlight-2': isHighlighted && turn === PLAYERS.P2,
          'board-square-1': playerPiece === PLAYERS.P1,
          'board-square-2': playerPiece === PLAYERS.P2,
        })}
        draggable={isDraggable}
        onDragStart={onDragStart}
      />
    </div>
  );
};

export default Board;
