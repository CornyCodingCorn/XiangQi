import * as React from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationService from "../services/AuthenticationService";
import { LobbyService } from "../services/LobbyService";
import "./AuthenticatedTopBar.css";

export interface IAuthenticatedTopBarProps {}

export default function AuthenticatedTopBar(props: IAuthenticatedTopBarProps) {
  const navigate = useNavigate();
  const checkGameAndNav = (url: string) => {
    if (LobbyService.isPlaying) {
      if (LobbyService.finished || window.confirm("Are you sure you want to quit the match?")) {
        navigate(url);
        return true;
      }

      return false;
    }

    navigate(url);
    return true;
  };

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
        <ul className="navbar-nav ms-auto gap-1 align-items-end">
          <li className="nav-item listItem">
            <button
              className="link-btn"
              onClick={() => checkGameAndNav("/user")}
            >
              <div className="link-btn-content">User</div>
            </button>
          </li>
          <li className="nav-item listItem">
            <button
              className="link-btn"
              onClick={() => checkGameAndNav("/lobbies")}
            >
              <div className="link-btn-content">Lobbies</div>
            </button>
          </li>
          <li className="nav-item listItem">
            <button
              className="link-btn"
              onClick={() => {
                if (checkGameAndNav("/"))
                  AuthenticationService.Logout();
              }}
            >
              <div className="link-btn-content">Logout</div>
            </button>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}
