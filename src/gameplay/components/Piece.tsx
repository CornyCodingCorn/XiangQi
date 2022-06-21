import * as React from "react";
import ImagesCollection from "../../resources/ImagesCollection";
import * as Sprites from "../../resources/pieces/Index";
import { MathEx } from "../../utils/MathEx";
import { PieceType } from "../common/Piece";

export interface IPieceProps {
	x?: number;
	y?: number;

	size?: number;
	shadowPad?: number;

	clipWidth?: number;
	clipHeight?: number;

	isFlipped?: boolean;

	onMouseDown?: (arg0: Piece) => void;
	onMouseUp?: (arg0: Piece) => void;

	isRed?: boolean;
	isPlayerRed: boolean;

	type?: PieceType;

	useImage: boolean;
}

export interface IPieceState {
	x: number;
	y: number;

	size: number;
	shadowPad: number;

	clipWidth: number;
	clipHeight: number;

	isRed: boolean;

	type: PieceType;
	zIndex: number;
}

export default class Piece extends React.Component<IPieceProps, IPieceState> {
	public static readonly DEFAULT_SIZE = 64;
	public static readonly DEFAULT_SHADOW_PAD = 0.5;
	public static readonly DEFAULT_CLIP_HEIGHT = 150;
	public static readonly DEFAULT_CLIP_WIDTH = 100;
	public static readonly BOARD_ROW = 10;
	public static readonly BOARD_COL = 9;

	private _timer: NodeJS.Timer | null = null;

	public get zIndex() {
		return this.state.zIndex;
	}

	public set zIndex(value) {
		this.setState({
			zIndex: value
		})
	}

	private _canvas: HTMLCanvasElement | null = null;

	constructor(props: IPieceProps) {
		super(props);
		this.state = {
			x: props.x || 0,
			y: props.y || 0,
			size: props.size || Piece.DEFAULT_SIZE,
			shadowPad: props.shadowPad || Piece.DEFAULT_SHADOW_PAD,
			isRed: props.isRed || false,
			clipWidth: props.clipWidth || Piece.DEFAULT_CLIP_WIDTH,
			clipHeight: props.clipHeight || Piece.DEFAULT_CLIP_HEIGHT,
			type: props.type || PieceType.King,
			zIndex: 0,
		};
	}

	public MoveTo(x: number, y: number, duration: number, callback: () => void, fromX?: number, fromY?: number) {
		let t = 0;
		let step = 0.01;

		this.setState({
			x: (fromX != null && fromX != undefined) ? fromX : this.state.x,
			y: (fromY != null && fromY != undefined) ? fromY : this.state.y
		}, () => {
			let oldX = this.state.x;
			let oldY = this.state.y;
	
			let stopTimer = false;
			this._timer = setInterval(() => {
				if (stopTimer) {
					if (this._timer) clearInterval(this._timer);
					callback();
				} else {
					t += step;
					let t0 = MathEx.easeInOutCubic(t / duration);
					t0 = t0 > 1 ? 1 : t0;
					let deltaT0 = 1 - t0;
		
					this.setState({
						x: deltaT0 * oldX + t0 * x,
						y: deltaT0 * oldY + t0 * y 
					})
		
					if (t >= duration) {
						stopTimer = true;
					}
				}
			}, step * 1000);
		});
	}

	public componentWillUnmount() {
		if (this._timer) clearInterval(this._timer);
	}

	public render() {
		let style: React.CSSProperties = {
			left: `${(this.state.x * 100) / (Piece.BOARD_COL - 1)}%`,
			top: `${(this.state.y * 100) / (Piece.BOARD_ROW - 1)}%`,
			transform: `translate(-50%, -50%) ${this.props.isFlipped ? "scale(1, -1)" : "scale(1, 1)"}`,
			position: "absolute",
			zIndex: this.state.zIndex,
			cursor: (this.props.isPlayerRed ? this.props.isRed : !this.props.isRed) ? "pointer" : "default"
		};

		return (
			<canvas
				style={style}
				onMouseUp={() => this._handleMouseUp()}
				onMouseDown={() => this._handleMouseDown()}
				ref={(c) => this._initCanvas(c)}
				width={this.state.size}
				height={this.state.size * (1 + this.state.shadowPad)}
			/>
		);
	}

	private _handleMouseUp(): void {
		if (this.props.onMouseUp === undefined) return;

		this.props.onMouseUp(this);
	}
	private _handleMouseDown(): void {
		if (this.props.onMouseDown === undefined) return;

		this.props.onMouseDown(this);
	}

	private _initCanvas(canvas: HTMLCanvasElement | null) {
		if (canvas == null) return;

		this._canvas = canvas;
		let context = canvas.getContext("2d");

		let url = "";
		switch (this.state.type) {
			case PieceType.Advisor:
				url = Sprites.Advisor;
				break;
			case PieceType.Canon:
				url = Sprites.Cannon;
				break;
			case PieceType.Rook:
				url = Sprites.Rook;
				break;
			case PieceType.Elephant:
				url = Sprites.Elephant;
				break;
			case PieceType.King:
				url = Sprites.King;
				break;
			case PieceType.Horse:
				url = Sprites.Horse;
				break;
			case PieceType.Pawn:
				url = Sprites.Pawn;
				break;
		}

		if (url !== undefined) {
			if (context === null) {
				return;
			}

			let img = ImagesCollection.getImage(url);
			if (img === null) return;

			let offsetX =
				(this.state.isRed ? 0 : this.state.clipWidth * 2) +
				(this.props.useImage ? this.state.clipWidth : 0);
			context.clearRect(0, 0, this._canvas.width, this._canvas.height);
			context.drawImage(
				img,
				offsetX,
				0,
				this.state.clipWidth,
				this.state.clipHeight,
				0,
				0,
				this.state.size,
				this.state.size * (1 + this.state.shadowPad),
			);
		}
	}
}

export { PieceType } from "../common/Piece";