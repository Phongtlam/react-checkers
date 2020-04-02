import React from 'react';
import "../Styles/Board.css";
import { getColor } from "../utils";

const Board = ({
  board,
  turn
}) => (
  <div>
    {board.map((row, i) => (
      <Row key={i} xCoord={i} row={row} turn={turn} />
    ))}
  </div>
);

const Row = ({
  xCoord,
  row,
  turn
}) => {
  return (
    <div className={`board-row board-row-${xCoord}`}>
      {row.map((piece, yCoord) => (
        <Square key={xCoord-yCoord} xCoord={xCoord} yCoord={yCoord} playerPiece={piece} turn={turn} />
      ))}
    </div>
  );
};

const Square = ({
  xCoord,
  yCoord,
  playerPiece
}) => (
  <div className={`board-square board-square-${getColor(xCoord, yCoord)}`}>
    <div className={`board-square-player-piece board-square-${playerPiece}`} draggable onDragStart={log} />
  </div>
);

const log = () => console.log("HAHAHAHHAA")

export default Board;