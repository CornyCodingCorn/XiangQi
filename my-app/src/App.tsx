import "./App.css";
import Piece, { PieceType } from "./gameplay/Piece";
import ImagesCollection from "./resources/ImagesCollection";
import * as React from "react";
import Board from "./gameplay/Board";

const BOARD_COLOR = 0xefcc8b;
const PAD_COLOR = 0x724726;
const OUTER_PAD_COLOR = 0x522706;
const LINE_COLOR = 0x933a1b;
const LINE_MARK_COLOR = 0x0077FF;
const LINE_MARK_OVER_ENEMY_COLOR = 0x55DD55;
const LINE_THICKNESS = 4;
const PADDING = 46;
const PIECE_SIZE = 64;
const CELL_SIZE = 70;

export interface IAppProps {}

export interface IAppState {}

export default class App extends React.Component<IAppProps> {
	private _isLoaded: boolean = false;
	public get isLoaded(): boolean {
		return this._isLoaded;
	}

	public render() {
		ImagesCollection.init(() => {
			this._isLoaded = true;
			this.forceUpdate();
		});

		let component: JSX.Element;
		if (this._isLoaded) {
			component = (
				<div>
					<Board
						moveCircleRadius={2}
						moveString=""
						moveLineWidth={LINE_THICKNESS}

						moveLineColor={LINE_MARK_COLOR}
						moveLineOverEnemyColor={LINE_MARK_OVER_ENEMY_COLOR}

						moveLineAlpha={1}
						moveLineLength={6}
						moveVisible={false}
						
						moveWidth={PIECE_SIZE}
						moveHeight={PIECE_SIZE}

						moveSpace={14}

						isFlipped={false}
						lineThickness={LINE_THICKNESS}
						lineOpacity={0.8}
						boardColor={BOARD_COLOR}
						padColor={PAD_COLOR}
						outerPadColor={OUTER_PAD_COLOR}
						outerPadPercentage={0.15}
						lineColor={LINE_COLOR}
						horizontalPadding={PADDING}
						verticalPadding={PADDING}
						pieceSize={PIECE_SIZE}
						cellWidth={CELL_SIZE}
						cellHeight={CELL_SIZE}
					/>
				</div>
			);
		} else {
			let style: React.CSSProperties = {
				backgroundColor: "red",
				width: 200,
				height: 200,
			};

			component = <div style={style}></div>;
		}

		return component;
	}
}
