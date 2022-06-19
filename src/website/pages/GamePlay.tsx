import * as React from "react";
import { useNavigate } from "react-router-dom";
import Board from "../../gameplay/components/Board";
import * as BoardComponent from "../../gameplay/common/Board";
import { PieceType } from "../../gameplay/common/Piece";
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
  LobbyMessageUndoType,
} from "../dto/LobbyMessage";
import AuthenticationService from "../services/AuthenticationService";
import { LobbyService } from "../services/LobbyService";
import "./GamePlay.css";
import { BoardConst } from "../../gameplay/components/BoardBase";
import { SelectionEvent } from "../../gameplay/components/Overlay";
import PlayerDto from "../dto/PlayerDto";
import { GetPlayerProfile } from "../../resources/profiles";

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
function addMove(list: string[], moveStr: string) {
  if (moveStr === "") return list;
  return [...list, `${moveStr} ${boardRef.board}`];
}
// Start counting the time until random move
var playerClock: NodeJS.Timer;
function clearPlayerClock() {
  clearInterval(playerClock);
}
function startPlayerClock() {
  const t = LobbyService.lobbyInfo.setting.minPerTurn;
  const isRed =  LobbyService.isPlayerRed;

  clearPlayerClock()
  playerClock = setInterval(() => {
    const boardStr = boardRef.board;
    let type = PieceType.Empty;
    for (let i = 0; i < boardStr.length; i++) {
      if (boardStr[i] != PieceType.Empty) {
        if (isRed ? boardStr[i].toUpperCase() !== boardStr[i] : boardStr[i].toLowerCase() !== boardStr[i]) continue;

        type = boardStr[i].toLowerCase() as PieceType;
        const x = i % BoardConst.BOARD_COL;
        const y = Math.floor(i / BoardConst.BOARD_COL);
        let moves = BoardComponent.Board.generateMove(type, x, y, isRed);
        if (moves === "") continue;

        const arr = moves.split("/");
        const move = arr[Math.floor(Math.random() * (arr.length - 1))];
        const moveX = Number.parseInt(move[0]);
        const moveY = Number.parseInt(move[1]);
        const piece = boardRef.getPieceAt(x, y);
        if (!piece || piece.props.isRed !== isRed) continue;
        
        boardRef.movePiece(piece, moveX, moveY, SelectionEvent.Selected);
        break;
      }
    }

    clearPlayerClock()
  }, t * 1000 * 60);
}

export interface IGamePlayProps {}
export interface IUndoState {
  show: boolean;
  isRequest: boolean;
  refused: boolean;
  waiting: boolean;
}

