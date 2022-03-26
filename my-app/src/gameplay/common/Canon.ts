import { generateMoveFunc, Piece, PieceType } from "./Piece";

export var generateMoveCanon: generateMoveFunc = (board: string, x: number, y: number, isRed: boolean) => {

  return "";
}

export var generateMoveRawCanon: generateMoveFunc = (board: string, x: number, y: number, isRed: boolean) => {
  let result = "";
  result += _generateInDirection(board, x, y, isRed, -1,  0);
  result += _generateInDirection(board, x, y, isRed, +1,  0);
  result += _generateInDirection(board, x, y, isRed,  0, -1);
  result += _generateInDirection(board, x, y, isRed,  0, +1);

  return result;
}

function _generateInDirection(board: string, x: number, y: number, isRed: boolean, deltaX: number, deltaY: number): string {
  let result = "";
  result += Piece.generateGenericMove(board, x, y, isRed, deltaX, deltaY, false);

  let arr = result.substring(0, result.length - 1).split("/");
  let last = arr[arr.length - 1];

  if (last && last !== "") {
    x = Number.parseInt(last[0]);
    y = Number.parseInt(last[1]);
  }
  x += deltaX;
  y += deltaY;
  
  if (Piece.isPosValid(x, y)) {
    // If the next pos is valid that mean it was stopped by another piece.
    let jump = Piece.generateGenericMove(board, x, y, isRed, deltaX, deltaY, true);
    arr = jump.substring(0, jump.length - 1).split("/");
    last = arr[arr.length - 1];

    // If the last piece of the returned result is a
    // piece then add the last one to the result of this function.
    if (last[2] && last[2] !== PieceType.Empty) {
      result += `${last}/`;
    }
  }

  return result;
}