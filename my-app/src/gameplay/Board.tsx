import * as React from 'react';
import Color from '../utils/Color';
import UtilsColor from '../utils/Color';
import { getEnumFromStr } from '../utils/enum';
import Piece, { PieceType } from './Piece';

export interface IBoardProps {
  boardFEN?: string;

  horizontalPadding?: number;
  verticalPadding?: number;

  cellWidth?: number;
  cellHeight?: number;

  pieceSize?: number;

  isFlipped?: boolean;

  padColor    ?:  number;
  boardColor  ?: number;
  lineColor   ?: number;

  lineThickness ?: number;
}

export interface IBoardState {
  board: string;

  horizontalPadding: number;
  verticalPadding: number;

  cellWidth: number;
  cellHeight: number;

  pieceSize: number;

  isFlipped: boolean;

  padColor  : number;
  boardColor  : number;
  lineColor   : number;

  lineThickness: number;
}

export default class Board extends React.Component<IBoardProps, IBoardState> {
  private static readonly BOARD_COL = 9;
  private static readonly BOARD_ROW = 10;
  private static readonly BOARD_NEW_FEN = "";

  private _padColor: UtilsColor = new UtilsColor();
  private _lineColor: UtilsColor =new UtilsColor();
  private _boardColor: UtilsColor = new UtilsColor();

  private _boardWidth: number = 0;
  private _boardHeight: number = 0;

  private _playAreaWidth: number = 0;
  private _playAreaHeight: number = 0;

  private _pieceCollection: Map<PieceType, [Piece]> = new Map<PieceType, [Piece]>();

  constructor(props: IBoardProps) {
    super(props);

    this.state = {
      board: "",
      horizontalPadding: this.props.horizontalPadding || 0,
      verticalPadding: this.props.verticalPadding || 0,
      cellWidth: this.props.cellWidth || Piece.DEFAULT_SIZE,
      cellHeight: this.props.cellHeight || Piece.DEFAULT_SIZE,
      isFlipped: this.props.isFlipped || false,
      
      padColor    : this.props.padColor   || 0,
      boardColor  : this.props.boardColor || 0,
      lineColor   : this.props.lineColor  || 0,
      lineThickness : this.props.lineThickness || 1,

      pieceSize: this.props.pieceSize || Piece.DEFAULT_SIZE
    }

    this._playAreaWidth = this.state.cellWidth * (Board.BOARD_COL - 1);
    this._playAreaHeight = this.state.cellHeight * (Board.BOARD_ROW - 1);

    this._boardWidth  = this.state.horizontalPadding * 2 + this._playAreaWidth;
    this._boardHeight = this.state.verticalPadding * 2 + this._playAreaHeight;
  }

  public componentWillUnmount() {
    
  }
  public componentDidMount() {
    this._createBoard("");
  }
  
  public render() {
    let pieces:JSX.Element[] = this._createPieces();

    this._boardColor.setColor(this.state.boardColor);
    this._padColor.setColor(this.state.padColor);
    this._lineColor.setColor(this.state.lineColor);
    let str = this._padColor.toString();

    let boardStyle: React.CSSProperties = {
      position: 'relative',
      width: this._boardWidth,
      height: this._boardHeight,
    }

    let playArea: React.CSSProperties = {
      position: 'absolute',
      top: this.state.verticalPadding,
      left: this.state.horizontalPadding,
      width: this._playAreaWidth,
      height: this._playAreaHeight
    }

    let bgCanvas: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      background: this._padColor.toString()
    }

    return (
      <div style={boardStyle}>
        <canvas key={"bgCanvas"} 
                width={this._boardWidth} 
                height={this._boardHeight} 
                style={bgCanvas} 
                ref={c => this._canvasInit(c)}/>
        <div key={"playArea"} 
             style={playArea}>
          {pieces}
        </div>
      </div>
    );
  }

  private _createBoard(fenStr: string) {
    // Call server to interpret FEN and send back the board

    let str =
    "0heakae00" +
    "000000000" +
    "0c00000c0" +
    "p0p0p0p0p" +
    "000000000" +
    "000000000" +
    "P0P0P0P0P" +
    "0C00000C0" +
    "000000000" +
    "RHEAKAEHR";

    this.setState((prevState) => ({
      board: str
    }));
  }

  private _createPieces(): JSX.Element[] {
    let pieces:JSX.Element[] = [];
    for (let i = 0; i < this.state.board.length; i++) {
      let char = this.state.board[i];
      if (char == '0')
        continue;
        
      let type: PieceType = char.toLowerCase() as PieceType;
      let isRed = char === char.toUpperCase();

      let col = i % Board.BOARD_COL;
      let row = Math.floor(i / Board.BOARD_COL);
      let x = this.state.horizontalPadding + col * this.state.cellWidth;
      let y = this.state.verticalPadding + row * this.state.cellHeight;

      if (this.state.isFlipped) {
        y = this._boardHeight - y;
      }

      pieces.push(
        React.createElement(Piece, {
          key: i,
          x: col,
          y: row,
          type: type,
          isRed: isRed,
        })
      )
    }

    return pieces;
  }

  private _canvasInit(canvas: HTMLCanvasElement | null) {
    if (canvas === null) 
      return;    

    let context = canvas.getContext("2d");
    if (context === null)
      return;

    context.fillStyle = this._boardColor.toString();
    context.strokeStyle = this._lineColor.toString();
    context.lineWidth = this.state.lineThickness
    context.fillRect(
      this.state.horizontalPadding,
      this.state.verticalPadding,
      this._playAreaWidth,
      this._playAreaHeight,
    );
    
    // Draw the border
    context.strokeRect(
      this.state.horizontalPadding,
      this.state.verticalPadding,
      this._playAreaWidth,
      this._playAreaHeight,
    );

    // Draw rows
    for (let i = 1; i < Board.BOARD_ROW; i++) {
      let y = this.state.verticalPadding + i * this.state.cellHeight;
      let x = this.state.horizontalPadding;

      context.moveTo(x, y);
      context.lineTo(x + this._playAreaWidth, y);
    }

    // Have to skip the middle
    for (let i = 1; i < Board.BOARD_COL; i++) {
      let x = this.state.horizontalPadding + i * this.state.cellWidth;

      let y1 = this.state.verticalPadding;
      let yEnd1 = y1 + this.state.cellHeight * 4;
      // Skip the middle
      let y2 = yEnd1 + this.state.cellHeight;
      let yEnd2 = y1 + this._playAreaHeight;

      context.moveTo(x, y1);
      context.lineTo(x, yEnd1);
      context.moveTo(x, y2);
      context.lineTo(x, yEnd2)
    }

    context.stroke();
  }
}

/**
 * Note:
 * - Black is lowercase
 * - Red is uppercase
 */