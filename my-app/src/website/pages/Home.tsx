import * as React from "react";
import { Link, Outlet } from "react-router-dom";
import AuthenticatedTopBar from "../components/AuthenticatedTopBar";
import TopBar from "../components/TopBar";
import AuthenticationService from "../services/AuthenticationService";

export interface IHomeProps {}

export default function Home(props: IHomeProps) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  let setAuthTrueClb = () => setIsAuthenticated(true);
  let setAuthFalseClb = () => setIsAuthenticated(false);

  AuthenticationService.onRefreshFailed.addCallback(setAuthTrueClb)
  AuthenticationService.onLogout.addCallback(setAuthFalseClb);
  AuthenticationService.onLogin.addCallback(setAuthTrueClb);

  return (
    <div className="d-flex flex-column w-100 h-100">
      <div className="navbar navbar-expand-lg bg-dark text-white shadow-lg">
        <div className="container">
          <div className="navbar-brand d-flex">
            <svg version="1.1" x="0px" y="0px" width={45} viewBox="0 0 220 220">
              <g stroke="#f8f9fa" fill="#f8f9fa">
                <path d="M110,0C49.346,0,0,49.346,0,110s49.346,110,110,110s110-49.346,110-110S170.654,0,110,0z M110,210   c-55.14,0-100-44.86-100-100S54.86,10,110,10s100,44.86,100,100S165.14,210,110,210z" />
                <path d="M110,19.5c-49.902,0-90.5,40.598-90.5,90.5s40.598,90.5,90.5,90.5s90.5-40.598,90.5-90.5S159.902,19.5,110,19.5z    M110,197.5c-48.248,0-87.5-39.252-87.5-87.5S61.752,22.5,110,22.5s87.5,39.252,87.5,87.5S158.248,197.5,110,197.5z" />
                <path d="M71.444,84.169H91.13v40.813c0,5.915-2.877,11.505-7.695,14.953l-4.879,3.492l6.983,9.759l4.879-3.492   c7.96-5.696,12.712-14.934,12.712-24.712V84.169h11.943v62.374c0,9.925,8.075,18,18,18h6v-12h-6c-3.309,0-6-2.691-6-6V84.169   h21.483v-12H71.444V84.169z" />
                <rect x="85.389" y="55.457" width="49.223" height="12" />
              </g>
            </svg>
            <Link
              className="fw-bolder text-white text-decoration-none align-self-center m-2 text-uppercase"
              to="/"
            >
              XiangQi Online
            </Link>
          </div>

          {isAuthenticated ? (
            <AuthenticatedTopBar />
          ) : (
            <TopBar />
          )}
        </div>
      </div>
      <div className="flex-grow-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
