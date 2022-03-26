import { BoardConst } from "../components/BoardBase";
import { generateMoveFunc, Piece } from "./Piece";

export var generateMoveElephant: generateMoveFunc = (board: string, x: number, y: number, isRed: boolean) => {

  return "";
}

// Without checking complex king checkmate
export var generateMoveRawElephant: generateMoveFunc = (board: string, x: number, y: number, isRed: boolean) => {
  let result = "";

  if ((!isRed || y - 2 > 4)) result += Piece.generatePos(board, x - 2, y - 2, isRed);
  if ((!isRed || y - 2 > 4)) result += Piece.generatePos(board, x + 2, y - 2, isRed);
  if ((isRed  || y + 2 < 5)) result += Piece.generatePos(board, x - 2, y + 2, isRed);
  if ((isRed  || y + 2 < 5)) result += Piece.generatePos(board, x + 2, y + 2, isRed);

  return result;
}