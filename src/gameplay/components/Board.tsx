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
import { PlayRandomMoveClip } from "../../resources/audio/audioClip";

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
  public get isRedTurn() {
    return this._isRedTurn;
  }
  public set isRedTurn(value) {
    this._isRedTurn = value;
  }

  private _board: BoardLogic = BoardLogic.getInstance();
  public get boardLogic(): BoardLogic {
    return this._board;
  }
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
  private _onPieceAdded: ((p: Piece) => void)[] = [];

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
    this.board = Board.BOARD_STR;
    this._isRedTurn = true;
  }

  public EndMove(moveStr: string) {
    this.handleOtherMoveStr(moveStr);
    this.setState({
      isEndGame: true
    })
  }

  public UndoOnePiece(moveStr: string, board: string) {
    const undoValues = {
      oldX: Number.parseInt(moveStr[3]),
      oldY: Number.parseInt(moveStr[4]),
  
      newX: Number.parseInt(moveStr[0]),
      newY: Number.parseInt(moveStr[1]),
    }

    let piece: Piece | null = null;
    const cb = (p: Piece) => {
      if (p.state.x === undoValues.newX && p.state.y === undoValues.newY) {
        piece = p;
      }

      if (piece) {
        piece.setState({zIndex: 1});

        piece!.MoveTo(undoValues.newX, undoValues.newY, 0.25, () => {
          piece!.setState({zIndex: 0});
        }, undoValues.oldX, undoValues.oldY);
  
        this._onPieceAdded.splice(this._onPieceAdded.indexOf(cb), 1);

        // Play audio
        PlayRandomMoveClip();
      }
    }

    this._onPieceAdded.push(cb);
    let midStepBoard = StringUtils.replaceCharAt(this.board, PieceType.Empty, BoardConst.BOARD_COL * undoValues.oldY + undoValues.oldX);
    this.setState({board: midStepBoard}, () => {
      this.board = board;
    });
  }

  public Undo(undoData: string, board: string) {
    var arr = undoData.split(" ");

    const undoValues1 = {
      oldX: Number.parseInt(arr[0][0]),
      oldY: Number.parseInt(arr[0][1]),
  
      newX: Number.parseInt(arr[0][3]),
      newY: Number.parseInt(arr[0][4]),
    }
    const undoValues2 = {
      oldX: Number.parseInt(arr[1][0]),
      oldY: Number.parseInt(arr[1][1]),
  
      newX: Number.parseInt(arr[1][3]),
      newY: Number.parseInt(arr[1][4]),
    }
    
    let piece1: Piece | null = null;
    let piece2: Piece | null = null;
    const cb = (p: Piece) => {
      if (p.state.x === undoValues1.newX && p.state.y === undoValues1.newY) {
        piece1 = p
      } else if (p.state.x === undoValues2.newX && p.state.y === undoValues2.newY) {
        piece2 = p
      }

      if (piece1 && piece2) {
        piece1.setState({zIndex: 2});
        piece2.setState({zIndex: 1});

        piece1!.MoveTo(undoValues1.newX, undoValues1.newY, 0.25, () => {
          piece1!.setState({zIndex: 0});
        }, undoValues1.oldX, undoValues1.oldY);
        piece2!.MoveTo(undoValues2.newX, undoValues2.newY, 0.25, () => {
          piece2!.setState({zIndex: 0});
        }, undoValues2.oldX, undoValues2.oldY);
  
        this._onPieceAdded.splice(this._onPieceAdded.indexOf(cb), 1);
        // Play audio
        PlayRandomMoveClip();
      }
    }

    this._onPieceAdded.push(cb);
    let midStepBoard = StringUtils.replaceCharAt(this.board, PieceType.Empty, BoardConst.BOARD_COL * undoValues1.oldY + undoValues1.oldX);
    midStepBoard = StringUtils.replaceCharAt(midStepBoard, PieceType.Empty, BoardConst.BOARD_COL * undoValues2.oldY + undoValues2.oldX);
    this.setState({board: midStepBoard}, () => {
      this.board = board;
    });
  }

  public getPieceAt(x: number, y: number) {
    for (let i = 0; i < this._pieceCollection.length; i++) {
      const v = this._pieceCollection[i];
      if (v.props.x === x && v.props.y === y) return v;
    }

    return null;
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
          isPlayerRed: this.props.isPlayerRed,
          ref: c => {
            if (c !== null) {
              this._pieceCollection.push(c);
              this._onPieceAdded.forEach(v => v(c));
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
        this.movePiece(piece, x, y, e);
        if (e === SelectionEvent.Selected) {
          // Play move audio
          PlayRandomMoveClip();
        }
      });
    }
  };

  private _unlock = (moveStr: String) => {
    this.handleOtherMoveStr(moveStr);
    this._isRedTurn = !this._isRedTurn;
  };

  public handleOtherMoveStr(oMoveStr: String) {
    if (!oMoveStr) return;

    let oldX = Number.parseInt(oMoveStr[0]);
    let oldY = Number.parseInt(oMoveStr[1]);

    let newX = Number.parseInt(oMoveStr[3]);
    let newY = Number.parseInt(oMoveStr[4]);

    // Get the correct piece and simulate player moving piece
    for (let i = 0; i < this._pieceCollection.length; i++) {
      let pieceI = this._pieceCollection[i];
      if (pieceI.state.x === oldX && pieceI.state.y === oldY) {
        this._movePiece(pieceI, newX, newY, SelectionEvent.Selected);

        // Play move audio
        PlayRandomMoveClip();
        break;
      }
    }

    return {oldX, oldY, newX, newY}
  }

  public movePiece(piece: Piece, x: number, y: number, e: SelectionEvent) {
    if (this._overlay) this._overlay.hide();
    let moveString = this._movePiece(piece, x, y, e);
    if (moveString !== "") {
      this._isRedTurn = !this._isRedTurn;
      this.props.onMove(moveString, this._unlock);
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
