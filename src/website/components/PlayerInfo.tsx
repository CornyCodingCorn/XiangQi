import * as React from 'react';

const MAX_NAME_LENGTH = 18;

export interface IPlayerInfoProps {
  playerName: string,
  imageURL: string,
  height: number,
  isPlayerTurn: boolean,
  isRed: boolean
  profileSize: number
}

export default function PlayerInfo (props: IPlayerInfoProps) {
  let style: React.CSSProperties = {
    height: props.height,
    maxHeight: props.height,
    outline: `${props.isPlayerTurn ? 5 : 0}px solid rgba(13, 110, 253, 0.45)`,
    boxShadow: props.isPlayerTurn ? `0px 0px 15px rgba(13, 110, 253, 0.45)` : `0px 0px 10px lightgrey`,
  }

  let profileStyle: React.CSSProperties = {
    height: props.profileSize,
    width: props.profileSize,
    maxWidth: props.profileSize,
    maxHeight: props.profileSize,
    borderRadius: 5,
    background: "#0d6efd"
  }

  let imageStyle: React.CSSProperties = {
    height: props.profileSize - 10,
    width: props.profileSize - 10,
    maxWidth: props.profileSize -10,
    maxHeight: props.profileSize -10,
  }

  return (
    <div className='d-flex flex-row border rounded-3' style={style}>
      <div key={"Profile div"} style={{width: props.height}} className="d-flex flex-column justify-content-center">
        <div style={profileStyle} className="align-self-center d-flex flex-row justify-content-center">
          <img style={imageStyle} className="align-self-center" onError={err => {
            let image: HTMLImageElement = err.nativeEvent.target as HTMLImageElement;
            image.src = "https://cdn-icons-png.flaticon.com/512/3237/3237472.png";
          }} src={props.imageURL} alt={"Profile_picture"}></img>
        </div>
      </div>
      <div key={"Info div"} className="my-1 d-flex flex-column justify-content-center">
        <div style={{margin: "-7px", fontSize: "13px", padding: "0px 8px", color: `${props.isRed ? "#ff0000" : "#000000"}`}} className="fw-bold">{props.isRed ? "Red player" : "Black player"}</div>
        <div style={{color: `${props.isRed ? "#ff0000" : "#000000"}`}} className='fw-bold fs-5'>{props.playerName.length > MAX_NAME_LENGTH ? `${props.playerName.substring(0, MAX_NAME_LENGTH)}...` : props.playerName}</div>
      </div>
    </div>
  );
}
