import { info } from "console";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { gameplayBgBlack } from "../../resources/backgrounds/bgIndex";
import PlayerLobbyInfo from "../components/PlayerLobbyInfo";
import { LobbyMessageType } from "../dto/LobbyMessage";
import AuthenticationService from "../services/AuthenticationService";
import { LobbyService } from "../services/LobbyService";

export interface ILobbyProps {}

export default function Lobby(props: ILobbyProps) {
  const [info, setInfo] = React.useState(LobbyService.lobbyInfo);
  const navigate = useNavigate();

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

  const lobbySetting = LobbyService.lobbyInfo.setting;
  const isPlayerReady = info.player1 === AuthenticationService.playerInfo!.username ? info.player1Ready : info.player2Ready;

  // To render game play without actually routing to another route
  return info.player1 !== "" ? (
    <div id="lobbyPage" style={{
      display: "grid",
      alignContent: "center",
      background: `url(${gameplayBgBlack})`,
      height: "100%"
    }}>
      <div style={{
        marginTop: "-80px",
        position: "relative"
      }}>
        <div style={{
          position: "relative",
          border: `10px solid ${info.player1 === AuthenticationService.playerInfo!.username ? "red" : "black"}`,
          background: "rgba(255, 255, 255, 0.5)",
          width: "85%",
          marginLeft: "10%",
          borderRadius: "20px",
          display: "flex"
        }}>
          <div style={{flexGrow: "1"}}>
            <div style={{paddingTop: "40px"}} className="text-center fs-3"><span className="fw-bold" style={{userSelect: "none"}}>Lobby ID:</span> {LobbyService.lobbyID}</div>
            <div style={{display: "flex", flexDirection: "row", paddingTop: "40px"}}>
              <div style={{flexGrow: "1"}}><PlayerLobbyInfo img="" name={info.player1} isRed={true} isReady={info.player1Ready}></PlayerLobbyInfo></div>
              <div style={{alignContent: "center", display: "grid", fontSize: "80px", fontWeight: "bold", userSelect: "none"}}>
                <div>
                  <span style={{color: "red"}}>V</span>
                  <span style={{color: "black"}}>S</span>
                </div>
              </div>
              <div style={{flexGrow: "1"}}><PlayerLobbyInfo img="" name={info.player2} isRed={false} isReady={info.player2Ready}></PlayerLobbyInfo></div>
            </div>
            <div style={{display: "grid", justifyContent: "center", paddingTop: "40px", paddingBottom: "40px"}}>
              <button className={`btn ${isPlayerReady ? "btn-danger" : "btn-primary"} fw-bold fs-5`} style={{width: "150px", height: "40px"}} onClick={Ready}>{!isPlayerReady ? "Ready!" : "Cancel!"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : <div></div>;
}

function Ready() {
 LobbyService.Ready(); 
}