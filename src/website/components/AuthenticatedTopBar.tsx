import * as React from "react";
import { Link } from "react-router-dom";
import AuthenticationService from "../services/AuthenticationService";
import "./AuthenticatedTopBar.css"

export interface IAuthenticatedTopBarProps {}

export default function AuthenticatedTopBar(props: IAuthenticatedTopBarProps) {
  return (
    <React.Fragment>
      <button
        className="navbar-toggler text-white"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navmenu"
      >
        <i className="bi bi-list"></i>
      </button>

      <div className="collapse navbar-collapse" id="navmenu">
        <ul className="navbar-nav ms-auto gap-3 align-items-end">
          <li className="nav-item listItem">
            <Link className="tabLink" to={"/user"}>User</Link>
          </li>
          <li className="nav-item listItem">
            <Link className="tabLink" to={"/lobbies"}>Lobbies</Link>
          </li>
          <li className="nav-item listItem">
            <Link className="tabLink" to={"/"} onClick={() => AuthenticationService.Logout()}>Logout</Link>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}
