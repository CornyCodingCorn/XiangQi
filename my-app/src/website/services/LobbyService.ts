import { StompSubscription } from "@stomp/stompjs";
import urlJoin from "url-join";
import EventHandler from "../../utils/EventHandler";
import { Log } from "../../utils/Log";
import { AppAxios } from "../configurations/axiosConfig";
import { LobbyDto } from "../dto/LobbyDto";
import { LobbyMessage, LobbyMessageType } from "../dto/LobbyMessage";
import ResponseObject from "../dto/ResponseObject";
import AuthenticationService from "./AuthenticationService";
import {
  LOBBIES_URL,
  LOBBIES_WS_LOBBIES_BROKER,
  LOBBIES_WS_LOBBY_MESSAGE,
} from "./LobbiesService";
import { WebSocketService } from "./WebsocketService";

export interface LobbyInfo {
  lobbyID: string;

  player1: string;
  player2: string;

  player1Ready: boolean;
  player2Ready: boolean;
}

export class LobbyService {
  private static _lobbySubscription: StompSubscription;

  private static _lobbyID = "";
  public static get lobbyID() {
    return this._lobbyID;
  }

  private static _player1 = "";
  public static get player1() {
    return LobbyService._player1;
  }
  private static _player2 = "";
  public static get player2() {
    return LobbyService._player2;
  }

  private static _player1Ready = false;
  public static get player1Ready() {
    return LobbyService._player1Ready;
  }
  private static _player2Ready = false;
  public static get player2Ready() {
    return LobbyService._player2Ready;
  }

  private static _isPlayer1Red = true;
  public static get isPlayer1Red() {
    return LobbyService._isPlayer1Red;
  }
  private static _message: string[] = [];
  public static get message(): string[] {
    return LobbyService._message;
  }

  public static get lobbyInfo(): LobbyInfo {
    return {
      lobbyID: this.lobbyID,

      player1: this.player1,
      player2: this.player2,

      player1Ready: this.player1Ready,
      player2Ready: this.player2Ready,
    };
  }

  public static readonly onLobbyInfoChanged = new EventHandler<
    LobbyMessageType
  >();

  public static Ready(): void {
    let message: LobbyMessage = {
      player: AuthenticationService.playerInfo!.username,
      type: LobbyMessageType.CHANGE_READY,
    };

    WebSocketService.stompClient!.publish({
      destination: urlJoin(LOBBIES_WS_LOBBY_MESSAGE, this.lobbyInfo.lobbyID),
      body: JSON.stringify(message),
    });
  }

  public static Move(moveStr: string, callback?: (err?: Error) => void) {}

  public static Join(
    lobbyID: string,
    callback?: (err?: Error, lobby?: LobbyDto) => void
  ) {
    AppAxios.put(`${LOBBIES_URL}?id=${lobbyID}`)
      .then((res) => {
        let resObj: ResponseObject<LobbyDto> = res.data;
        this.SubscribeToLobby(resObj.data);

        if (callback) callback(undefined, resObj.data);
      })
      .catch((err) => {
        if (callback) callback(err, undefined);
      });
  }

  //Subscribe to lobby with id
  public static SubscribeToLobby(lobby: LobbyDto) {
    // Make sure to update the lobby info;
    this.SetInfo(lobby);
    this.UnsubscribeToLobby();

    this.onLobbyInfoChanged.invoke(LobbyMessageType.JOIN);
    WebSocketService.onReply.addCallback(this.OnServerReply);

    this._lobbySubscription = WebSocketService.stompClient!.subscribe(
      urlJoin(LOBBIES_WS_LOBBIES_BROKER, lobby.id),
      (message) => {
        let lobbyMessage: LobbyMessage = JSON.parse(message.body);
        let validMessage = true;
        if (lobbyMessage.lobby) this.SetInfo(lobbyMessage.lobby);

        switch (lobbyMessage.type) {
          case LobbyMessageType.CHANGE_READY:
            if (!lobbyMessage.lobby) validMessage = false;
            break;
          case LobbyMessageType.DISCONNECT:
            if (!lobbyMessage.lobby) validMessage = false;
            break;
          case LobbyMessageType.JOIN:
            if (!lobbyMessage.lobby) validMessage = false;
            break;
          case LobbyMessageType.MOVE:
            break;
          case LobbyMessageType.START:
            // Need to thing more about this
            break;
          default:
            validMessage = false;
            break;
        }
        if (validMessage) this.onLobbyInfoChanged.invoke(lobbyMessage.type);
      }
    );
  }

  public static UnsubscribeToLobby() {
    if (this._lobbySubscription) this._lobbySubscription.unsubscribe();
    WebSocketService.onReply.removeCallback(this.OnServerReply);
  }

  private static SetInfo(lobby: LobbyDto) {
    this._lobbyID = lobby.id;

    this._player1 = lobby.player1;
    this._player2 = lobby.player2;

    this._player1Ready = lobby.player1Ready;
    this._player2Ready = lobby.player2Ready;

    this._isPlayer1Red = lobby.player1 === lobby.redPlayer;
  }

  private static OnServerReply = (response: ResponseObject<any>) => {
    if (response.status >= 300) {
      Log.error("WS_ERROR", JSON.stringify(response, null, 2))
    }
    else {
      Log.log("WS_LOG", JSON.stringify(response, null, 2));
    }
  }
}
