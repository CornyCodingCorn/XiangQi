import * as React from 'react';
import Color from '../utils/Color';
import UtilsColor from '../utils/Color';
import { getEnumFromStr } from '../utils/enum';
import { BgCanvas, IBgCanvasProps, IBgCanvasStates } from './BgCanvas';
import { BoardBase, BoardConst } from './common/BoardBase';
import Piece, { PieceType } from './Piece';

export interface IBoardProps extends IBgCanvasProps {
  boardFEN?: string;

  pieceSize?: number;

  isFlipped?: boolean;
}

export interface IBoardState extends IBgCanvasStates {
  board: string;

  pieceSize: number;

  isFlipped: boolean;
}

export default class Board extends BoardBase<IBoardProps, IBoardState> {
  private static readonly BOARD_NEW_FEN = "";

  private _pieceCollection: Piece[] = [];
  private _bg: BgCanvas | null = null;

  constructor(props: IBoardProps) {
    super(props);

    this.state = {
      ...this.state,
      board: "",
      isFlipped: this.props.isFlipped || false,
      pieceSize: this.props.pieceSize || Piece.DEFAULT_SIZE
    }
  }

  public componentWillUnmount() {
    
  }
  public componentDidMount() {
    this._createBoard("");
  }
  
  public render() {
    let pieces:JSX.Element[] = this._createPieces();

    let boardStyle: React.CSSProperties = {
      position: 'relative',
      width: BoardBase.boardWidth,
      height: BoardBase.boardHeight,
    }

    let playArea: React.CSSProperties = {
      position: 'absolute',
      top: this.state.verticalPadding,
      left: this.state.horizontalPadding,
      width: BoardBase.playAreaWidth,
      height: BoardBase.playAreaHeight
    }

    let bg = React.createElement(BgCanvas, {
      ...this.props,
      key: 'background',
      ref: (c) => {this._bg = c}
    });

    return (
      <div style={boardStyle}>
        {bg}
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
    if (this._bg === null) 
      return []; 

    let pieces:JSX.Element[] = [];
    this._pieceCollection = [];

    for (let i = 0; i < this.state.board.length; i++) {
      let char = this.state.board[i];
      if (char == '0')
        continue;
        
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
          onMouseDown: this._selectPiece
        })
      )
    }

    return pieces;
  }

  private _selectPiece = (piece: Piece) => {
    let index = piece.state.x + piece.state.y * BoardConst.BOARD_COL;
    let char = this.state.board[index];

    // Send the string to the server to check for valid path,
    // Send format: xchary
    // Recieve format: pos1/pos2/pos3/pos4/.. Each pos is just x and y and each is 1 digit

    let recievedStr = "";
    let validPaths = recievedStr.split("/");

    
  }

  private _addPieceToCollection = (piece: Piece | null) => {
    if (piece === null)
      return;

    this._pieceCollection.push(piece);
  }
}

/**
 * Note:
 * - Black is lowercase
 * - Red is uppercase
 */