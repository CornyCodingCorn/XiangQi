import { StringUtils } from "../../utils/StringUtils";
import { BoardConst } from "../components/BoardBase";
import { generateMoveAdvisor } from "./Advisor";
import { generateMoveCanon } from "./Canon";
import { generateMoveElephant } from "./Elephant";
import { generateMoveHorse } from "./Horse";
import { generateMoveKing } from "./King";
import { generateMovePawn } from "./Pawn";
import { generateMoveFunc, Piece, PieceType } from "./Piece";
import { generateMoveRook } from "./Rook";

// This is just to store information
export class BoardInfo {
	protected _board: string = "";
	public setBoard(value: string) {
		// >:V this doesn't count as logic, don't quote me!!!
		this._board = value;
	}
	public getBoard() {
		return this._board;
	}

  public removeAt(x: number, y: number) {
    this._board = StringUtils.replaceCharAt(this._board, PieceType.Empty, x + y * BoardConst.BOARD_COL);
  }

	public horses: Piece[] = [];
	public canons: Piece[] = [];
	public advisors: Piece[] = [];
	public elephants: Piece[] = [];
	public pawns: Piece[] = [];
	public rooks: Piece[] = [];

	public blackKing: Piece = new Piece();
	public redKing: Piece = new Piece();
}

export class Board extends BoardInfo {
	private static _instance: Board | null = null;
	public static generateRawMove(
		type: PieceType,
		x: number,
		y: number,
		isRed: boolean,
    board?: string
	): string {
		let func: generateMoveFunc | null = null;
		switch (type) {
			case PieceType.King:
				func = generateMoveKing;
				break;
			case PieceType.Advisor:
				func = generateMoveAdvisor;
				break;
			case PieceType.Elephant:
				func = generateMoveElephant;
				break;
			case PieceType.Horse:
				func = generateMoveHorse;
				break;
			case PieceType.Rook:
				func = generateMoveRook;
				break;
			case PieceType.Cannon:
				func = generateMoveCanon;
				break;
			case PieceType.Pawn:
				func = generateMovePawn;
				break;
		}

		return func ? func(board || this.getInstance().getBoard(), x, y, isRed) : "";
	}

	public static generateMove(
		type: PieceType,
		x: number,
		y: number,
		isRed: boolean,
	): string {
		let board = Board.getInstance().getInfoOfOneSide(!isRed);
    board.removeAt(x, y);

		let rawMove = Board.generateRawMove(type, x, y, isRed);
		let arr = rawMove.split("/");
		let result = "";

    arr.forEach((value) => {
      if (value === "") return;
      let fillInStr = value.substring(0, 2) + (isRed ? type.toUpperCase() : type);

      if (!Board.isKingChecked(board, isRed, fillInStr)) {
        result += `${value}/`;
      }
    });

		return result;
	}

	/**
	 * If return something other than "" then the king is checked
	 * @param board The board object created from the normal board but remove all the allies;
	 * @param isRed
	 * @param fillPiece This piece fill get filled in if defined, the board will get changed then restored to normal
	 * @returns
	 */
	public static isKingChecked(
		board: BoardInfo,
		isRed: boolean,
		fillPiece?: string,
	): boolean {
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

			boardStr = StringUtils.replaceCharAt(
				boardStr,
				fillPiece[2],
				fillX + fillY * BoardConst.BOARD_COL,
			);
		}

		let king: Piece = isRed ? board.blackKing : board.redKing;
		let enemies: Piece[] = [
      ...board.canons,
      ...board.rooks,
			...board.horses,
			...board.pawns,
		];
		let ourKing: Piece = !isRed ? board.blackKing : board.redKing;

		// Check if the king is seeing each other :))
		if (ourKing.location.x === king.location.x) {
			let startIdx = Math.min(ourKing.location.y, king.location.y) + 1;
			let endIdx = Math.max(ourKing.location.y, king.location.y);

			let blocked = false;
			for (let i = startIdx; i < endIdx; i++) {
				let piece = Piece.getPieceType(board.getBoard(), ourKing.location.x, i);
				if (piece !== PieceType.Empty) {
					blocked = true;
					break;
				}
			}

			if (!blocked)
				return true;
		}

		for (let i = 0; i < enemies.length; i++) {
			let value = enemies[i];
			// If the enemy has the same x and y as the fill in piece then it mean that the enemy is going to be killed
			if (value.location.x === fillX && value.location.y === fillY) continue;

			let move: string = Board.generateRawMove(
				value.type,
				value.location.x,
				value.location.y,
				value.isRed,
        boardStr
			);

			let arr = move.split("/");
			for (let i = 0; i < arr.length; i++) {
				let str = arr[i]
				if (str !== "" && str[2].toLocaleLowerCase() === PieceType.King)
				  return true;
			}
		}

		return false;
	}

  private constructor() {super();};

	public static getInstance() {
		if (!Board._instance) {
			Board._instance = new Board();
		}
		return Board._instance;
	}

	public override setBoard(value: string) {
		this._board = value;
		this._findAllPieces();
	}
	public override getBoard() {
		return this._board;
	}
  public override removeAt(x: number, y: number) {
    super.removeAt(x, y);
    this._findAllPieces();
  }

	public getInfoOfOneSide(isRed: boolean): BoardInfo {
		let board = new BoardInfo();

		board.horses = this._extractPieceByType(this.horses, isRed);
		board.rooks = this._extractPieceByType(this.rooks, isRed);
		board.pawns = this._extractPieceByType(this.pawns, isRed);
		board.canons = this._extractPieceByType(this.canons, isRed);
		board.advisors = this._extractPieceByType(this.advisors, isRed);
		board.elephants = this._extractPieceByType(this.elephants, isRed);

		board.blackKing = this.blackKing;
		board.redKing = this.redKing;

    board.setBoard(this._board);

		return board;
	}

	private _extractPieceByType(pieces: Piece[], isRed: boolean): Piece[] {
		let result: Piece[] = [];
		pieces.forEach((value) => {
			if (value.isRed === isRed) result.push(value);
		});

		return result;
	}

	private _findAllPieces() {
    this._removeAllPieces();

		for (let i = 0; i < this._board.length; i++) {
			let char = this._board[i];
			let type = char.toLocaleLowerCase() as PieceType;

			// Ignore empty and same color
			if (type === PieceType.Empty) continue;

			let piece = Piece.getPieceObject(this._board, i);
			switch (type) {
				case PieceType.Cannon:
					this.canons.push(piece);
					break;
				case PieceType.Horse:
					this.horses.push(piece);
					break;
				case PieceType.Rook:
					this.rooks.push(piece);
					break;
				case PieceType.Pawn:
					this.pawns.push(piece);
					break;
				case PieceType.Advisor:
					this.advisors.push(piece);
					break;
				case PieceType.Elephant:
					this.elephants.push(piece);
					break;
				case PieceType.King:
					if (char.toLocaleLowerCase() === char) {
						this.blackKing = piece;
					} else {
						this.redKing = piece;
					}
					break;
			}
		}
	}

  private _removeAllPieces() {
    this.horses = [];
    this.pawns = [];
    this.canons = [];
    this.advisors = [];
    this.elephants = [];
    this.rooks = [];

    this.blackKing = new Piece();
    this.redKing = new Piece();
  }
}
