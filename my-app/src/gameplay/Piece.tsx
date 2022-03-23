import * as React from 'react';
import ImagesCollection from '../resources/ImagesCollection';
import * as Sprites from '../resources/pieces/Index'

export enum PieceType {
  King = 'k',
  Advisor = 'a',
  Elephant = 'e',
  Rook = 'r',
  Cannon = 'c',
  Horse = 'h',
  Pawn = 'p'
}

export interface IPieceProps {
  x?: number;
  y?: number;

  width?: number;
  height?: number;

  clipWidth?: number;
  clipHeight?: number;

  isRed?: boolean;

  type?: PieceType;
}

export interface IPieceState {
  x: number;
  y: number;

  width: number;
  height: number;

  clipWidth: number;
  clipHeight: number;

  isRed: boolean;

  type: PieceType;
}

export default class Piece extends React.Component<IPieceProps, IPieceState> {
  public static readonly DEFAULT_SIZE = 64
  public static readonly DEFAULT_CLIPSIZE = 100;
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
    })
  }

  private _canvas: HTMLCanvasElement | null = null;

  constructor(props: IPieceProps) {
    super(props);
    this.state = {
      x: props.x                    || 0,
      y: props.y                    || 0,
      width: props.width            || Piece.DEFAULT_SIZE,
      height: props.height          || Piece.DEFAULT_SIZE,
      isRed: props.isRed            || false,
      clipWidth: props.clipWidth    || Piece.DEFAULT_CLIPSIZE,
      clipHeight: props.clipHeight  || Piece.DEFAULT_CLIPSIZE,
      type: props.type              || PieceType.King
    }
  }

  public componentDidMount() {
    Piece._instances.push(this);
  }

  public componentWillUnmount() {
    var index = Piece._instances.findIndex((element) => {
      return element === this;
    })

    Piece._instances.splice(index, 1);
  }

  public render() {
    let style : React.CSSProperties = {
      left: `${this.state.x * 100 / (Piece.BOARD_COL- 1)}%`,
      top: `${this.state.y * 100 / (Piece.BOARD_ROW - 1)}%`,
      transform: 'translate(-50%, -50%)',
      position: 'absolute'
    }

    return (
      <canvas
        style={style}
        onMouseUp={() => this._handleMouseUp()}
        onMouseDown={() => this._handleMouseDown()}
        ref={c => this._initCanvas(c)} 
        width={this.state.width} 
        height={this.state.height}/>
    );
  }
  private _handleMouseUp(): void {
    console.log("Mouse up");
  }
  private _handleMouseDown(): void {
    console.log("Mouse down");
    Piece.useImage = !Piece.useImage;
  }

  private _initCanvas(canvas: HTMLCanvasElement | null) {
    if (canvas == null) 
      return;

    this._canvas = canvas;
    let context = canvas.getContext("2d");

    let url = "";
    switch (this.state.type) {
      case PieceType.Advisor:
        url = Sprites.Advisor;
        break;
      case PieceType.Cannon:
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
      if (img === null)
        return;

      let offsetX = (this.state.isRed ? 0 : this.state.clipWidth * 2)
       + (Piece._useImage ? this.state.clipWidth : 0);
      context.drawImage(img, 
        offsetX, 0, this.state.clipWidth, this.state.clipHeight,
        0, 0, this.state.width, this.state.height
      )
    }
  }
}