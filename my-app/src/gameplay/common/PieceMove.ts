import { BoardConst } from "../components/BoardBase";
import { generateMoveHorse, generateMoveRawHorse } from "./Horse";
import { generateMoveKing, generateMoveRawKing } from "./King";
import { generateMovePawn, generateMoveRawPawn } from "./Pawn";
import { generateMoveFunc } from "./Piece";
import { PieceType } from "./Piece";

export function generateMove(board: string, type: PieceType, x: number, y: number, isRed: boolean): string {
  let func: generateMoveFunc | null = null;

  switch (type) {
    case PieceType.King:
      func = generateMoveRawKing;
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
      func = generateMoveRawHorse;
      break;
    case PieceType.Pawn:
      func = generateMoveRawPawn;
      break;
  }

  return (func ? func(board, x, y, isRed) : "");
}

export { PieceType } from "./Piece";