import { generateMoveFunc, Piece } from "./Piece";

export var generateMoveRook: generateMoveFunc = (board: string, x: number, y: number, isRed: boolean) => {
  let result = "";
  result += Piece.generateGenericMove(board, x, y, isRed, -1, 0, true);
  result += Piece.generateGenericMove(board, x, y, isRed, 1, 0, true);
  result += Piece.generateGenericMove(board, x, y, isRed, 0, -1, true);
  result += Piece.generateGenericMove(board, x, y, isRed, 0, 1, true);

  return result;
}