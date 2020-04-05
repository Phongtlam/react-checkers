import { getMovesForPiece } from "./utils";
import { PLAYERS } from "./enums";

export const aiMove = board => {
	for (let i = 0; i < board.length; i++) {
		for (let j = 0; j < board[0].length; j++) {
			const move = getMovesForPiece(board, i, j, PLAYERS.P2);
			if (move.length) {
				return {
					from: [i, j],
					to: move[0]
				};
			}
		}
	}
};
