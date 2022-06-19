import urlJoin from "url-join";
import EventHandler from "../../utils/EventHandler";
import { AppAxios } from "../configurations/axiosConfig";
import { SERVER_URL } from "../configurations/serverUrl";
import { LobbiesMessage, LobbiesMessageType } from "../dto/LobbiesMessage";
import { LobbyDto } from "../dto/LobbyDto";
import ResponseObject from "../dto/ResponseObject";
import AuthenticationService from "./AuthenticationService";
import { LobbyService } from "./LobbyService";
import { WebSocketService } from "./WebsocketService";

export const LOBBIES_URL = urlJoin(SERVER_URL, "/api/v1/lobbies");
export const LOBBIES_WS_LOBBIES_BROKER = "/lobbies";
export const LOBBIES_WS_LOBBY_MESSAGE = "/ws/lobbies";

/**
 * Join lobby: subscribe to lobby
 * Quit lobby: unsubscribe
 * Logout: no need
 * 
 */

export class LobbiesService {
  private static _lobbies: LobbyDto[] = [];
  private static _currentLobby: LobbyDto;

  public static readonly onLobbiesUpdated: EventHandler<
    LobbyDto[]
  > = new EventHandler();
  public static get lobbies() {
    return this._lobbies;
  }
  public static get currentLobby() {
    return this._currentLobby;
  }

  public static Init() {
    AuthenticationService.onLogin.addCallback(() => {
      this.GetAllLobby();
    })

    WebSocketService.onConnect.addCallback(() => {
      this.SubscribeToLobbies();
    })
  }

  public static SubscribeToLobbies() {
    // No need to store the subscription because this will only close when the user logout
    WebSocketService.stompClient!.subscribe(LOBBIES_WS_LOBBIES_BROKER, (message) => {
      let lobbiesMessage: LobbiesMessage = JSON.parse(message.body);

      if (lobbiesMessage.type === LobbiesMessageType.CREATE) {
        this._lobbies.push(lobbiesMessage.lobby);
      } else if (lobbiesMessage.type === LobbiesMessageType.REMOVE) {
        // Remove the lobby by id
        for (let i = 0; i < this._lobbies.length; i++) {
          if (this._lobbies[i].id === lobbiesMessage.lobby.id) {
            this._lobbies.splice(i, 1);
            break;
          }
        }
      }

      // Either way, invoke lobbies changed event
      this.onLobbiesUpdated.invoke(this._lobbies);
    })
  }

  public static GetAllLobby(
    callback?: (err: Error | undefined, lobbies: LobbyDto[]) => void
  ) {
    AppAxios.get(LOBBIES_URL)
      .then((res) => {
        let resObj: ResponseObject<LobbyDto[]> = res.data;

        this._lobbies = resObj.data;
 
        if (callback) callback(undefined, this._lobbies);
        LobbiesService.onLobbiesUpdated.invoke(resObj.data);
      })
      .catch((err) => {
        if (callback) callback(err, []);
      });
  }

  public static CreateLobby(callback?: (err?: Error, lobby?: LobbyDto) => void, isPrivate?: boolean) {
    const param = new URLSearchParams();
    if (isPrivate) {
      param.set("private", isPrivate.toString());
    }
      

    AppAxios.post(`${LOBBIES_URL}?${param.toString()}`)
      .then((res) => {
        let resObj: ResponseObject<LobbyDto> = res.data;
        this._currentLobby = resObj.data;

        if (callback) {
          callback(undefined, resObj.data);
        }
        LobbyService.SubscribeToLobby(this._currentLobby);
      })
      .catch((err) => {
        if (callback) {
          callback(err, undefined);
        }
      });
  }
}
