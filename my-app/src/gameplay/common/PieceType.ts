import { generateMoveKing } from "./King";
import { generateMoveFunc } from "./Piece";

export enum PieceType {
	King = "k",
	Advisor = "a",
	Elephant = "e",
	Rook = "r",
	Cannon = "c",
	Horse = "h",
	Pawn = "p",
	Empty = "0"
}

export function generateMove(board: string, type: PieceType, x: number, y: number, isRed: boolean): string {
  let func: generateMoveFunc | null = null;

  switch (type) {
    case PieceType.King:
      func = generateMoveKing;
      break;
    case PieceType.Advisor:
      
      break;
    case PieceType.Elephant:

      break;
    case PieceType.Rook:

      break;
    case PieceType.Cannon:

      break;
    case PieceType.Horse:

      break;
    case PieceType.Pawn:

      break;
  }

  return (func ? func(board, x, y, isRed) : "");
}