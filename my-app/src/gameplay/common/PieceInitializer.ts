import { generateMoveRawAdvisor } from "./Advisor";
import { generateMoveRawCanon } from "./Canon";
import { generateMoveRawElephant } from "./Elephant";
import { generateMoveRawHorse } from "./Horse";
import { generateMoveRawKing } from "./King";
import { generateMoveRawPawn } from "./Pawn";
import { moveMap, PieceType } from "./PieceMove";
import { generateMoveRawRook } from "./Rook";

export function initializePieces() {
  moveMap.set(PieceType.King, generateMoveRawKing);
  moveMap.set(PieceType.Advisor, generateMoveRawAdvisor);
  moveMap.set(PieceType.Elephant, generateMoveRawElephant);
  moveMap.set(PieceType.Horse, generateMoveRawHorse);
  moveMap.set(PieceType.Rook, generateMoveRawRook);
  moveMap.set(PieceType.Cannon, generateMoveRawCanon);
  moveMap.set(PieceType.Pawn, generateMoveRawPawn);
}