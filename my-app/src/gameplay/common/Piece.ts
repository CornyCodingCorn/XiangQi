import Vector2 from "../../utils/Vector2";
import { BoardConst } from "../components/BoardBase";

export type generateMoveFunc = (board: string, x: number, y: number, isRed: boolean) => string;

export enum PieceType {
	King = "k",
	Advisor = "a",
	Elephant = "e",
	Rook = "r",
	Cannon = "c",
	Horse = "h",
	Pawn = "p",
	Empty = "0"
}

export class Piece {
  type: PieceType = PieceType.Empty;
  isRed: boolean = false;
  location: Vector2 = Vector2.create(0, 0);

  public static isSameColor(board: string, x: number, y: number, isRed: boolean): boolean {
    let char = Piece.getPiece(board, x, y);
    if (char === PieceType.Empty) return false;

    if (isRed) {
      return char.toUpperCase() === char;
    } else {
      return char.toLowerCase() === char;
    }
  }

  public static getPiece(board: string, x: number, y: number): string {
    return board[x + y * BoardConst.BOARD_COL];
  }

  public static isPosValid(x: number, y: number): boolean {
    return x >= 0 && x < BoardConst.BOARD_COL && y >= 0 && y < BoardConst.BOARD_ROW;
  }

  public static generatePos(board: string, x: number, y: number, isRed: boolean): string {
    let result = "";
    if (Piece.isPosValid(x, y) && !Piece.isSameColor(board, x, y, isRed)) {
      result = `${x}${y}/`;
    }

    return result;
  }
}