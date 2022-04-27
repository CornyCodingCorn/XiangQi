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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="#f8f9fa"
          className="align-self-center"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
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
