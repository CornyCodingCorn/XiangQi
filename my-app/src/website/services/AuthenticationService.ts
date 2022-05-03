import { AxiosError } from "axios";
import urlJoin from "url-join";
import EventHandler from "../../utils/EventHandler";
import { Log } from "../../utils/Log";
import {
  AppAxios,
  AppAxiosConfig,
  AppAxiosHeaders,
} from "../configurations/axiosConfig";
import { SERVER_URL } from "../configurations/serverUrl";
import PlayerDto from "../dto/PlayerDto";
import ResponseObject from "../dto/ResponseObject";
import { LobbiesService } from "./LobbiesService";

const AUTH_URL = urlJoin(SERVER_URL, "/api/auth");
const LOGIN_URL = urlJoin(AUTH_URL, "/login");
const LOGOUT_URL = urlJoin(AUTH_URL, "/logout");
const REGISTER_URL = urlJoin(AUTH_URL, "/register");
const REFRESH_URL = urlJoin(AUTH_URL, "/refresh");

export default class AuthenticationService {
  private static _isAuthenticated = false;
  private static _jwt = "";
  private static _playerInfo: PlayerDto | null;
  private static _refreshIntervalID = -1;

  public static get isAuthenticated() {
    return this._isAuthenticated;
  }
  public static get jwt() {
    return this._jwt;
  }
  public static get playerInfo() {
    return this._playerInfo;
  }

  public static readonly onRefresh: EventHandler<string> = new EventHandler();
  public static readonly onRefreshFailed: EventHandler<
    AxiosError
  > = new EventHandler();
  public static readonly onLogout: EventHandler<undefined> = new EventHandler();
  public static readonly onLogin: EventHandler<PlayerDto> = new EventHandler();

  public static Init() {
    let cachedJwt = localStorage[AppAxiosHeaders.JWT];
    if (cachedJwt) {
      AppAxiosConfig.jwt = cachedJwt;

      this.RefreshToken((err, jwt) => {
        if (err || !jwt) return;

        AppAxiosConfig.jwt = jwt;

        AppAxios.get(AUTH_URL).then((res) => {
          let resObj: ResponseObject<PlayerDto> = res.data;

          this.setLoginInfo(resObj.data, jwt);
          this.startRefreshInterval();

          this.onLogin.invoke(resObj.data);
        });
      });
    }
  }

  public static Login(
    username: String,
    password: String,
    callback: (
      err: AxiosError<ResponseObject<null>> | null,
      data: ResponseObject<PlayerDto> | null
    ) => void
  ) {
    AppAxios.post(LOGIN_URL, { username: username, password: password })
      .then((res) => {
        let resObj: ResponseObject<PlayerDto> = res.data;
        let jwt = res.headers[AppAxiosHeaders.JWT];

        this.setLoginInfo(resObj.data, jwt);
        this.startRefreshInterval();

        //const [cookies, setCookie, removeCookie] = cookieClient.useCookies(['cookie-name']);
        //setCookie(AppAxiosConfig.jwtCookie, )

        // If login successful then we want to get all the current lobbies
        this.onLogin.invoke(resObj.data);
        callback(null, resObj);
      })
      .catch((err) => {
        callback(err, null);
      });
  }

  public static Logout() {
    AppAxios.put(LOGOUT_URL)
      .then(() => {
        this.cancelRefreshInterval();
        this.clearLoginInfo();
        this.onLogout.invoke(undefined);
      })
      .catch(() => {});
  }

  public static Register(
    username: String,
    email: String,
    password: String,
    callback: (
      err: AxiosError<ResponseObject<null>> | null,
      data: ResponseObject<PlayerDto> | null
    ) => void
  ) {
    AppAxios.post(REGISTER_URL, {
      username: username,
      email: email,
      password: password,
    })
      .then((res) => callback(null, res.data))
      .catch((err) => callback(err, null));
  }

  public static RefreshToken(
    callback:
      | ((err: AxiosError | undefined, jwt: string | undefined) => void)
      | undefined
  ) {
    AppAxios.put(REFRESH_URL)
      .then((res) => {
        let jwt = res.headers[AppAxiosHeaders.JWT];
        Log.log("refresh", "Refresh token changed to " + jwt);

        if (callback) callback(undefined, jwt);

        this.onRefresh.invoke(jwt);
      })
      .catch((err) => {
        Log.error("refresh", "Refresh failed");
        if (callback) callback(err, undefined);

        this.onRefreshFailed.invoke(err);
      });
  }

  private static setLoginInfo(info: PlayerDto, jwt: string) {
    this._playerInfo = info;
    localStorage[AppAxiosHeaders.JWT] = this._jwt = AppAxiosConfig.jwt = jwt;
    this._isAuthenticated = true;
  }

  private static clearLoginInfo() {
    this._playerInfo = null;
    localStorage[AppAxiosHeaders.JWT] = this._jwt = AppAxiosConfig.jwt = "";
    this._isAuthenticated = false;
  }

  private static startRefreshInterval() {
    this._refreshIntervalID = window.setInterval(
      () =>
        this.RefreshToken((err, jwt) => {
          if (err) {
            this.cancelRefreshInterval();
            this.clearLoginInfo();
          }

          // update jwt
          this._jwt = AppAxiosConfig.jwt = jwt!;
        }),
      AppAxiosConfig.jwtRefreshInterval
    );
  }
  private static cancelRefreshInterval() {
    if (this._refreshIntervalID < 0) return;
    window.clearInterval(this._refreshIntervalID);
    this._refreshIntervalID = -1;
  }
}
