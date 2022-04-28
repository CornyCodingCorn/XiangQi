import axios from "axios";
import { useNavigate } from "react-router-dom";
import urlJoin from "url-join";
import EventHandler from "../../utils/EventHandler";
import { SERVER_URL } from "../configurations/serverUrl";

const AUTH_URL = urlJoin(SERVER_URL, "/auth");
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
    undefined
  > = new EventHandler();
  public static readonly logoutEventHandler: EventHandler<
    undefined
  > = new EventHandler();

  public static Login() {
    this.loginEventHandler.invoke(undefined);
    window.setInterval(() => this.RefreshToken(undefined), 250000);
  }

  public static Logout() {
    this.logoutEventHandler.invoke(undefined);
  }

  public static Register(username: String, email: String, password: String) {
    axios.post(REGISTER_URL, {
      username: username,
      email: email,
      password: password,
    })
    .then(() => {
      
    });
  }

  public static RefreshToken(
    callback: ((result: boolean) => void) | undefined
  ) {}
}
