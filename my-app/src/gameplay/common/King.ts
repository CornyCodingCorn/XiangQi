import { BoardConst } from "../components/BoardBase";
import { generateMoveFunc, Piece } from "./Piece";
import { PieceType } from "./PieceMove";

export var generateMoveKing: generateMoveFunc = (board: string, x: number, y: number, isRed: boolean) => {

  return "";
}

export var generateMoveRawKing: generateMoveFunc = (board: string, x: number, y: number, isRed: boolean) => {
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

export function isKingChecked(board: string, isRed: boolean): boolean {
  let redX, redY = 0;
  let blackX, blackY = 0;
  let result = false;

  for (let i = 0; i < board.length; i++) {
    if (board[i].toLowerCase() === PieceType.King) {
      let x = i % BoardConst.BOARD_COL;
      let y = Math.floor(i / BoardConst.BOARD_ROW);

      if (board[i].toLowerCase() === board[i]) {
        blackX = x; 
        blackY = y; 
      }
      else {
        redX = x;
        redY = y;
      }
    }
  }

  if (isRed) {
    
  }
  else {

  }

  return result;
}