import "./App.css";
import Piece, { PieceType } from "./gameplay/Piece";
import ImagesCollection from "./resources/ImagesCollection";
import * as React from "react";
import Board from "./gameplay/Board";

const BOARD_COLOR = 0xefcc8b;
const PAD_COLOR = 0x724726;
const OUTER_PAD_COLOR = 0x522706;
const LINE_COLOR = 0x933a1b;
const LINE_THICKNESS = 4;

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
						isFlipped={false}
						lineThickness={LINE_THICKNESS}
						lineOpacity={0.8}
						boardColor={BOARD_COLOR}
						padColor={PAD_COLOR}
						outerPadColor={OUTER_PAD_COLOR}
						outerPadPercentage={0.15}
						lineColor={LINE_COLOR}
						horizontalPadding={46}
						verticalPadding={46}
						pieceSize={64}
						cellWidth={70}
						cellHeight={70}
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
