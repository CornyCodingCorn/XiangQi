import { BoardConst } from "../components/BoardBase";
import { Board, BoardInfo } from "./Board";
import { generateMoveFunc, Piece } from "./Piece";
import { generateMove, PieceType } from "./PieceMove";
import { StringUtils } from "../../utils/StringUtils";

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

/**
 * If return something other than "" then the king is checked
 * @param board The board object created from the normal board but remove all the red;
 * @param isRed 
 * @param fillPiece This piece fill get filled in if defined, the board will get changed then restored to normal
 * @returns 
 */
export function isKingChecked(board: BoardInfo, isRed: boolean, fillPiece?: string): boolean {
  /*
    - Check the king in vertical line.
    - Check the other horses, canons, pawns, rooks
    - Advisors and elephant can't attack the king anyway.
  */

  // Enemies
  let boardStr = board.getBoard();
  let fillX = -1;
  let fillY = -1;
  if (fillPiece) {
    // If asked to fill in then it will fill in the boardStr.
    fillX = Number.parseInt(fillPiece[0]);
    fillY = Number.parseInt(fillPiece[1]);

    boardStr = StringUtils.replaceCharAt(boardStr, fillPiece[3], fillX + fillY * BoardConst.BOARD_COL);
  }

  let king  : Piece   = isRed ? board.blackKing : board.redKing;
  let enemies: Piece[] = [...board.horses, ...board.rooks, ...board.pawns, ...board.canons];

  // Our king : ^)
  let ourKing : Piece = !isRed ? board.blackKing : board.redKing;

  // Check if the king is seeing each other :))
  if (ourKing.location.x == king.location.x) {
    let startIdx = Math.min(ourKing.location.y, king.location.y) + 1;
    let endIdx = Math.max(ourKing.location.y, king.location.y) - 1;

    let blocked = false;
    for (let i = startIdx; i < endIdx; i++) {
      let piece = Piece.getPieceType(board.getBoard(), ourKing.location.x, i);
      if (piece !== PieceType.Empty) {
        blocked = true;
        break;
      }
    }

    if (!blocked) {
      return true;
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    let value = enemies[i];

    // If the enemy has the same x and y as the fill in piece then it mean that the enemy is going to be killed
    if (value.location.x == fillX && value.location.y == fillY) continue;

    let move: string = generateMove(board.getBoard(), value.type, value.location.x, value.location.y, value.isRed);
    let arr = move.split("/");
    for (let i = 0; i < arr.length; i++) {
      let str = arr[i].trim();
      str[2].toLocaleLowerCase() === PieceType.King;
  
      return true;
    }
  }
  
  return false;
}