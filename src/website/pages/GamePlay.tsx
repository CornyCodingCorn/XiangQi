import * as React from "react";
import { useNavigate } from "react-router-dom";
import Board from "../../gameplay/components/Board";
import Piece from "../../gameplay/components/Piece";
import {
  gameplayBgBlack,
  gameplayBgRed,
} from "../../resources/backgrounds/bgIndex";
import { PawnIconImage, PawnTextImage } from "../../resources/for-ui";
import PlayerInfo from "../components/PlayerInfo";
import {
  LobbyMessage,
  LobbyMessageEndType,
  LobbyMessageType,
} from "../dto/LobbyMessage";
import AuthenticationService from "../services/AuthenticationService";
import { LobbyService } from "../services/LobbyService";
import "./GamePlay.css";

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

enum State {
  WIN,
  LOST,
  DRAW,
}

let unlockClb: ((oMoveStr: string) => void) | undefined;
let boardRef: Board;

let state: State = State.DRAW;
function getStateClassName() {
  switch (state) {
    case State.DRAW:
      return "bg-warning";
    case State.LOST:
      return "bg-danger";
    case State.WIN:
      return "bg-success";
  }
}

function getStateString() {
  switch (state) {
    case State.DRAW:
      return "Draw";
    case State.LOST:
      return "Lost";
    case State.WIN:
      return "Victory";
  }
}

export interface IGamePlayProps {}

export function GamePlay(props: IGamePlayProps) {
  const navigate = useNavigate();
  const [board /**setBoard**/] = React.useState(LobbyService.board);
  const [isPlayerTurn, setIsPlayerTurn] = React.useState(false);
  const [isGameEnd, setIsGameEnd] = React.useState(false);
  const [useImage, setUseIcon] = React.useState(false);
  const [isPlayerRed /**setIsPlayerRed**/] = React.useState(
    LobbyService.isPlayerRed
  );

  const onMove = (moveStr: string, unlock: (oMoveStr: string) => void) => {
    // moveStr == "" mean the player is black
    unlockClb = unlock;
    if (moveStr === "") {
      return;
    }

    setIsPlayerTurn(!isPlayerTurn);
    LobbyService.Move(moveStr);
  };

  React.useEffect(() => {
    if (LobbyService.isPlayerRed) setIsPlayerTurn((i) => !i);
    let onMoveClb = (message: LobbyMessage) => {
      if (unlockClb == null || !message.data) return;

      setIsPlayerTurn((i) => !i);

      unlockClb(message.data);
    };

    let onWinOrDraw = (message: LobbyMessage) => {
      if (!message.data) return;

      if (message.type === LobbyMessageType.END) {
        // The format is `${WIN || DRAW} ${moveStr}`
        let arr = message.data.split(" ");
        let username = AuthenticationService.playerInfo!.username;
        switch (arr[0]) {
          case LobbyMessageEndType.WIN:
            if (message.player === username) {
              state = State.WIN;
            } else {
              // If lost then the other player must have moved
              boardRef.EndMove(arr[1]);
              state = State.LOST;
            }
            break;
          case LobbyMessageEndType.DRAW:
            state = State.DRAW;
            // If true then the draw move need to be updated
            if (message.player !== username) {
              boardRef.EndMove(arr[1]);
            }
            break;
        }

        setIsGameEnd(true);
      }
    };

    LobbyService.onLobbyEndReceive.addCallback(onWinOrDraw);
    LobbyService.onLobbyMoveReceive.addCallback(onMoveClb);
    return () => {
      LobbyService.onLobbyEndReceive.removeCallback(onWinOrDraw);
      LobbyService.onLobbyMoveReceive.removeCallback(onMoveClb);
    };
  }, []);

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
    isEndGame: false,
    useImage: useImage,
    ref: (c) => {
      boardRef = c as Board;
    },
  });

  let infoTop: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  };

  let infoBottom: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  };

  let player = AuthenticationService.playerInfo!.username;
  let lobbyInfo = LobbyService.lobbyInfo;
  let otherPlayer =
    lobbyInfo.player1 === player ? lobbyInfo.player2 : lobbyInfo.player1;
  otherPlayer = otherPlayer ? otherPlayer : "#Disconnected";

  let bgImage: React.CSSProperties = {
    backgroundImage: `url(${isPlayerRed ? gameplayBgRed : gameplayBgBlack})`,
    backgroundSize: "cover",
  };

  return (
    <div className="h-100" style={bgImage}>
      <div className="container h-100">
        <div className="row h-100">
          <div className="col-xl-8 d-flex justify-content-center h-100 align-content-center">
            <div className="board-div align-self-center">{boardComponent}</div>
          </div>
          <div className="d-flex flex-column col-xl-4 h-100">
            <div className="card card-body rounded-3 my-5">
              <div key={"other-player"} style={infoTop} className="mx-3 my-3">
                <PlayerInfo
                  playerName={otherPlayer}
                  imageURL={"test"}
                  isPlayerTurn={!isPlayerTurn}
                  height={75}
                  profileSize={60}
                  isRed={!LobbyService.isPlayerRed}
                />
              </div>
              <div id="move-list-div">
                <ul id="move-list" className="list-group">
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                  <li className="list-group-item">Test</li>
                </ul>
              </div>
              <div key={"player"} style={infoBottom} className="mx-3 my-3">
                <div className="container row align-content-center justify-content-center w-100 ctl-btn-div">
                  <button className="btn btn-primary ctl-btn col">
                    <i className="bi bi-skip-backward-fill"></i>
                  </button>
                  <button
                    className="btn btn-primary ctl-btn col"
                    onClick={() => setUseIcon(!useImage)}
                  >
                    <img
                      src={useImage ? PawnIconImage : PawnTextImage}
                      alt="button-icon"
                    ></img>
                  </button>
                  <button
                    className="btn btn-primary ctl-btn col"
                    onClick={() => LobbyService.Concede()}
                  >
                    <i className="bi bi-flag-fill"></i>
                  </button>
                </div>
                <PlayerInfo
                  playerName={player}
                  imageURL={"test"}
                  isPlayerTurn={isPlayerTurn}
                  height={75}
                  profileSize={60}
                  isRed={LobbyService.isPlayerRed}
                />
              </div>
            </div>
          </div>
          {isGameEnd ? (
            <div className="overlay">
              <div className="end-game-card">
                <div
                  key={"top"}
                  className={`end-game-top ${getStateClassName()}`}
                >
                  <h1 className="fw-bold text-center mt-3 text-white">
                    {getStateString()}
                  </h1>
                </div>
                <button className="btn btn-primary btn-play-again">
                  Play again
                </button>
                <button
                  className="btn btn-primary btn-to-lobbies"
                  onClick={() => navigate("/lobbies", { replace: true })}
                >
                  To lobbies
                </button>
              </div>
            </div>
          ) : undefined}
        </div>
      </div>
    </div>
  );
}
