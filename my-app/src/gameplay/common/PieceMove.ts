import { BoardConst } from "../components/BoardBase";

export type generateMoveFunc = (
	board: string,
	x: number,
	y: number,
	isRed: boolean,
) => string;


export enum PieceType {
	King = "k",
	Advisor = "a",
	Elephant = "e",
	Rook = "r",
	Cannon = "c",
	Horse = "h",
	Pawn = "p",
	Empty = "0",
}

export var moveMap: Map<PieceType, generateMoveFunc> = new Map<PieceType, generateMoveFunc>();

export function generateMove(board: string, type: PieceType, x: number, y: number, isRed: boolean): string {
  let func: generateMoveFunc | undefined = moveMap.get(type);

  return (func ? func(board, x, y, isRed) : "");
}