import * as React from "react";
import { StringUtils } from "../../utils/StringUtils";
import { BgCanvas, IBgCanvasProps, IBgCanvasStates } from "./BgCanvas";
import { BoardBase, BoardConst } from "./BoardBase";
import Overlay, { IOverlayProps, IOverlayStates, SelectionEvent } from "./Overlay";
import Piece, { PieceType } from "./Piece";
import { Board as BoardLogic } from "../common/Board"

export interface IBoardProps extends IBgCanvasProps, IOverlayProps {
	boardFEN?: string;

	pieceSize: number;

	isFlipped: boolean;
}

export interface IBoardState extends IBgCanvasStates, IOverlayStates {
	board: string;

	pieceSize: number;

	isFlipped: boolean;
}

export default class Board extends BoardBase<IBoardProps, IBoardState> {
	private static readonly BOARD_NEW_FEN = "";

	// This board is for constant change, the state board is only for removing/adding pieces
	private _board: BoardLogic = BoardLogic.getInstance();
	public get board(): string {return this._board.getBoard();}
	public set board(value) {
		this._board.setBoard(value);
		this.setState({
			board: this._board.getBoard(),
		})
	}

	private _pieceCollection: Piece[] = [];
	private _bg: BgCanvas | null = null;
	private _overlay: Overlay | null = null;

	constructor(props: IBoardProps) {
		super(props);

		this.state = {
			...this.props,
			board: "",
		};
	}

	public componentWillUnmount() {}
	public componentDidMount() {
		this._createBoard("");
	}

	public render() {
		let pieces: JSX.Element[] = this._createPieces();

		let boardStyle: React.CSSProperties = {
			position: "relative",
			width: BoardBase.boardWidth,
			height: BoardBase.boardHeight,
		};

		let playArea: React.CSSProperties = {
			position: "absolute",
			top: this.state.verticalPadding,
			left: this.state.horizontalPadding,
			width: BoardBase.playAreaWidth,
			height: BoardBase.playAreaHeight,
		};

		let bg = React.createElement(BgCanvas, {
			...this.state,
			key: "background",
			ref: (c) => {
				this._bg = c;
			},
		});

		let overlay = React.createElement(Overlay, {
			...this.state,
			key: "overlay",
			ref: (o) => {
				this._overlay = o;
			}
		})

		return (
			<div style={boardStyle}>
				{bg}
				<div key={"playArea"} style={playArea}>
					{pieces}
				</div>
				{overlay}
			</div>
		);
	}

	private _createBoard(fenStr: string) {
		// Call server to interpret FEN and send back the board

		let str =
			"rheakaehr" +
			"000000000" +
			"0c00000c0" +
			"p0p0p0p0p" +
			"000000000" +
			"000000000" +
			"P0P0P0P0P" +
			"0C00000C0" +
			"000000000" +
			"RHEAKAEHR";

		this.board = str;
	}

	private _createPieces(): JSX.Element[] {
		if (this._bg === null) return [];

		let pieces: JSX.Element[] = [];
		this._pieceCollection = [];

		for (let i = 0; i < this.state.board.length; i++) {
			let char = this.state.board[i];
			if (char == PieceType.Empty) continue;

			let type: PieceType = char.toLowerCase() as PieceType;
			let isRed = char === char.toUpperCase();

			let col = i % BoardConst.BOARD_COL;
			let row = Math.floor(i / BoardConst.BOARD_COL);
			let x = this.state.horizontalPadding + col * this.state.cellWidth;
			let y = this.state.verticalPadding + row * this.state.cellHeight;

			if (this.state.isFlipped) {
				y = BoardBase.boardHeight - y;
			}

			pieces.push(
				React.createElement(Piece, {
					key: i,
					x: col,
					y: row,
					size: this.state.pieceSize,
					type: type,
					isRed: isRed,
					ref: this._addPieceToCollection,
					onMouseDown: this._selectPiece,
				}),
			);
		}

		return pieces;
	}

	private _selectPiece = (piece: Piece) => {
		// Send the string to the server to check for valid path,
		// Send format: xy
		// Receive format: pos1/pos2/pos3/pos4/.. Each pos is just x and y and each is 1 digit
		// Maybe should just check the move ourself

		if (this._overlay) this._overlay.show(piece, (x, y, e) => {
			if (e === SelectionEvent.Canceled) {
				if (this._overlay) this._overlay.hide();
				return;
			}
			piece.zIndex = 1;
			
			// Send the selected move to the server, server reply whether it is ok or not. Format `{x}{y}{toX}{toY}`
			
			// This is assuming that the server said ok.
			// Maybe not rerendering but just move the piece by playing animation.
			// The state.board is just for reloading the board.

			let oldIndex = piece.state.x + piece.state.y * BoardConst.BOARD_COL;
			let newIndex = x + y * BoardConst.BOARD_COL;
			let boardStr = 

			this._board.setBoard(StringUtils.replaceCharAt(this._board.getBoard(), this._board.getBoard()[oldIndex], newIndex));
			this._board.setBoard(StringUtils.replaceCharAt(this._board.getBoard(), PieceType.Empty, oldIndex));

			// To tell react that it needs to delete the old piece and not the new one.
			let midStepBoard = StringUtils.replaceCharAt(this._board.getBoard(), PieceType.Empty, newIndex);

			piece.MoveTo(x, y, 0.25, () => {
				if (this._overlay) this._overlay.hide();
				this.setState({board: midStepBoard});
				this.setState({board: this._board.getBoard()});
				piece.zIndex = 0;
			})
		});
	};

	private _addPieceToCollection = (piece: Piece | null) => {
		if (piece === null) return;

		this._pieceCollection.push(piece);
	};
}

/**
 * Note:
 * - Black is lowercase
 * - Red is uppercase
 */
