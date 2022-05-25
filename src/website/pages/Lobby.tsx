import { info } from "console";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { json } from "stream/consumers";
import { setSyntheticTrailingComments } from "typescript";
import LobbySettingForm, { LobbySettingInfo } from "../components/LobbySettingForm";
import { LobbyMessageType } from "../dto/LobbyMessage";
import { LobbyService } from "../services/LobbyService";

export interface ILobbyProps {}

export default function Lobby(props: ILobbyProps) {
  const [info, setInfo] = React.useState(LobbyService.lobbyInfo);
  const navigate = useNavigate();

  let setting: LobbySettingInfo;

  React.useEffect(() => { 
    let clb = (type: LobbyMessageType) => {
      setInfo(LobbyService.lobbyInfo);
      if (type === LobbyMessageType.START) {
        navigate("game-play", {replace: false});
      }
    }

    LobbyService.onLobbyInfoChanged.addCallback(clb);
    setInfo(LobbyService.lobbyInfo);

    return () => {
      LobbyService.onLobbyInfoChanged.removeCallback(clb);
    }
  }, [navigate])

  // To render game play without actually routing to another route
  return info.player1 !== "" ? (
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
    <LobbySettingForm
      isDisable={false}
      onRender={(c) => (setting = c)}
      onChange={() => ChangeSetting(setting)}
    />
    </div>
  ) : <div></div>;
}

function Ready() {
 LobbyService.Ready(); 
}

function ChangeSetting(setting: LobbySettingInfo) {
  let newSet = "{\"minPerTurn\":\"" + setting.minPerTurn.value +
                "\",\"totalMin\":\"" + setting.totalMin.value  +
                "\",\"isVsBot\":\"" + setting.isVsBot.value +
                "\",\"isPrivate\":\"" + setting.isPrivate.value + "\"}";
  LobbyService.ChangeSetting(newSet);
}