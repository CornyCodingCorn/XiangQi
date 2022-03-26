import { generateMoveFunc, Piece, PieceType } from "./Piece";

export var generateMoveHorse: generateMoveFunc = (board: string, x: number, y: number, isRed: boolean) => {
  let result = "";
  if (isValid(board, x, y + 1)) {
    result += Piece.generatePos(board, x - 1, y + 2, isRed);
    result += Piece.generatePos(board, x + 1, y + 2, isRed);
  }

  if (isValid(board, x, y - 1)) {
    result += Piece.generatePos(board, x - 1, y - 2, isRed);
    result += Piece.generatePos(board, x + 1, y - 2, isRed);
  }

  if (isValid(board, x + 1, y)) {
    result += Piece.generatePos(board, x + 2, y - 1, isRed);
    result += Piece.generatePos(board, x + 2, y + 1, isRed);
  }

  if (isValid(board, x - 1, y)) {
    result += Piece.generatePos(board, x - 2, y - 1, isRed);
    result += Piece.generatePos(board, x - 2, y + 1, isRed);
  }

  return result;
}

function isValid(board: string, x: number, y: number) {
  let char = Piece.getPiece(board, x, y);
  return char === PieceType.Empty;
}