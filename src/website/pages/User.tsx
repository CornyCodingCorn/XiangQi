import React from 'react'
import PropTypes from 'prop-types'
import { GetPlayerProfile } from '../../resources/profiles'
import AuthenticationService from '../services/AuthenticationService'
import PlayerDto from '../dto/PlayerDto';
import { PlayerService } from '../services/PlayerService';

export interface IUserProps {

}

var comboBox: HTMLSelectElement;

function User(props: IUserProps) {
	let playerInfo = AuthenticationService.playerInfo as PlayerDto;
	const [profile, setProfile] = React.useState(playerInfo.profile);

  return (
    <div>
      <div style={{
				display: "flex",
				marginTop: "40px",
				marginBottom: "40px",
				marginLeft: "20px",
				marginRight: "20px",
				flexDirection: "row",
				justifyContent: "center"
			}}>
				<div style={{
					borderRadius: "50%",
					display: "grid",
					justifyContent: "center",
					alignContent: "center",
					border: "7px solid rgb(38, 38, 38)",
					width: "200px",
					height: "200px"
				}}>
					<div style={{
						backgroundImage: `url(${GetPlayerProfile(profile)})`,
						backgroundSize: "cover",
						width: "150px",
						height: "150px"
					}}>
					</div>
				</div>
				<div style={{
					marginLeft: "40px",
					display: "flex",
					flexDirection: "column",
				}}>
					<div style={{
							fontWeight: "bold",
							fontSize: "40px",
							color: "rgb(38,38,38)",
						}}>
						<span>Username: </span>
						<span>{playerInfo.username}</span>
					</div>
					<div style={{
							fontWeight: "bold",
							fontSize: "20px",
							color: "rgb(38,38,38)",
						}}>
							<span style={{color: "green"}}>Win</span>
							<span>/</span>
							<span style={{color: "red"}}>Lost</span>
							<span> ratio: </span>
							<span style={{color: `${playerInfo.winLostRatio < 0.2 ? "red" : playerInfo.winLostRatio < 0.6 ? "yellow" : "green"}`}}>{`${playerInfo.winLostRatio ? playerInfo.winLostRatio * 100 : 69.99999999}`.substring(0, 4) + '%'}</span>
					</div>
					<div style={{
							fontWeight: "bold",
							fontSize: "20px",
							color: "rgb(38,38,38)",
						}}>
							<span>Total matches: </span>
							<span>{playerInfo.totalMatches ? playerInfo.totalMatches : 0}</span>
					</div>
					<select style={{
							fontWeight: "bold",
							fontSize: "20px",
							color: "rgb(38,38,38)",
						}} onChange={(e) => {
							setProfile(e.target.selectedIndex);
						}} ref={c => {comboBox = c as HTMLSelectElement;}}>
						<option value={0}>Coconut</option>
						<option value={1}>Galaxy</option>
						<option value={2}>Hat</option>
						<option value={3}>Lily</option>
						<option value={4}>Lotus</option>
						<option value={5}>Mind</option>
						<option value={5}>Space ship</option>
					</select>
					<div style={{
						display: "flex",
						flexDirection: "row"
					}}>
						<button className='btn btn-primary fw-bold mt-3' style={{width: "100px"}} onClick={() => {
							PlayerService.ChangePlayerProfile(comboBox.selectedIndex, (result) => {
								if (result) AuthenticationService.playerInfo = result;
							})
						}}>Save</button>
						<button className='btn btn-primary fw-bold mt-3 ms-3' style={{width: "200px"}} onClick={() => {

						}}>Change password</button>
					</div>
				</div>
			</div>
    </div>
  )
}

export default User
