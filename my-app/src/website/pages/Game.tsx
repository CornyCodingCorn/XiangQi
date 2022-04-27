import * as React from "react";
import Board from "../../gameplay/components/Board";

const BOARD_COLOR = 0xefcc8b;
const PAD_COLOR = 0x724726;
const OUTER_PAD_COLOR = 0x522706;
const LINE_COLOR = 0x933a1b;
const LINE_MARK_COLOR = 0x0077ff;
const LINE_MARK_OVER_ENEMY_COLOR = 0x55dd55;
const LINE_THICKNESS = 4;
const PADDING = 46;
const PIECE_SIZE = 64;
const CELL_SIZE = 70;

export interface IGamePlayProps {}

export function GamePlay(props: IGamePlayProps) {
  const [board, setBoard] = React.useState("");

  let boardComponent = React.createElement(Board, {
    board: board,
    moveCircleRadius: 2,
    moveString: "",
    moveLineWidth: LINE_THICKNESS,
    moveLineColor: LINE_MARK_COLOR,
    moveLineOverEnemyColor: LINE_MARK_OVER_ENEMY_COLOR,
    moveLineAlpha: 1,
    moveLineLength: 6,
    moveVisible: false,
    moveWidth: PIECE_SIZE,
    moveHeight: PIECE_SIZE,
    moveSpace: 14,
    isFlipped: false,
    lineThickness: LINE_THICKNESS,
    lineOpacity: 0.8,
    boardColor: BOARD_COLOR,
    padColor: PAD_COLOR,
    outerPadColor: OUTER_PAD_COLOR,
    outerPadPercentage: 0.15,
    lineColor: LINE_COLOR,
    horizontalPadding: PADDING,
    verticalPadding: PADDING,
    pieceSize: PIECE_SIZE,
    cellWidth: CELL_SIZE,
    cellHeight: CELL_SIZE
  });

  return (
    <div className="container">
      {boardComponent}
      <button className="btn-primary" onClick={function () {setBoard(Board.BOARD_STR)}}/>
    </div>
  );
}
