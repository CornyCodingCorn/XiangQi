import * as React from "react";
import Board from "../../gameplay/components/Board";
import { LobbyMessage } from "../dto/LobbyMessage";
import { LobbyService } from "../services/LobbyService";
import "./GamePlay.css"

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
  const [board, setBoard] = React.useState(Board.BOARD_STR);
  const [isPlayerRed, setIsPlayerRed] = React.useState(LobbyService.isPlayerRed);

  let unlockClb: ((oMoveStr: string) => void) | undefined;  
  const onMove = (moveStr: string, unlock: (oMoveStr: string) => void) => {
    // moveStr == "" mean the player is black
    unlockClb = unlock;
    if (moveStr === "") {
      return;
    }
    LobbyService.Move(moveStr);
  };
  
  React.useEffect(() => {
    let onMoveClb = (message: LobbyMessage) => {
      if (unlockClb == null || !message.data) return;
      unlockClb(message.data);
    }

    LobbyService.onLobbyMoveReceive.addCallback(onMoveClb);
    return () => {
      LobbyService.onLobbyMoveReceive.removeCallback(onMoveClb);
    }
  }, [])

  let boardComponent = React.createElement(Board, {
    onMove: onMove,
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
    isPlayerRed: isPlayerRed,
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
    cellHeight: CELL_SIZE,
  });

  return (
    <div className="container h-100">
      <div className="row h-100">
        <div className="col-xl-8 d-flex justify-content-center h-100 align-content-center">
          <div className="board-div align-self-center">
            {boardComponent}
          </div>
        </div>
        <div className="col-xl-4 h-100 d-flex">
          <div className="card card-body rounded-3 my-5"></div>
        </div>
      </div>
    </div>
  );
}
