import { Piece, PieceType } from "./Piece";

// This is just to store information without any logic
export class BoardInfo {
  protected _board: string = "";
  public setBoard(value: string) { // >:V this doesn't count as logic, don't quote me!!!
    this._board = value;
  }
  public getBoard() {
    return this._board;
  }

  public horses: Piece[] = [];
  public canons: Piece[] = [];
  public advisors: Piece[] = [];
  public elephants: Piece[] = [];
  public pawns: Piece[] = [];
  public rooks: Piece[] = [];

  public blackKing: Piece = new Piece();
  public redKing: Piece = new Piece();
}

export class Board extends BoardInfo {
  private static _instance: Board | null = null;
  public static getInstance() {
    if (!Board._instance) {
      Board._instance = new Board();
    }
    return Board._instance;
  }

  public override setBoard(value: string) {
    this._board = value;
    this._findAllPieces();
  }
  public override getBoard() {
    return this._board;
  }

  public getInfoOfOneSide(isRed: boolean): BoardInfo {
    let board = new BoardInfo();

    board.horses = this._extractPieceByType(this.horses, isRed);
    board.rooks  = this._extractPieceByType(this.rooks, isRed);
    board.pawns  = this._extractPieceByType(this.pawns, isRed);
    board.canons = this._extractPieceByType(this.canons, isRed);
    board.advisors = this._extractPieceByType(this.advisors, isRed);
    board.elephants = this._extractPieceByType(this.elephants, isRed);

    board.blackKing = this.blackKing;
    board.redKing = this.redKing;

    return board;
  }

  private _extractPieceByType(pieces: Piece[], isRed: boolean): Piece[] {
    let result: Piece[] = [];
    pieces.forEach((value) => {
      if (value.isRed === isRed) result.push(value);
    })
  
    return result;
  }

  private _findAllPieces() {
    for (let i = 0; i < this._board.length; i++) {
      let char = this._board[i];
      let type = char.toLocaleLowerCase() as PieceType;
  
      // Ignore empty and same color
      if (type === PieceType.Empty) continue;
  
      let piece = Piece.getPieceObject(this._board, i);
      switch(type) {
        case PieceType.Cannon:
          this.canons.push(piece);
          break;
        case PieceType.Horse:
          this.horses.push(piece);
          break;
        case PieceType.Rook:
          this.rooks.push(piece);
          break;
        case PieceType.Pawn:
          this.pawns.push(piece);
          break;
        case PieceType.Advisor:
          this.advisors.push(piece);
          break;
        case PieceType.Elephant:
          this.elephants.push(piece);
          break;
        case PieceType.King:
          if (char.toLocaleLowerCase() === char) {
            this.blackKing = piece;
          } else {
            this.redKing = piece;
          }
          break;
      }
    }
  }
}