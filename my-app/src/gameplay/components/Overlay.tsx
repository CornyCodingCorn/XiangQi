import * as React from "react";
import Vector2 from "../../utils/Vector2";
import { generateMove } from "../common/PieceMove";
import { BoardBase, BoardConst, IBoardBaseProps, IBoardBaseStates } from "./BoardBase";
import Piece, { PieceType } from "./Piece";
import PossibleMove, { IPossibleMoveProps } from "./PossibleMove";

const DELIMITER = "/";
type selectCallback = (x:number, y:number, event: SelectionEvent) => void;

export enum SelectionEvent {
	Selected,
	Canceled,
}

export interface IOverlayProps extends IBoardBaseProps {
	moveWidth: number;
	moveHeight: number;

	moveSpace: number;

	moveLineLength: number;
	moveLineColor: number;
	moveLineOverEnemyColor: number;
	moveLineAlpha: number;

	moveLineWidth: number;

	moveCircleRadius: number;
	moveString: string;

	moveVisible: boolean;
}

export interface IOverlayStates extends IBoardBaseStates {
	moveWidth: number;
	moveHeight: number;

	moveSpace: number;

	moveLineLength: number;
	moveLineColor: number;
	moveLineOverEnemyColor: number;
	moveLineAlpha: number;

	moveLineWidth: number;

	moveCircleRadius: number;
	moveString: string;

	moveVisible: boolean;

	board: string;
}

class Location {
	public overEnemy: boolean = false;
	public position: Vector2 = Vector2.create(0, 0);
}

// Valid path: xy/xy/xy split then render.
export default class Overlay extends React.Component<
	IOverlayProps,
	IOverlayStates
> {
	private _callback: selectCallback| null = null;
	private _selectingPiece: Piece | null = null;

	constructor(props: IOverlayProps) {
		super (props);

		this.state = {
			...this.props,
			board: ""
		}
	}

	public setMoveString(string : string) {
		this.setState({
			moveString: string
		});
	}

	public hide() {
		if (!this.state.moveVisible) return;

		this.setState({
			moveVisible: false,
		})
		this.forceUpdate();
	}

	public show(board: string, piece: Piece, callback: selectCallback) {
		if (this.state.moveVisible) return;

		this._selectingPiece = piece;
		// Calculate the move string
		let possibleMoves = generateMove(board, piece.state.type, piece.state.x, piece.state.y, piece.state.isRed);
		if (possibleMoves == "") {
			return;
		}

		this.setState({
			moveString: possibleMoves,
			moveVisible: true,
			board: board
		})
		this._callback = callback;
	}

	public cancelSelection() {
		this.hide();
		if (this._callback) this._callback(-1, -1, SelectionEvent.Canceled);
	}

	public selectMove(x: number, y: number) {
		this.hide();
		if (this._callback) this._callback(x, y, SelectionEvent.Selected);
	}

	public render() {
		if (!this.state.moveVisible || !this._selectingPiece)
			return null;

		let moveComponent: JSX.Element[] = [];
		let locations = generatePositions(this.state.board, this.state.moveString, this._selectingPiece.state.isRed);
		let maxCol = BoardConst.BOARD_COL - 1;
		let maxRow = BoardConst.BOARD_ROW - 1;
		let state = this.state;

		locations.forEach((loc, index) => {
			moveComponent.push(
				<PossibleMove
					key={index}

					onClick={(x, y, event) => {
						this.selectMove(x, y);
					}}
					top={BoardBase.playAreaHeight * (loc.position.y / maxRow)}
					left={BoardBase.playAreaWidth * (loc.position.x / maxCol)}

					x={loc.position.x}
					y={loc.position.y}

					overEnemy={loc.overEnemy}

					width={state.moveWidth}
					height={state.moveHeight}
					space={state.moveSpace}

					circleRadius={state.moveCircleRadius}

					lineWidth={state.moveLineWidth}
					lineLength={state.moveLineLength}
					lineColor={state.moveLineColor}
					lineOverEnemyColor={state.moveLineOverEnemyColor}
					lineAlpha={state.moveLineAlpha}
				/>
			);
		});

		return (
			<div style={{
				position: 'relative',
				width: BoardBase.playAreaWidth,
				height: BoardBase.playAreaHeight,
				top: this.state.verticalPadding,
				left: this.state.horizontalPadding,
			}} onClick={() => this.cancelSelection()}>
				{moveComponent}
			</div>
		);
	}
}

function generatePositions(board: string, str: string, isRed: boolean): Location[] {
	let posStr = str.split(DELIMITER);
	let results: Location[] = [];

	posStr.forEach((value) => {
		if (value === "") return;
		try {
			let x = Number.parseInt(value[0]);
			let y = Number.parseInt(value[1]);

			let location = new Location();
			let over = board[x + y * BoardConst.BOARD_COL];
			location.position = Vector2.create(x, y);

			if (over === PieceType.Empty)
				location.overEnemy = false;
			else
				location.overEnemy = isRed ? over === over.toLowerCase() : over === over.toUpperCase();

			results.push(location);
		}
		catch(e) {}
	});

	return results;
}