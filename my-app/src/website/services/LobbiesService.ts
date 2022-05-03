import urlJoin from "url-join";
import EventHandler from "../../utils/EventHandler";
import { AppAxios } from "../configurations/axiosConfig";
import { SERVER_URL, SERVER_WS_URL } from "../configurations/serverUrl";
import { LobbiesMessage, LobbiesMessageType } from "../dto/LobbiesMessage";
import { LobbyDto } from "../dto/LobbyDto";
import ResponseObject from "../dto/ResponseObject";
import AuthenticationService from "./AuthenticationService";
import { WebSocketService } from "./WebsocketService";

const LOBBIES_URL = urlJoin(SERVER_URL, "/api/v1/lobbies");

const LOBBIES_WS_LOBBIES_BROKER = "/lobbies";

const LOBBIES_WS_LOBBY_MESSAGE = "/ws/lobbies";
const LOBBIES_WS_LOBBY_MOVES = "/ws/lobbies/moves";

export class LobbiesService {
  private static _lobbies: LobbyDto[] = [];

  public static readonly onLobbiesUpdated: EventHandler<
    LobbyDto[]
  > = new EventHandler();
  public static get lobbies() {
    return this._lobbies;
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
    WebSocketService.stompClient!.subscribe(LOBBIES_WS_LOBBIES_BROKER, (message) => {
      let lobbiesMessage: LobbiesMessage = JSON.parse(message.body);

      if (lobbiesMessage.type == LobbiesMessageType.CREATE) {
        this._lobbies.push(lobbiesMessage.lobby);
      } else if (lobbiesMessage.type == LobbiesMessageType.REMOVE) {
        // Remove the lobby by id
        for (let i = 0; i < this._lobbies.length; i++) {
          if (this._lobbies[i].id == lobbiesMessage.lobby.id) {
            this._lobbies.splice(i, 1);
            break;
          }
        }
      }

      // Either way, invoke lobbies changed event
      this.onLobbiesUpdated.invoke(this._lobbies);
    })
  }

  public static UnsubscribeToLobbies() {

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

  public static CreateLobby() {
    AppAxios.post(LOBBIES_URL)
      .then((res) => {})
      .catch((err) => {});
  }
}
