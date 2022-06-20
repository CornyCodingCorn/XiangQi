import * as React from "react";
import { useEffect } from "react";
import ImagesCollection from "./resources/ImagesCollection";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./website/pages/Home";
import SignIn from "./website/pages/SignIn";
import SignUp from "./website/pages/SignUp";
import AuthenticationService from "./website/services/AuthenticationService";
import Lobbies from "./website/pages/Lobbies";
import { WebSocketService } from "./website/services/WebsocketService";
import { LobbiesService } from "./website/services/LobbiesService";
import Lobby from "./website/pages/Lobby";
import { GamePlay } from "./website/pages/GamePlay";
import User from "./website/pages/User";
import VerifyEmail from "./website/pages/VerifyEmail";
import ChangeEmail from "./website/pages/ChangeEmail";

export interface IAppProps {}

export default function App(props: IAppProps) {
  useEffect(() => {
    // Doesn't matter of order
    ImagesCollection.init();
    WebSocketService.Init();
    LobbiesService.Init();

    // Also include refreshing token on local storage so should be call last
    AuthenticationService.Init();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/verify-email" element={<VerifyEmail />}/>
          <Route path="/change-password" element={<ChangeEmail />}/>
          <Route path="/user" element={<User />}/>
          <Route path="/sign-in" element={<SignIn />}/>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/lobbies" element={<Lobbies/> } />
          <Route path="/lobbies/:id" element={<Lobby /> } />
          <Route path="/lobbies/:id/game-play" element={<GamePlay /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
