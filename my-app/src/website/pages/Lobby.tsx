import * as React from "react";
import { LobbiesService } from "../services/LobbiesService";

export interface ILobbyProps {}

export default function Lobby(props: ILobbyProps) {
  const [player1Ready, setPlayer1Ready] = React.useState(false);
  const [player2Ready, setPlayer2Ready] = React.useState(false);
  let lobby = LobbiesService.currentLobby;

  return lobby ? (
    <div className="container">
      <div className="text-center fw-bold fs-3">Lobby {lobby.id}</div>
      <div>
        <span>Player1: {lobby.player1} | </span>
        <span>{player1Ready ? "Ready" : "Not ready"}</span>
      </div>
      <div>
        <span>Player2: {lobby.player2 ? lobby.player2 : "empty"} | </span>
        <span>{player2Ready ? "Ready" : "Not ready"}</span>
      </div>
      <div>
        <button className="btn btn-primary fw-bold" onClick={Ready}>Ready</button>
      </div>
    </div>
  ) : <div></div>;
}

function Ready() {
  
}