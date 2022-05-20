import * as React from "react";
import { StringUtils } from "../../utils/StringUtils";
import { BgCanvas, IBgCanvasProps, IBgCanvasStates } from "./BgCanvas";
import { BoardBase, BoardConst } from "./BoardBase";
import Overlay, {
  IOverlayProps,
  IOverlayStates,
  SelectionEvent,
} from "./Overlay";
import Piece, { PieceType } from "./Piece";
import { Board as BoardLogic } from "../common/Board";

export interface IBoardProps extends IBgCanvasProps, IOverlayProps {
  board: string;

  pieceSize: number;
  onMove: (moveStr: string, unlockClb: (oMoveStr: string) => void) => void;

  isPlayerRed: boolean;
  isEndGame: boolean;
  useImage: boolean;
}

export interface IBoardState extends IBgCanvasStates, IOverlayStates {
  board: string;

  pieceSize: number;

  isPlayerRed: boolean;
  isEndGame: boolean;
}

export default class Board extends BoardBase<IBoardProps, IBoardState> {
  public static readonly BOARD_STR =
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

  // This board is for constant change, the state board is only for removing/adding pieces

  private _isRedTurn = true;
  private _board: BoardLogic = BoardLogic.getInstance();
  public get board(): string {
    return this._board.getBoard();
  }
  public set board(value) {
    this._board.setBoard(value);
    this.setState({
      board: this._board.getBoard(),
    });
  }

  private _pieceCollection: Piece[] = [];
  private _bg: BgCanvas | null = null;
  private _overlay: Overlay | null = null;

  constructor(props: IBoardProps) {
    super(props);

    this.state = {
      ...this.props,
    };

    this._isRedTurn = true;
    this._board.setBoard(this.state.board);
  }

  public render() {
    let pieces: JSX.Element[] = this._createPieces();

    let boardStyle: React.CSSProperties = {
      position: "relative",
      width: BoardBase.boardWidth,
      height: BoardBase.boardHeight,
      transform: `scale(1, ${!this.props.isPlayerRed ? "-1" : "1"})`,
    };

    let playArea: React.CSSProperties = {
      position: "absolute",
      top: this.state.verticalPadding,
      left: this.state.horizontalPadding,
      width: BoardBase.playAreaWidth,
      height: BoardBase.playAreaHeight,
    };

    let bg = React.createElement(BgCanvas, {
      ...this.state,
      key: "background",
      ref: (c) => {
        this._bg = c;
      },
    });

    let overlay = React.createElement(Overlay, {
      ...this.state,
      key: "overlay",
      ref: (o) => {
        this._overlay = o;
        if (o && !this.state.isPlayerRed) {
          this.props.onMove("", this._unlock);
        }
      },
    });

    return (
      <div style={boardStyle}>
        {bg}
        <div key={"playArea"} style={playArea}>
          {pieces}
        </div>
        {overlay}
      </div>
    );
  }

  public Restart() {
    this._board.setBoard(Board.BOARD_STR);
    this._isRedTurn = true;
  }

  public EndMove(moveStr: string) {
    this._handleOtherMoveStr(moveStr);
    this.setState({
      isEndGame: true
    })
  }

  public Undo(undoData: string, board: string) {
    var arr = undoData.split(" ");
    this._handleOtherMoveStr(arr[0]);
    this._handleOtherMoveStr(arr[1]);

    var timer = setInterval(() => {
      this.board = board;
      clearInterval(timer);
    }, 0.5 * 1000);
  }

  private _createPieces(): JSX.Element[] {
    let pieces: JSX.Element[] = [];
    this._pieceCollection = [];

    for (let i = 0; i < this.state.board.length; i++) {
      let char = this.state.board[i];
      if (char === PieceType.Empty) continue;

      let type: PieceType = char.toLowerCase() as PieceType;
      let isRed = char === char.toUpperCase();

      let col = i % BoardConst.BOARD_COL;
      let row = Math.floor(i / BoardConst.BOARD_COL);

      pieces.push(
        React.createElement(Piece, {
          key: i,
          x: col,
          y: row,
          isFlipped: !this.props.isPlayerRed,
          size: this.state.pieceSize,
          type: type,
          isRed: isRed,
          useImage: this.props.useImage,
          ref: c => {
            if (c !== null) {
              this._pieceCollection.push(c);
            }
          },
          onMouseDown: this._selectPiece,
        })
      );
    }

    return pieces;
  }

