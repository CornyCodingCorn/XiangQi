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

	type?: PieceType;
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

	private static _useImage = false;
	private static _instances: Piece[] = [];
	public static get useImage(): boolean {
		return this._useImage;
	}
	public static set useImage(value: boolean) {
		this._useImage = value;
		this._instances.forEach((value) => {
			value.forceUpdate();
		});
	}

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

	public MoveTo(x: number, y: number, duration: number, callback: () => void) {
		let t = 0;
		let step = 0.01;
		let oldX = this.state.x;
		let oldY = this.state.y;

		this._timer = setInterval(() => {
			t += step;
			let t0 = MathEx.easeInOutCubic(t / duration);
			let deltaT0 = 1 - t0;

			this.setState({
				x: deltaT0 * oldX + t0 * x,
				y: deltaT0 * oldY + t0 * y 
			})

			if (t >= duration) {
				callback();
				if (this._timer) clearInterval(this._timer);
			}
		}, step * 1000)
	}

	public componentDidMount() {
		Piece._instances.push(this);
	}

	public componentWillUnmount() {
		var index = Piece._instances.findIndex((element) => {
			return element === this;
		});

		if (this._timer) clearInterval(this._timer);
		Piece._instances.splice(index, 1);
	}

	public render() {
		let style: React.CSSProperties = {
			left: `${(this.state.x * 100) / (Piece.BOARD_COL - 1)}%`,
			top: `${(this.state.y * 100) / (Piece.BOARD_ROW - 1)}%`,
			transform: `translate(-50%, -50%) ${this.props.isFlipped ? "scale(1, -1)" : "scale(1, 1)"}`,
			position: "absolute",
			zIndex: this.state.zIndex,
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
		if (canvas == null || this._canvas === canvas) return;

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
				(Piece._useImage ? this.state.clipWidth : 0);
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