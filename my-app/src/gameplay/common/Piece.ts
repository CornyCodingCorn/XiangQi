import Vector2 from "../../utils/Vector2";
import { BoardConst } from "../components/BoardBase";

export type generateMoveFunc = (
	board: string,
	x: number,
	y: number,
	isRed: boolean,
) => string;


export enum PieceType {
	King = "k",
	Advisor = "a",
	Elephant = "e",
	Rook = "r",
	Cannon = "c",
	Horse = "h",
	Pawn = "p",
	Empty = "0",
}

export class Piece {
	type: PieceType = PieceType.Empty;
	isRed: boolean = false;
	location: Vector2 = Vector2.create(0, 0);

	public static isSameColor(piece: string, isRed: boolean): boolean;
	public static isSameColor(
		board: string,
		isRed: boolean,
		x: number,
		y: number,
	): boolean;
	public static isSameColor(
		info: string,
		isRed: boolean,
		x?: number,
		y?: number,
	): boolean {
		let char = "";
		if (!x || !y) char = info;
		else char = Piece.getPiece(info, x, y);

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

	public static getPieceType(board: string, x: number, y: number): PieceType {
		let char = board[x + y * BoardConst.BOARD_COL].toLowerCase();
		return char as PieceType;
	}

	public static isPieceRed(board: string, x: number, y: number): boolean {
		let char = this.getPiece(board, x, y);
		return char === char.toUpperCase();
	}

	public static getPieceObject(board: string, x: number, y: number): Piece 
	public static getPieceObject(board: string, index: number): Piece 
	public static getPieceObject(board: string, x: number, y?: number): Piece {
		let posX = 0;
		let posY = 0;
		if (y) {
			posX = x;
			posY = y;
		} else {
			posX = x % BoardConst.BOARD_COL;
			posY = Math.floor(x / BoardConst.BOARD_COL);
		}

		let result = new Piece();
		result.location.x = posX;
		result.location.y = posY;
		result.type = this.getPieceType(board, posX, posY);
		result.isRed = this.isPieceRed(board, posX, posY);

		return result;
	}

	public static isPosValid(x: number, y: number): boolean {
		return (
			x >= 0 && x < BoardConst.BOARD_COL && y >= 0 && y < BoardConst.BOARD_ROW
		);
	}

	public static generatePos(
		board: string,
		x: number,
		y: number,
		isRed: boolean,
		forceReturn: boolean = false,
	): string {
		let result = "";
		let piece = Piece.getPiece(board, x, y);
		if (
			Piece.isPosValid(x, y) &&
			(!Piece.isSameColor(piece, isRed) || forceReturn)
		) {
			result = `${x}${y}${piece}/`;
		}

		return result;
	}

	// Generate move until hit invalid or another piece
	public static generateGenericMove(
		board: string,
		x: number,
		y: number,
		isRed: boolean,
		deltaX: number,
		deltaY: number,
		allowKill: boolean,
	): string {
		let isValid = true;
		let anotherPiece = false;
		let result = "";

		do {
			x += deltaX;
			y += deltaY;

			isValid = Piece.isPosValid(x, y);
			if (isValid) {
				let str = Piece.generatePos(board, x, y, isRed);
				anotherPiece = str === "" || str[2] !== PieceType.Empty;
				if (str[2] !== PieceType.Empty) {
					if (allowKill) result += str;
				} else {
					result += str;
				}
			}
		} while (isValid && !anotherPiece);

		return result;
	}
}