import React from 'react'
import PropTypes from 'prop-types'
import { GetPlayerProfile } from '../../resources/profiles'
import AuthenticationService from '../services/AuthenticationService'
import PlayerDto from '../dto/PlayerDto';
import { PlayerService } from '../services/PlayerService';
import { Match } from '../dto/Match';
import moment from 'moment';
import { bgChess3, gameplayBgBlack } from '../../resources/backgrounds/bgIndex';
import { RequestService } from '../services/RequestService';
import { setMoves } from './Replay';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export interface IUserProps {

}

var comboBox: HTMLSelectElement;

function User(props: IUserProps) {
	const [playerInfo, setPlayerInfo] = React.useState(AuthenticationService.playerInfo as PlayerDto);
	const [profile, setProfile] = React.useState(playerInfo.profile);
	const [matches, setMatches] = React.useState<Match[]>([]);
	const [text, setText] = React.useState("");
	const [isError, setIsError] = React.useState(false);
	const navigate = useNavigate();

	React.useEffect(() => {
		PlayerService.GetPlayerMatches((result) => {
			if (result) {
				setMatches(result);
			}
		});

		PlayerService.GetPlayer(playerInfo.username, result => {
			if (result) {
				AuthenticationService.playerInfo = result;
				setPlayerInfo(result);
			}
		})
	}, [])



	return (
		<div style={{
			backgroundImage: `url(${bgChess3})`,
			backgroundSize: "cover",
			minHeight: "100%"
		}}>
			<div style={{
				display: "flex",
				paddingTop: "40px",
				paddingBottom: "40px",
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
						<span className='bg-primary' style={{
							textAlign: "center",
							color: "white",
							borderRadius: "10px 50% 50% 10px",
							paddingLeft: "10px",
							marginRight: "10px",
							paddingRight: "10px",
							paddingTop: "5px",
							userSelect: "none",
							paddingBottom: "5px",
						}}>Rank {playerInfo.rank} </span>
						<span>{playerInfo.username}</span>
					</div>
					<div style={{
						fontWeight: "bold",
						fontSize: "20px",
						color: "rgb(38,38,38)",
					}}>
						<span style={{ color: "green" }}>Win</span>
						<span>/</span>
						<span style={{ color: "red" }}>Lost</span>
						<span> ratio: </span>
						<span style={{ color: `${playerInfo.winLostRatio < 0.2 ? "red" : playerInfo.winLostRatio < 0.6 ? "yellow" : "green"}` }}>{`${playerInfo.winLostRatio ? playerInfo.winLostRatio * 100 : "N/A"}`.substring(0, 4) + '%'}</span>
					</div>
					<div style={{
						fontWeight: "bold",
						fontSize: "20px",
						color: "rgb(38,38,38)",
					}}>
						<span>Ranking point: {playerInfo.rankingPoint}</span>
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
					}} ref={c => { comboBox = c as HTMLSelectElement; }}
						defaultValue={playerInfo.profile}>
						<option value={0}>Coconut</option>
						<option value={1}>Galaxy</option>
						<option value={2}>Hat</option>
						<option value={3}>Lily</option>
						<option value={4}>Lotus</option>
						<option value={5}>Mind</option>
						<option value={5}>Space ship</option>
					</select>
					<div style={{color: isError ? "red" : "green", marginTop: "5px", textAlign: "center"}} >{text}</div>
					<div style={{
						display: "flex",
						flexDirection: "row"
					}}>
						<button className='btn btn-primary fw-bold mt-3' style={{ width: "100px" }} onClick={() => {
							setText("");
							PlayerService.ChangePlayerProfile(comboBox.selectedIndex, (result, err) => {
								if (result) AuthenticationService.playerInfo = result;
								if (err) {
									setText(err.message);
									setIsError(true);
								} else {
									setText("Success");
									setIsError(false);
								}
							})
						}}>Save</button>
						<button className='btn btn-primary fw-bold mt-3 ms-3' style={{ width: "170px" }} onClick={() => {
							setText("");
							RequestService.RequestPasswordChange(playerInfo.username, (err) => {
								if (err) {
									setText(err.message);
									setIsError(true);
								} else {
									setText("Change password email sent");
									setIsError(false);
								}
							});
						}}>Change password</button>
					</div>
				</div>
			</div>

			<div>
				<table className='table' style={{
					width: "90%",
					boxShadow: "0px 0px 20px rgba(38, 38, 38, 0.5)",
					marginLeft: "5%",
					background: "white",
					maxHeight: "calc(100% - 1000px)"
				}}>
					<thead>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Date</th>
							<th scope="col">Black player</th>
							<th scope="col">Red player</th>
							<th scope="col">Result</th>
							<th scope="col">Control</th>
						</tr>
					</thead>
					<tbody>
						{createTableRows(matches, navigate)}
					</tbody>
				</table>
			</div>
			<div style={{height: "5px"}}></div>
		</div>
	)
}

export default User

function createTableRows(matches: Match[], navigate: NavigateFunction) {
	var result = matches.map((v, index) => {
		var background = "";
		var text = "";
		if (v.victor === "None") {
			background = "bg-warn";
			text = "Draw";
		} else if (v.victor === AuthenticationService.playerInfo!.username) {
			background = "bg-success";
			text = "Victory";
		} else {
			background = "bg-danger"
			text = "Lost";
		}

		return <tr>
			<th scope="row">{index + 1}</th>
			<td>{moment(v.time).format("MMMM Do YYYY")}</td>
			<td style={{color: "black"}}>{v.blackPlayer}</td>
			<td style={{color: "red"}}>{v.redPlayer}</td>
			<td>
				<div className={background} style={{color: "white", fontWeight: "bold", textAlign: "center", borderRadius: "10px", height: "38px", display: "grid", alignContent: "center"}}>{text}</div>
			</td>
			<td>
				<button className='btn btn-primary fw-bold' onClick={() => {
					setMoves(v.moves);
					navigate("/replay/" + v.id);
				}}>Replay</button>
			</td>
		</tr>
	});

	return result;
}