import React from 'react'
import PropTypes from 'prop-types'
import { DefaultUser } from '../../resources/for-ui';

export interface IPlayerLobbyInfoProps {
    img: string,
    name: string,
    isRed: boolean,
    isReady: boolean,
}

function PlayerLobbyInfo(props: IPlayerLobbyInfoProps) {
	const color = props.isRed ? "red" : "black";

  return (
    <div style={{display: "grid", justifyContent: "center"}}>
        <span style={{
            paddingBottom: "10px",
            fontSize: "20px",
            fontWeight: "bold",
						userSelect: "none",
						textAlign: "center",
						color: color
        }}>{!props.name ? "WAITING" : props.isReady ? "READY!" : "NOT READY!"}</span>
        <div style={{
            width: "150px", 
            height: "150px",
						borderRadius: "10px",
            border: `5px solid ${color}`,
            backgroundImage: `url(${props.img ? props.img : DefaultUser})`,
            backgroundSize: "cover",
            boxShadow: `0px 0px ${props.isReady ? "20px" : "0px"} ${color}`}}></div>
        <span style={{
            paddingTop: "10px",
            fontSize: "20px",
            fontWeight: "bold",
						userSelect: "none",
						textAlign: "center",
						color: color
        }}>{props.name ? props.name : "Empty"}</span>
    </div>
  )
}

export default PlayerLobbyInfo
