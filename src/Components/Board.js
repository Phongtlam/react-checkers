import React from 'react';
import '../Styles/Board.css';
import {
  classNames,
  getColor,
  getRowsWithHighlights,
} from '../utils';
import { PLAYERS } from '../enums';

const Board = ({ board, highlightMoves, ...otherProps }) => {
  const rowsWithHighlights = getRowsWithHighlights(highlightMoves);
  return (
    <div className="board-container">
      {board.map((row, i) => (
        <Row
          key={i}
          xCoord={i}
          row={row}
          hasHighlightedSquares={rowsWithHighlights[i]}
          {...otherProps}
        />
      ))}
    </div>
  );
};

const Row = ({ xCoord, row, hasHighlightedSquares, ...otherProps }) => {
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
        isHighlighted={checkHighlight(i)}
        {...otherProps}
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
  onPieceDrop,
}) => {
  const isDraggable = playerPiece !== '.';
  function onDragStart() {
    onPieceSelected({ x: xCoord, y: yCoord });
  }

  function onDrop(ev) {
    ev.preventDefault();
    onPieceDrop({ x: xCoord, y: yCoord });
  }

  function onDragOver(ev) {
    ev.preventDefault();
  }

  return (
    <div
      className={classNames(
        'board-square',
        `board-square-${getColor(xCoord, yCoord)}`
      )}
    >
      <div
        className={classNames('board-square-player-piece', 'board-square-K1', {
          'board-square-highlight-1': isHighlighted && turn === PLAYERS.P1,
          'board-square-highlight-2': isHighlighted && turn === PLAYERS.P2,
          'board-square-1':
            playerPiece === PLAYERS.P1 || playerPiece === PLAYERS.K1,
          'board-square-2':
            playerPiece === PLAYERS.P2 || playerPiece === PLAYERS.K2,
        })}
        draggable={isDraggable}
        onDragStart={onDragStart}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onMouseOver={onDragStart}
      >
        {(playerPiece === PLAYERS.K1 || playerPiece === PLAYERS.K2) && (
          <span>KING</span>
        )}
      </div>
    </div>
  );
};

export default Board;
