import urlJoin from "url-join";
import EventHandler from "../../utils/EventHandler";
import { AppAxios } from "../configurations/axiosConfig";
import { SERVER_URL } from "../configurations/serverUrl";
import { LobbyDto } from "../dto/LobbyDto";
import ResponseObject from "../dto/ResponseObject";

const LOBBIES_URL = urlJoin(SERVER_URL, "/api/v1/lobbies");

export class LobbiesService {
  private static _lobbies: LobbyDto[] = [];

  public static readonly onLobbiesUpdated: EventHandler<LobbyDto[]> = new EventHandler();
  public static get lobbies() {
    return this._lobbies;
  }
  
  public static GetAllLobby() {
    AppAxios.get(LOBBIES_URL)
    .then((res) => {
      let resObj: ResponseObject<LobbyDto[]> = res.data;

      this._lobbies = resObj.data;
      LobbiesService.onLobbiesUpdated.invoke(resObj.data);
    })
    .catch((err) => {

    })
  }

  public static CreateLobby() {
    AppAxios.post(LOBBIES_URL)
    .then((res) => {
      
    })
    .catch((err) => {

    })
  }


}