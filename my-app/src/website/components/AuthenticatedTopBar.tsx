import * as React from "react";
import { Link } from "react-router-dom";

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
          <li className="nav-item">
            <Link to={"/"}>Link2</Link>
          </li>
          <li className="nav-item">
            <Link to={"/"}>Link1</Link>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}
