import React from "react";
import Piece from "./Piece";

export interface IBoardBaseProps {
	cellWidth: number;
	cellHeight: number;

	horizontalPadding: number;
	verticalPadding: number;
}

export interface IBoardBaseStates {
	cellWidth: number;
	cellHeight: number;

	horizontalPadding: number;
	verticalPadding: number;
}

export class BoardConst {
	public static readonly BOARD_COL = 9;
	public static readonly BOARD_ROW = 10;
}

export class BoardBase<
	IProps extends IBoardBaseProps,
	IStates extends IBoardBaseStates,
> extends React.Component<IProps, IStates> {
	private static _boardWidth: number = 0;
	private static _boardHeight: number = 0;
	private static _playAreaWidth: number = 0;
	private static _playAreaHeight: number = 0;

	public static get boardWidth(): number {
		return this._boardWidth;
	}
	public static get boardHeight(): number {
		return this._boardHeight;
	}
	public static get playAreaWidth(): number {
		return this._playAreaWidth;
	}
	public static get playAreaHeight(): number {
		return this._playAreaHeight;
	}

	private static _init(
		cellWidth: number,
		cellHeight: number,
		horizontalPadding: number,
		verticalPadding: number,
	) {
		this._playAreaWidth = cellWidth * (BoardConst.BOARD_COL - 1);
		this._playAreaHeight = cellHeight * (BoardConst.BOARD_ROW - 1);

		this._boardWidth = horizontalPadding * 2 + this.playAreaWidth;
		this._boardHeight = verticalPadding * 2 + this.playAreaHeight;
	}

	constructor(props: IProps) {
		super(props);

		this.state = {
			...this.state,
			cellWidth: this.props.cellWidth,
			cellHeight: this.props.cellHeight,

			horizontalPadding: this.props.horizontalPadding,
			verticalPadding: this.props.verticalPadding,
		};

		BoardBase._init(
			this.state.cellWidth,
			this.state.cellHeight,
			this.state.horizontalPadding,
			this.state.verticalPadding,
		);
	}
}
