import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Piece, PieceType } from "../../gameplay/common/Piece";
import Board from "../../gameplay/components/Board";
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

export interface IGamePlayProps {}
export interface IUndoState {
  show: boolean;
  isRequest: boolean;
  refused: boolean;
  waiting: boolean;
}

export function GamePlay(props: IGamePlayProps) {
  const navigate = useNavigate();
  const [board /**setBoard**/] = React.useState(LobbyService.board);
  const [isPlayerTurn, setIsPlayerTurn] = React.useState(false);
  const [isGameEnd, setIsGameEnd] = React.useState(false);
  const [useImage, setUseIcon] = React.useState(false);
  const [undoState, setUndoState] = React.useState<IUndoState>({
    show: false,
    isRequest: false,
    refused: false,
    waiting: false,
  });
  const [isPlayerRed /**setIsPlayerRed**/] = React.useState(
    LobbyService.isPlayerRed
  );
  const [moveList, setMoveList] = React.useState<string[]>([]);

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

  React.useEffect(() => {
    if (LobbyService.isPlayerRed) setIsPlayerTurn((i) => !i);
    let onMoveClb = (message: LobbyMessage) => {
      if (unlockClb == null || !message.data) return;

      setIsPlayerTurn((i) => !i);
      unlockClb(message.data);
      setMoveList((list) => addMove(list, message.data!));
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
        return newList;
      });
    };

    LobbyService.onLobbyUndoRequestReceive.addCallback(receiveUndoRequest);
    LobbyService.onLobbyUndoReplyReceive.addCallback(undoReceiveReply);
    LobbyService.onLobbyMoveReceive.addCallback(onMoveClb);
    LobbyService.onLobbyUndo.addCallback(undoReceive);
    LobbyService.onLobbyEndReceive.addCallback(onWinOrDraw);

    return () => {
      LobbyService.onLobbyUndoRequestReceive.removeCallback(receiveUndoRequest);
      LobbyService.onLobbyUndoReplyReceive.removeCallback(undoReceiveReply);
      LobbyService.onLobbyMoveReceive.removeCallback(onMoveClb);
      LobbyService.onLobbyUndo.removeCallback(undoReceive);
      LobbyService.onLobbyEndReceive.removeCallback(onWinOrDraw);
    };
  }, []);

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
      boardRef = c as Board;
    },
  });

  let player = AuthenticationService.playerInfo!.username;
  let lobbyInfo = LobbyService.lobbyInfo;
  let otherPlayer =
    lobbyInfo.player1 === player ? lobbyInfo.player2 : lobbyInfo.player1;
  otherPlayer = otherPlayer ? otherPlayer : "#Disconnected";

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

  return (
    <div className="h-100" style={bgImage}>
      <div className="container h-100">
        <div className="row h-100">
          <div className="col-xl-8 d-flex justify-content-center h-100 align-content-center">
            <div className="board-div align-self-center">{boardComponent}</div>
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
                  imageURL={"test"}
                  isPlayerTurn={!isPlayerTurn}
                  height={75}
                  profileSize={60}
                  isRed={!LobbyService.isPlayerRed}
                />
                {undoComponent}
              </div>
              <div key={"player"} style={infoBottom} className="mx-3 my-3">
                {controlBtnComponent}
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
