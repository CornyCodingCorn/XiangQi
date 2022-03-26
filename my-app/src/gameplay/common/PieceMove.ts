import { BoardConst } from "../components/BoardBase";
import { generateMoveRawAdvisor } from "./Advisor";
import { generateMoveRawCanon } from "./Canon";
import { generateMoveRawElephant } from "./Elephant";
import { generateMoveHorse, generateMoveRawHorse } from "./Horse";
import { generateMoveKing, generateMoveRawKing } from "./King";
import { generateMovePawn, generateMoveRawPawn } from "./Pawn";
import { generateMoveFunc } from "./Piece";
import { PieceType } from "./Piece";
import { generateMoveRawRook, generateMoveRook } from "./Rook";

export function generateMove(board: string, type: PieceType, x: number, y: number, isRed: boolean): string {
  let func: generateMoveFunc | null = null;

  switch (type) {
    case PieceType.King:
      func = generateMoveRawKing;
      break;
    case PieceType.Advisor:
      func = generateMoveRawAdvisor;
      break;
    case PieceType.Elephant:
      func = generateMoveRawElephant;
      break;
    case PieceType.Rook:
      func = generateMoveRawRook
      break;
    case PieceType.Cannon:
      func = generateMoveRawCanon;
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