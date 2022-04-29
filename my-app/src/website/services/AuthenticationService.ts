import { AxiosError } from "axios";
import urlJoin from "url-join";
import EventHandler from "../../utils/EventHandler";
import { AppAxios } from "../configurations/axiosConfig";
import { SERVER_URL } from "../configurations/serverUrl";
import PlayerDto from "../dto/PlayerDto";
import ResponseObject from "../dto/ResponseObject";

const AUTH_URL = urlJoin(SERVER_URL, "/api/auth");
const LOGIN_URL = urlJoin(AUTH_URL, "/login");
const REGISTER_URL = urlJoin(AUTH_URL, "/register");
const REFRESH_URL = urlJoin(AUTH_URL, "/refresh");

export default class AuthenticationService {
  private static _isAuthenticated = false;
  public static get isAuthenticated() {
    return this._isAuthenticated;
  }

  private static _jwt = "";
  public static get jwt() {
    return this._jwt;
  }

  public static readonly loginEventHandler: EventHandler<
    PlayerDto
  > = new EventHandler();
  public static readonly logoutEventHandler: EventHandler<
    undefined
  > = new EventHandler();
  public static readonly registerEventHandler: EventHandler<
    PlayerDto
  > = new EventHandler();

  public static Login() {
    window.setInterval(() => this.RefreshToken(undefined), 250000);
  }

  public static Logout() {
    this.logoutEventHandler.invoke(undefined);
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
    callback: ((result: boolean) => void) | undefined
  ) {}

  public static ConstructRequestHeader() {
    return {
      bearer: this.jwt,
    };
  }
}
