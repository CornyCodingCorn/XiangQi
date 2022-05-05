
import { Client, frameCallbackType, IFrame, Stomp, Versions, wsErrorCallbackType } from "@stomp/stompjs";
import urlJoin from "url-join";
import EventHandler from "../../utils/EventHandler";
import { Log } from "../../utils/Log";
import { AppAxiosConfig, AppAxiosHeaders } from "../configurations/axiosConfig";
import { SERVER_URL, SERVER_WS_URL } from "../configurations/serverUrl";
import AuthenticationService from "./AuthenticationService";

const WS_ENDPOINT = urlJoin(SERVER_WS_URL, "ws");
const WEBSOCKET_LOG = "Websocket";

export class WebSocketService {
  public static Init() {
    AuthenticationService.onLogin.addCallback(this.UpdateHeader);
    AuthenticationService.onLogin.addCallback(this.Connect);
    
    AuthenticationService.onRefresh.addCallback(this.UpdateHeader);

    AuthenticationService.onRefreshFailed.addCallback(this.Disconnect);
    AuthenticationService.onLogout.addCallback(this.Disconnect);
  }

  private static UpdateHeader = () => {
    if (!this._stompClient) return;

    this._stompClient.connectHeaders = {
      [AppAxiosHeaders.JWT]: AppAxiosConfig.jwt
    }
  }

  private static Connect = () => {
    let query = new URLSearchParams({
      [AppAxiosHeaders.JWT]: AppAxiosConfig.jwt
    }).toString();

    this._stompClient = new Client({
      brokerURL: `${WS_ENDPOINT}?${query}`,
      connectHeaders: {
        [AppAxiosHeaders.JWT]: AppAxiosConfig.jwt
      },
      reconnectDelay: 5000,
      stompVersions: new Versions([Versions.V1_2]),
      onConnect: this.OnConnected,
      onDisconnect: this.OnDisconnected,
      onWebSocketError: this.OnConnectError
    });


    this._stompClient.activate();
  }

  private static Disconnect = () => {
    if (!this._stompClient) return;

    this._stompClient!.deactivate();
    this._stompClient = null;
  }

  private static OnConnected: frameCallbackType = (receipt) => {
    Log.log(WEBSOCKET_LOG, `Connected to ${WS_ENDPOINT}`);
    
    this._isConnected = true;
    this._retryCounter = 0;
    this.onConnect.invoke(undefined);
  }

  private static OnDisconnected = (receipt: IFrame | undefined) => {
    Log.log(WEBSOCKET_LOG, `Disconnected to ${WS_ENDPOINT}`);
    this._isConnected = false;
    this._retryCounter = 0;
    this.onDisconnect.invoke(undefined);
  }

  private static OnConnectError: wsErrorCallbackType<any> = (evt) => {
    if (this._retryCounter > this._maxRetry) {
      this._stompClient?.deactivate();
      // Because websocket deactivate doesn't actually call disconnect.
      if (this._isConnected) {
        this.OnDisconnected(undefined);
      }

      Log.error(WEBSOCKET_LOG, `Maximum retry time reached, connection closed`);
      return;
    }

    Log.error("Websocket", `There is an error with the connection, retry time: ${++this._retryCounter}`)
  }

  private static _retryCounter = 0;
  private static readonly _maxRetry = 5;
  private static _isConnected = false;
  public static get isConnected() {
    return this._isConnected;
  }

  private static _stompClient: Client | null;
  public static get stompClient() {
    return this._stompClient;
  }

  public static onConnect = new EventHandler<undefined>();
  public static onDisconnect = new EventHandler<undefined>();
}