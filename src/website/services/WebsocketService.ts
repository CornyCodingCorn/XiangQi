
import { Client, IFrame, Versions} from "@stomp/stompjs";
import urlJoin from "url-join";
import EventHandler from "../../utils/EventHandler";
import { Log } from "../../utils/Log";
import { AppAxiosConfig, AppAxiosHeaders } from "../configurations/axiosConfig";
import { SERVER_WS_URL } from "../configurations/serverUrl";
import ResponseObject from "../dto/ResponseObject";
import AuthenticationService from "./AuthenticationService";

const WS_ENDPOINT = urlJoin(SERVER_WS_URL, "ws");
const WEBSOCKET_LOG = "Websocket";
const WS_USERS_ENDPOINT = "/users";

export class WebSocketService {
  public static Init() {
    AuthenticationService.onLogin.addCallback(WebSocketService.UpdateHeader);
    AuthenticationService.onLogin.addCallback(WebSocketService.Connect);
    
    AuthenticationService.onRefresh.addCallback(WebSocketService.UpdateHeader);

    AuthenticationService.onRefreshFailed.addCallback(WebSocketService.Disconnect);
    AuthenticationService.onLogout.addCallback(WebSocketService.Disconnect);
  }

  private static UpdateHeader() {
    if (!WebSocketService._stompClient) return;

    WebSocketService._stompClient.connectHeaders = {
      [AppAxiosHeaders.JWT]: AppAxiosConfig.jwt
    }
  }

  private static Connect() {
    let query = new URLSearchParams({
      [AppAxiosHeaders.JWT]: AppAxiosConfig.jwt
    }).toString();

    WebSocketService._stompClient = new Client({
      brokerURL: `${WS_ENDPOINT}?${query}`,
      connectHeaders: {
        [AppAxiosHeaders.JWT]: AppAxiosConfig.jwt
      },
      heartbeatIncoming: 35000,
      heartbeatOutgoing: 30000,
      reconnectDelay: 5000,
      stompVersions: new Versions([Versions.V1_2]),
      onConnect: WebSocketService.OnConnected,
      onDisconnect: WebSocketService.OnDisconnected,
      onWebSocketError: WebSocketService.OnConnectError
    });


    WebSocketService._stompClient.activate();
  }

  private static Disconnect() {
    if (!WebSocketService._stompClient) return;

    WebSocketService._stompClient!.deactivate();
    WebSocketService._stompClient = null;
  }

  private static OnConnected() {
    Log.log(WEBSOCKET_LOG, `Connected to ${WS_ENDPOINT}`);
    
    WebSocketService._isConnected = true;
    WebSocketService._retryCounter = 0;

    WebSocketService.stompClient!.subscribe(urlJoin(WS_USERS_ENDPOINT, AuthenticationService.playerInfo!.username), (message) => {
      WebSocketService.onReply.invoke(JSON.parse(message.body));
    }, {id: "users-subscription"})

    WebSocketService.onConnect.invoke(undefined);
  }

  private static OnDisconnected(receipt: IFrame | undefined) {
    Log.log(WEBSOCKET_LOG, `Disconnected to ${WS_ENDPOINT}`);
    WebSocketService._isConnected = false;
    WebSocketService._retryCounter = 0;
    WebSocketService.onDisconnect.invoke(undefined);
  }

  private static OnConnectError() {
    if (WebSocketService._retryCounter > WebSocketService._maxRetry) {
      WebSocketService._stompClient?.deactivate();
      // Because websocket deactivate doesn't actually call disconnect.
      if (WebSocketService._isConnected) {
        WebSocketService.OnDisconnected(undefined);
      }

      Log.error(WEBSOCKET_LOG, `Maximum retry time reached, connection closed`);
      return;
    }

    Log.error("Websocket", `There is an error with the connection, retry time: ${++WebSocketService._retryCounter}`)
  }

  private static _retryCounter = 0;
  private static readonly _maxRetry = 5;
  private static _isConnected = false;
  public static get isConnected() {
    return WebSocketService._isConnected;
  }

  private static _stompClient: Client | null;
  public static get stompClient() {
    return WebSocketService._stompClient;
  }

  public static onConnect = new EventHandler<undefined>();
  public static onDisconnect = new EventHandler<undefined>();

  // This could be either confirmation or error that sent by the server to specific client
  public static onReply = new EventHandler<ResponseObject<any>>();
}