  private _selectPiece = (piece: Piece) => {
    // Send the string to the server to check for valid path,
    // Send format: xy
    // Receive format: pos1/pos2/pos3/pos4/.. Each pos is just x and y and each is 1 digit
    // Maybe should just check the move ourself

    if (
      !this.state.isEndGame &&
      this._overlay &&
      (this.state.isPlayerRed ? this._isRedTurn : !this._isRedTurn) &&
      (piece.state.isRed ? this.state.isPlayerRed : !this.state.isPlayerRed)
    ) {
      this._overlay.show(piece, (x, y, e) => {
        let moveString = this._movePiece(piece, x, y, e);
        if (this._overlay) this._overlay.hide();
        if (moveString !== "") {
          this._isRedTurn = !this._isRedTurn;
          this.props.onMove(moveString, this._unlock);
        }
      });
    }
  };

  private _unlock = (moveStr: String) => {
    this._handleOtherMoveStr(moveStr);
    this._isRedTurn = !this._isRedTurn;
  };

  private _handleOtherMoveStr(oMoveStr: String) {
    let oldX = Number.parseInt(oMoveStr[0]);
    let oldY = Number.parseInt(oMoveStr[1]);

    let newX = Number.parseInt(oMoveStr[3]);
    let newY = Number.parseInt(oMoveStr[4]);

    // Get the correct piece and simulate player moving piece
    for (let i = 0; i < this._pieceCollection.length; i++) {
      let pieceI = this._pieceCollection[i];
      if (pieceI.state.x === oldX && pieceI.state.y === oldY) {
        this._movePiece(pieceI, newX, newY, SelectionEvent.Selected);
        break;
      }
    }
  }

  private _movePiece(piece: Piece, x: number, y: number, e: SelectionEvent) {
    if (e === SelectionEvent.Canceled) {
      if (this._overlay) this._overlay.hide();
      return "";
    }
    piece.zIndex = 1;

    // Send the selected move to the server, server reply whether it is ok or not. Format `{x}{y}{toX}{toY}`

    // This is assuming that the server said ok.
    // Maybe not rerendering but just move the piece by playing animation.
    // The state.board is just for reloading the board.

    let oldIndex = piece.state.x + piece.state.y * BoardConst.BOARD_COL;
    let newIndex = x + y * BoardConst.BOARD_COL;

    let pieceChar = piece.state.isRed
      ? piece.state.type.toUpperCase()
      : piece.state.type.toLowerCase();
    let moveString = `${piece.state.x}${piece.state.y}${pieceChar}${x}${y}`;

    // Don't care if it's valid move or not because the UI should have done all the check, if the client change the
    // JS then it's their problem.
    // But will lock the ui until the other player move

    this._board.setBoard(
      StringUtils.replaceCharAt(
        this._board.getBoard(),
        this._board.getBoard()[oldIndex],
        newIndex
      )
    );
    this._board.setBoard(
      StringUtils.replaceCharAt(
        this._board.getBoard(),
        PieceType.Empty,
        oldIndex
      )
    );

    // To tell react that it needs to delete the old piece and not the new one.
    let midStepBoard = StringUtils.replaceCharAt(
      this._board.getBoard(),
      PieceType.Empty,
      newIndex
    );

    piece.MoveTo(x, y, 0.25, () => {
      this.setState({ board: midStepBoard });
      this.setState({ board: this._board.getBoard() });
      piece.zIndex = 0;
    });

    return moveString;
  }
}

/**
 * Note:
 * - Black is lowercase
 * - Red is uppercase
 */
