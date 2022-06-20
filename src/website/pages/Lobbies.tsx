import * as React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { GetPlayerProfile } from "../../resources/profiles";
import { LobbyDto } from "../dto/LobbyDto";
import PlayerDto from "../dto/PlayerDto";
import { LobbiesService } from "../services/LobbiesService";
import { LobbyService } from "../services/LobbyService";
import { PlayerService } from "../services/PlayerService";
import "./Lobbies.css";

export interface ILobbiesProps {}
var navigation: NavigateFunction;

export default function Lobbies(props: ILobbiesProps) {
  const [lobbies, setLobbies] = React.useState<LobbyDto[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogError, setDialogError] = React.useState("");
  const [viewingPlayer, setViewingPlayer] = React.useState<PlayerDto | null>(null);
  navigation = useNavigate();

  // Store it for cleaning up
  let updateLobbies = (lobbies: LobbyDto[]) => {
    setLobbies([...lobbies]);
  };

  // Add and remove listener on mount and dismount
  React.useEffect(() => {
    LobbiesService.onLobbiesUpdated.addCallback(updateLobbies);
    updateLobbies(LobbiesService.lobbies);

    return () => {
      LobbiesService.onLobbiesUpdated.removeCallback(updateLobbies);
    };
  }, []);

  React.useEffect(() => {
    setDialogError("");
  }, [openDialog]);

  let rows = CreateLobbiesElements(lobbies, (player) => {
    setViewingPlayer(player);
  });

  return (
    <div className="container h-100">
      {openDialog ? <dialog style={{
        display: "grid",
        justifyContent: "center",
        border: "0px",
        width: "100%",
        height: "calc(100% - 72px)",
        zIndex: "2",
        alignContent: "center",
        background: "rgba(20, 20, 20, 0.4)"
      }}>
        <div style={{
          width: "300px",
          background: "white",
          borderRadius: "10px",
        }}>
          <div style={{fontWeight: "bold", textAlign: "center", marginTop: "10px"}}>Join with id</div>
          <div style={{marginTop: "15px"}}>
            <label style={{fontWeight: "bold", marginLeft: "10px", marginRight: "10px"}}>ID </label>
            <input type="text" style={{width: "250px"}} ref={c => { if (c) lobbyIdInput = c; }}></input>
          </div>
          <div style={{justifyContent: "center", display: "flex", flexDirection: "row", marginTop: "15px"}}>
            <button className="btn btn-primary mx-3" onClick={() => JoinLobbyWithId(lobbyIdInput.value, (err) => {
              setDialogError("Failed to join");
            })}>Join</button>
            <button className="btn btn-danger mx-3" onClick={() => {setOpenDialog(false)}}>Cancel</button>
          </div>
          <div style={{textAlign: "center", color: "red", marginBottom: "10px", marginTop: "10px"}}>{dialogError}</div>
        </div>
      </dialog> : undefined}
      <div className="row h-100">
        <div key={"lobbiesInfo"} className="col-lg-7 h-100" style={{alignContent: "center", justifyContent: "center", display: "grid", flexDirection: "column"}}>
          {viewingPlayer ? (<div>
            <div style={{
              width: "200px",
              marginTop: "-70px",
              height: "200px",
              background: "white",
              backgroundImage: `url(${GetPlayerProfile(viewingPlayer!.profile)})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              border: "5px solid rgb(38, 38, 38)",
              borderRadius: "50%",
              boxShadow: "0px 0px 20px rgba(38, 38, 38, 0.5)"
            }}>
            </div>
            <div style={{textAlign: "center", marginTop: "20px", fontWeight: "bold", fontSize: "40px"}}>
              {viewingPlayer!.username}
            </div>
            <div style={{textAlign: "center", fontWeight: "bold", fontSize: "20px"}}>
              <span>Win/Lost: </span>
              <span>{(viewingPlayer!.winLostRatio * 100).toString().substring(0, 4) + "%"}</span>
            </div>
          </div>) : <div style={{fontWeight: "bold", fontSize: "30px"}}>
            Not viewing a player
          </div>}
        </div>

        <div
          key={"lobbiesList"}
          className="lobbiesListDiv col-lg-5 d-flex py-3 justify-content-center flex-column"
        >
          <div
            key={"table-header"}
            className="fw-bold fs-3 w-100 mt-5 mt-lg-0 text-center mb-3 top-0 align-self-baseline"
          >
            List of lobbies
          </div>
          <div key={"table"} className="card card-body w-100 align-self-center">
            <table className="table mt-2 table-striped">
              <thead className="text-bold position-sticky top-0 h-100">
                <tr>
                  <th key={"head-1"} scope="col" className="col-1">
                    #
                  </th>
                  <th key={"head-2"} scope="col" className="col-4">
                    Player1
                  </th>
                  <th key={"head-3"} scope="col" className="col-6">
                    Options
                  </th>
                </tr>
              </thead>
            </table>
            <table className="lobbiesTable table table-stripe">
              <tbody>{rows}</tbody>
            </table>
          </div>
          <button
            key={"create-lobby"}
            className="btn btn-primary w-100 mb-2 mt-4 w-100 fw-bold align-self-end"
            onClick={() => CreateNewLobby()}
          >
            Create new lobby
          </button>
          <button key={"join-lobby"} className="btn btn-primary w-100 col-1 mb-2 col-12 fw-bold align-self-end" onClick={() => CreateNewPrivateLobby()}>
            Create private lobby
          </button>
          <button key={"join-lobby"} className="btn btn-primary w-100 col-1 col-12 fw-bold align-self-end" onClick={() => {
            setOpenDialog(true);
          }}>
            Join with id
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateNewLobby() {
  LobbiesService.CreateLobby((err, lobby) => {
    if (err) return;

    navigation(lobby!.id, {
      replace: false,
    });
  });
}

function CreateNewPrivateLobby() {
  LobbiesService.CreateLobby((err, lobby) => {
    if (err) return;

    navigation(lobby!.id, {
      replace: false,
    });
  }, true);
}

let lobbyIdInput: HTMLInputElement;
function JoinLobbyWithId(id: string, errCbl?: (err: Error) => void) {
  LobbyService.Join(id, (err) => {
    // TODO: add handler to show the error to user.
    if (err) {
      if (errCbl) errCbl(err);
      return;
    }

    navigation(id, {
      replace: false,
    });
  });
}

function CreateLobbiesElements(lobbies: LobbyDto[], infoClick: (player: PlayerDto) => void) {
  let rows = [];

  for (let i = 0; i < lobbies.length; i++) {
    let lobby = lobbies[i];
    if (lobby.setting.privateLobby) continue;

    rows.push(
      <tr key={i}>
        <th className="col-1" scope="row">
          {i + 1}
        </th>
        <td className="col-4">{lobby.player1}</td>
        <td className="col-6">
          <button
            className="btn btn-primary me-3 fw-bold"
            onClick={() => JoinLobbyWithId(lobby.id)}
          >
            Join
          </button>
          <button className="btn btn-info  fw-bold"
          onClick={() => {
            PlayerService.GetPlayer(lobby.player1, (result) => {
              if (result) {
                infoClick(result);
              }
            })
          }}>Info</button>
        </td>
      </tr>
    );
  }

  return rows;
}
