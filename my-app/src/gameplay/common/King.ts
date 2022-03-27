import { generateMoveFunc, Piece } from "./Piece";

export var generateMoveKing: generateMoveFunc = (board: string, x: number, y: number, isRed: boolean) => {
  let result = "";

  let checkX = x - 1;
  if (checkX > 2) {
    result += Piece.generatePos(board, checkX, y, isRed);
  }
  checkX = x + 1;
  if (checkX < 6) {
    result += Piece.generatePos(board, checkX, y, isRed);
  }

  let checkY = y + 1;
  if (isRed || checkY < 3) {
    result += Piece.generatePos(board, x, checkY, isRed);
  }
  checkY = y - 1;
  if (!isRed || checkY > 6) {
    result += Piece.generatePos(board, x, checkY, isRed);
  }

  return result;
}