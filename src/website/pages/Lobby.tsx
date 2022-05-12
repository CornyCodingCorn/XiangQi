import * as React from "react";
import { LobbyMessageType } from "../dto/LobbyMessage";
import { LobbyService } from "../services/LobbyService";
import { GamePlay } from "./GamePlay";

export interface ILobbyProps {}

export default function Lobby(props: ILobbyProps) {
  const [info, setInfo] = React.useState(LobbyService.lobbyInfo);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => { 
    let clb = (type: LobbyMessageType) => {
      setInfo(LobbyService.lobbyInfo);
      if (type === LobbyMessageType.START) {
        setIsPlaying(true);
      }
    }

    LobbyService.onLobbyInfoChanged.addCallback(clb);
    setInfo(LobbyService.lobbyInfo);

    return () => {
      LobbyService.onLobbyInfoChanged.removeCallback(clb);
    }
  }, [])

  // To render game play without actually routing to another route
  return info.player1 !== "" ? (
    !isPlaying ? (
      <div id="lobbyPage" className="container">
      <div className="text-center fw-bold fs-3">Lobby {LobbyService.lobbyID}</div>
      <div>
        <span>Player1: {info.player1} | </span>
        <span>{info.player1Ready ? "Ready" : "Not ready"}</span>
      </div>
      <div>
        <span>Player2: {info.player2 ? info.player2 : "empty"} | </span>
        <span>{info.player2Ready ? "Ready" : "Not ready"}</span>
      </div>
      <div>
        <button className="btn btn-primary fw-bold" onClick={Ready}>Ready</button>
      </div>
    </div>
    ) : (<GamePlay/>)
  ) : <div></div>;
}

function Ready() {
 LobbyService.Ready(); 
}