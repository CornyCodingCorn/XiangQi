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

  isFlipped?: boolean;

  padColor    ?:  number;
  boardColor  ?: number;
  lineColor   ?: number;
}

export interface IBoardState {
  board: string;

  horizontalPadding: number;
  verticalPadding: number;

  cellWidth: number;
  cellHeight: number;

  isFlipped: boolean;

  padColor  : number;
  boardColor  : number;
  lineColor   : number;
}

export default class Board extends React.Component<IBoardProps, IBoardState> {
  private static readonly BOARD_COL = 9;
  private static readonly BOARD_ROW = 10;
  private static readonly BOARD_NEW_FEN = "";

  private _padColor: UtilsColor = new UtilsColor();
  private _lineColor: UtilsColor =new UtilsColor();
  private _boardColor: UtilsColor = new UtilsColor();

  private _pieceCollection: Map<PieceType, [Piece]> = new Map<PieceType, [Piece]>();

  constructor(props: IBoardProps) {
    super(props);

    this.state = {
      board: "rheakaehr" +
      "000000000" +
      "0c00000c0" +
      "p0p0p0p0p" +
      "000000000" +
      "000000000" +
      "P0P0P0P0P" +
      "0C00000C0" +
      "000000000" +
      "RHEAKAEHR",
      horizontalPadding: this.props.horizontalPadding || 0,
      verticalPadding: this.props.verticalPadding || 0,
      cellWidth: this.props.cellWidth || Piece.DEFAULT_SIZE,
      cellHeight: this.props.cellHeight || Piece.DEFAULT_SIZE,
      isFlipped: this.props.isFlipped || false,
      
      padColor    : this.props.padColor   || 0,
      boardColor  : this.props.boardColor || 0,
      lineColor   : this.props.lineColor  || 0,
    }
    this._createBoard(props.boardFEN || Board.BOARD_NEW_FEN);
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


    this.setState({
      board: str
    });
  }

  public render() {
    let boardWidth = this.state.horizontalPadding * 2 + this.state.cellWidth * (Board.BOARD_COL - 1);
    let boardHeight = this.state.verticalPadding * 2 + this.state.cellHeight * (Board.BOARD_ROW - 1);
    let pieces:JSX.Element[] = [];
    for (let i = 0; i < this.state.board.length; i++) {
      let char = this.state.board[i];
      if (char == '0')
        continue;
        
      let type: PieceType = char.toLowerCase() as PieceType;
      let isRed = char === char.toUpperCase();

      let x = i % Board.BOARD_COL;
      let y = Math.floor(i / Board.BOARD_COL);
      x = this.state.horizontalPadding + x * this.state.cellWidth;
      y = this.state.verticalPadding + y * this.state.cellHeight;

      if (this.state.isFlipped) {
        y = boardHeight - y;
      }

      pieces.push(
      <React.Fragment>
        <Piece x={x} y={y} type={type} isRed={isRed}/>
      </React.Fragment>
      )
    }

    this._boardColor.setColor(this.state.boardColor);
    this._padColor.setColor(this.state.padColor);
    this._lineColor.setColor(this.state.lineColor);
    let str = this._padColor.toString();

    let boardStyle: React.CSSProperties = {
      position: 'relative',
      width: boardWidth,
      height: boardHeight,
      background: this._padColor.toString()
    }

    return (
      <div style={boardStyle}>
        <canvas ref={c => this._canvasInit(c)}/>
        <div>
          {pieces}
        </div>
      </div>
    );
  }

  private _canvasInit(canvas: HTMLCanvasElement | null) {
    if (canvas === null) 
      return;

    
  }
}

/**
 * Note:
 * - Black is lowercase
 * - Red is uppercase
 */