export function GamePlay(props: IGamePlayProps) {
  const navigate = useNavigate();
  const [, setInfo] = React.useState(LobbyService.lobbyInfo);
  const [board /**setBoard**/] = React.useState(LobbyService.board);
  const [isPlayerTurn, setIsPlayerTurn] = React.useState(false);
  const [isGameEnd, setIsGameEnd] = React.useState(false);
  const [useImage, setUseIcon] = React.useState(false);
  const [isOtherPlayAgain, setOtherPlayAgain] = React.useState(false);
  const [undoState, setUndoState] = React.useState<IUndoState>({
    show: false,
    isRequest: false,
    refused: false,
    waiting: false,
  });
  const [isPlayerRed, setIsPlayerRed] = React.useState(
    LobbyService.isPlayerRed
  );
  const [moveList, setMoveList] = React.useState<string[]>([]);
  const [isPlayAgain, setPlayAgain] = React.useState(false);
  const [reload, setReload] = React.useState(0);
  const [players, setPlayers] = React.useState<(PlayerDto | undefined)[]>([]);

  if (moveList.length == 0 && isPlayerRed) startPlayerClock();
  const onMove = (moveStr: string, unlock: (oMoveStr: string) => void) => {
    unlockClb = unlock;
    // moveStr == "" mean the player is black
    if (moveStr === "") {
      return;
    }

    // On move remove the buttons.
    setMoveList((list) => addMove(list, moveStr));
    setUndoState({
      ...undoState,
      show: false,
    });

    setIsPlayerTurn(!isPlayerTurn);
    LobbyService.Move(moveStr);

    // Remove player clock;
    clearPlayerClock();
  };
  const sendUndoRequest = () => {
    // Request an undo
    if (moveList.length < 2) return;

    LobbyService.RequestUndo();
    setUndoState({
      show: true,
      isRequest: false,
      refused: false,
      waiting: true,
    });
  };
  // On button clicks
  const replyToRequest: React.MouseEventHandler<HTMLButtonElement> = (c) => {
    LobbyService.ReplyUndo(c.currentTarget.id === "undo-btn-accept");
    setUndoState({
      show: false,
      isRequest: false,
      refused: false,
      waiting: false,
    });
  };
  const sendPlayAgainRequest = () => {
    LobbyService.PlayAgain();
    setPlayAgain((b) => !b);
  };

  React.useEffect(() => {
    // This is to unload the board then reload it because it like managing legacy codes,
    // Just gotta take it out a blow it.
    if (reload % 2 !== 0) setReload((v) => v + 1);
  }, [reload]);
  React.useEffect(() => {
    if (LobbyService.isPlayerRed) setIsPlayerTurn((i) => !i);
    let onMoveClb = (message: LobbyMessage) => {
      if (unlockClb == null || !message.data) return;

      setIsPlayerTurn((i) => !i);
      unlockClb(message.data);
      setMoveList((list) => addMove(list, message.data!));

      // Start the clock count down;
      startPlayerClock();
    };

    const requestPlayAgain = () => {
      setOtherPlayAgain((v) => !v);
    };
    const restart = () => {
      setReload((v) => v + 1);
      setIsPlayerRed((red) => {
        setIsPlayerTurn(!red);
        return !red;
      });
      setUndoState({
        show: false,
        isRequest: false,
        refused: false,
        waiting: false,
      });
      setOtherPlayAgain(false);
      setIsGameEnd(false);
      setPlayAgain(false);
      setMoveList([]);
    };
    const onWinOrDraw = (message: LobbyMessage) => {
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
        clearPlayerClock();
      }
    };
    const undoReceiveReply = (message: LobbyMessage) => {
      if (message.player === AuthenticationService.playerInfo!.username) {
        setUndoState({
          show: false,
          isRequest: false,
          refused: false,
          waiting: false,
        });

        return;
      }

      const isAccepted = message.data === LobbyMessageUndoType.ACCEPTED;

      // We won't do anything here this message is just to let the client know that the other player
      // has accepted their request, the real undo request will be sent with UNDO type.
      setUndoState({
        show: true,
        isRequest: false,
        refused: !isAccepted,
        waiting: false,
      });
    };
    const receiveUndoRequest = () => {
      setUndoState({
        show: true,
        isRequest: true,
        refused: false,
        waiting: false,
      });
    };
    // Actually moving pieces.
    const undoReceive = (message: LobbyMessage) => {
      // The actual undo message that will contain all the undo data.
      setMoveList((list) => {
        var newList = list.slice(0, list.length - 2);

        boardRef.Undo(
          message.data!,
          newList.length === 0
            ? board
            : newList[newList.length - 1].split(" ")[1]
        );

        if (isPlayerTurn) {
          startPlayerClock();
        }
        return newList;
      });
    };
    const onLobbyInfoUpdate = () => {
      setInfo(() => LobbyService.lobbyInfo);
    }
    const playerInfoChanged = (result: (PlayerDto | undefined)[]) => {
      setPlayers(result);
    }

    LobbyService.onLobbyUndoRequestReceive.addCallback(receiveUndoRequest);
    LobbyService.onLobbyUndoReplyReceive.addCallback(undoReceiveReply);
    LobbyService.onLobbyMoveReceive.addCallback(onMoveClb);
    LobbyService.onLobbyUndo.addCallback(undoReceive);

    LobbyService.onLobbyInfoChanged.addCallback(onLobbyInfoUpdate);

    LobbyService.onLobbyEndReceive.addCallback(onWinOrDraw);
    LobbyService.onRestart.addCallback(restart);
    LobbyService.onRequestPlayAgain.addCallback(requestPlayAgain);

    LobbyService.onLobbyPlayerChanged.addCallback(playerInfoChanged);

    return () => {
      LobbyService.onLobbyUndoRequestReceive.removeCallback(receiveUndoRequest);
      LobbyService.onLobbyUndoReplyReceive.removeCallback(undoReceiveReply);
      LobbyService.onLobbyMoveReceive.removeCallback(onMoveClb);
      LobbyService.onLobbyUndo.removeCallback(undoReceive);

      LobbyService.onLobbyInfoChanged.removeCallback(onLobbyInfoUpdate);

      LobbyService.onLobbyEndReceive.removeCallback(onWinOrDraw);
      LobbyService.onRestart.addCallback(restart);
      LobbyService.onRequestPlayAgain.removeCallback(requestPlayAgain);

      LobbyService.onLobbyPlayerChanged.removeCallback(playerInfoChanged);
    };
  }, [board]);

  const boardComponent = React.createElement(Board, {
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
      if (c) boardRef = c as Board;
    },
  });

  let player = AuthenticationService.playerInfo!.username;
  let lobbyInfo = LobbyService.lobbyInfo;
  let otherPlayer =
    lobbyInfo.player1 === player ? lobbyInfo.player2 : lobbyInfo.player1;

  let bgImage: React.CSSProperties = {
    backgroundImage: `url(${isPlayerRed ? gameplayBgRed : gameplayBgBlack})`,
    backgroundSize: "cover",
  };
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

  const undoComponent = (
    <div className={`container row undo-div w-100`}>
      <div
        className="card card-body d-flex flex-column my-3"
        style={{ height: "100px" }}
      >
        {undoState.show ? (
          <>
            {undoState.isRequest ? (
              <>
                <span style={{ textAlign: "center" }}>
                  Player is asking for an undo
                </span>
                <div className="d-flex flex-row justify-content-center">
                  <button
                    id="undo-btn-accept"
                    className="btn btn-success undo-btn col"
                    onClick={replyToRequest}
                  >
                    <i className="bi bi-check" /> Accept
                  </button>
                  <button
                    id="undo-btn-refuse"
                    className="btn btn-danger undo-btn col"
                    onClick={replyToRequest}
                  >
                    <i className="bi bi-x" /> Refuse
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "grid",
                  justifyItems: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {undoState.waiting
                  ? `Waiting for response...`
                  : `Your undo request is ${
                      undoState.refused ? "refused" : "accepted"
                    }`}
              </div>
            )}
          </>
        ) : undefined}
      </div>
    </div>
  );
  const controlBtnComponent = (
    <div className="container row align-content-center justify-content-center w-100 ctl-btn-div">
      <button
        className="btn btn-primary ctl-btn col"
        onClick={sendUndoRequest}
        disabled={
          !isPlayerTurn ||
          (undoState.show && undoState.refused) ||
          moveList.length < 2
        }
      >
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
  );
  const listItems = (
    <>
      {moveList.map((moveString, index) =>
        moveString !== "" ? (
          <li
            key={index}
            className="list-group-item"
            style={{
              color:
                moveString[2].toLowerCase() !== moveString[2] ? "red" : "black",
            }}
          >
            <span className="fw-bold">{moveString[2]}</span>
            {` : ${moveString[0]}, ${moveString[1]} ➜ ${moveString[3]}, ${moveString[4]}`}
          </li>
        ) : undefined
      )}
    </>
  );

  if (!LobbyService.isPlaying) {
    return <></>
  }


  const playerDto = players[0] && players[0].username === player ? players[0] : players[1];
  const oPlayerDto = players[0] === playerDto ? players[1] : players[0];
  return (
    <div className="h-100" style={bgImage}>
      <div className="container h-100">
        <div className="row h-100">
          <div className="col-xl-8 d-flex justify-content-center h-100 align-content-center">
            <div className="board-div align-self-center">
              {reload % 2 === 0 ? boardComponent : undefined}
            </div>
          </div>
          <div className="d-flex flex-column col-xl-4 h-100">
            <div className="card card-body rounded-3 my-5">
              <div id="move-list-div">
                <ul id="move-list" className="list-group">
                  {listItems}
                </ul>
              </div>
              <div key={"other-player"} style={infoTop} className="mx-3 my-3">
                <PlayerInfo
                  playerName={otherPlayer}
                  imageURL={oPlayerDto ? GetPlayerProfile(oPlayerDto.profile) : ""}
                  isPlayerTurn={!isPlayerTurn}
                  height={75}
                  isPlayAgain={isOtherPlayAgain}
                  profileSize={60}
                  isRed={!LobbyService.isPlayerRed}
                />
                {undoComponent}
              </div>
              <div key={"player"} style={infoBottom} className="mx-3 my-3">
                {controlBtnComponent}
                <PlayerInfo
                  playerName={player}
                  imageURL={playerDto ? GetPlayerProfile(playerDto.profile) : ""}
                  isPlayerTurn={isPlayerTurn}
                  height={75}
                  isPlayAgain={false}
                  profileSize={60}
                  isRed={LobbyService.isPlayerRed}
                />
              </div>
            </div>
          </div>
          <dialog className="overlay" open={isGameEnd}>
            <div className="end-game-card">
              <div
                key={"top"}
                className={`end-game-top ${getStateClassName()}`}
              >
                <h1 className="fw-bold text-center mt-3 text-white">
                  {getStateString()}
                </h1>
              </div>
              <div className={`${getStateClassName()}`} style={{
                border: `5px solid ${isPlayerRed ? "red" : "black"}`,
                boxShadow: `0px 0px 20px ${isPlayerRed ? "red" : "black"}`,
                borderRadius: "10px",
                position: "absolute",
                top: "calc(50% - 120px)",
                left: "calc(50% - 100px)",
                width: "200px",
                height: "200px",
                backgroundImage: `url(${GetPlayerProfile(AuthenticationService.playerInfo!.profile)})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}>

              </div>
              <button
                className={`btn${
                  isPlayAgain ? " btn-danger" : " btn-primary"
                } btn-to-lobbies`}
                onClick={sendPlayAgainRequest}
              >
                {isPlayAgain ? "Cancel request" : "Play again"}
              </button>
              <button
                className="btn btn-primary btn-play-again"
                onClick={() => navigate("/lobbies", { replace: true })}
              >
                To lobbies
              </button>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}
