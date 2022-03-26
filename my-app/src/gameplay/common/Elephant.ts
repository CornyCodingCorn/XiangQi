import { generateMoveFunc, Piece, PieceType } from "./Piece";

// Without checking complex king checkmate
export var generateMoveElephant: generateMoveFunc = (board: string, x: number, y: number, isRed: boolean) => {
  let result = "";

  if ((!isRed || y - 2 > 4) && Piece.getPiece(board, x - 1, y - 1) == PieceType.Empty) result += Piece.generatePos(board, x - 2, y - 2, isRed);
  if ((!isRed || y - 2 > 4) && Piece.getPiece(board, x + 1, y - 1) == PieceType.Empty) result += Piece.generatePos(board, x + 2, y - 2, isRed);
  if ((isRed  || y + 2 < 5) && Piece.getPiece(board, x - 1, y + 1) == PieceType.Empty) result += Piece.generatePos(board, x - 2, y + 2, isRed);
  if ((isRed  || y + 2 < 5) && Piece.getPiece(board, x + 1, y + 1) == PieceType.Empty) result += Piece.generatePos(board, x + 2, y + 2, isRed);
  return result;
}