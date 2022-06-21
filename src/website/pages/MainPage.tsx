import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { bgChess3 } from '../../resources/backgrounds/bgIndex'
import AuthenticationService from '../services/AuthenticationService'
import { useNavigate } from 'react-router-dom'
import { PlayerService } from '../services/PlayerService'

const MainPage = (props: {}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthenticationService.isAuthenticated);
    const [players, setPlayers] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        let cbLI = () => {
            setIsAuthenticated(true)
        }
        AuthenticationService.onLogin.addCallback(cbLI);

        let cbLO = () => {
            setIsAuthenticated(false);
        }
        AuthenticationService.onLogout.addCallback(cbLO);

        fetchPlayer(setPlayers);

        return () => {
            AuthenticationService.onLogin.removeCallback(cbLI);
            AuthenticationService.onLogout.removeCallback(cbLO);
        }
    }, [])

    return (
        <div style={{
            height: "100%",
            overflow: "scroll",
            position: "relative",
            scrollSnapType: "y mandatory",
        }}>
            <div style={{
                backgroundImage: `url(${bgChess3})`,
                backgroundSize: "cover",
                height: "200%",
            }}>
                <div style={{
                    height: "50%",
                    display: "flex",
                    flexDirection: "column",
                    scrollSnapAlign: "start",
                }}>
                    <div style={{
                        fontSize: "100px",
                        paddingTop: "70px",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                        userSelect: "none",
                        textAlign: "center",
                        textShadow: "3px -3px 0px rgba(255, 255, 255, 1), -5px 5px 5px rgba(255, 255, 255, 1)"
                    }}>XIANGQI ONLINE</div>
                    <div style={{
                        display: "grid",
                        justifyContent: "center",
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            color: "rgb(38, 38, 38)",
                            fontSize: "20px",
                            boxShadow: "0px 0px 10px black",
                            marginTop: "50px",
                            background: "white",
                            borderRadius: "10px",
                            height: "250px",
                            width: "350px",
                            alignContent: "center",
                            userSelect: "none",
                            fontWeight: "bold"
                        }}>
                            {isAuthenticated ? <>
                                <div style={{ textAlign: "center" }}>Join a lobby to play</div>
                                <div style={{ display: "grid", justifyContent: "center" }}>
                                    <button className='btn btn-primary' style={{ width: "150px", fontWeight: "bold", height: "40px" }} onClick={() => { navigate("/lobbies") }}>To lobbies</button>
                                </div>
                            </> : <>
                                <div style={{ marginTop: "20px", textAlign: "center" }}>First time here?</div>
                                <div style={{ flexGrow: "1", display: "grid", justifyContent: "center" }}>
                                    <button className='btn btn-primary' style={{ width: "150px", fontWeight: "bold", height: "40px" }} onClick={() => { navigate("/sign-up") }}>Sign up</button>
                                </div>
                                <div style={{ textAlign: "center" }}>Already have an account?</div>
                                <div style={{ flexGrow: "1", display: "grid", justifyContent: "center" }} onClick={() => { navigate("/sign-in") }}>
                                    <button className='btn btn-primary' style={{ width: "150px", fontWeight: "bold", height: "40px" }}>Sign in</button>
                                </div>
                            </>}
                        </div>
                    </div>
                    <div style={{ flexGrow: "1" }}></div>
                    <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "30px", color: "rgb(38, 38, 38)", marginBottom: "40px" }}>
                        <div>Leader board</div>
                        <i className="bi bi-arrow-down-circle"></i>
                    </div>
                </div>
                <div style={{
                    minHeight: "50%",
                    scrollSnapAlign: "start"
                }}>
                    <div style={{
                        userSelect: "none",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "70px",
                        paddingTop: "70px",
                        textShadow: "3px -3px white, -3px 3px 10px white"
                    }}>Leader board</div>
                    <div style={{
                        marginTop: "40px",
                        display: "grid",
                        justifyContent: "center"
                    }}>
                        <div style={{
                            width: "350px",
                            minHeight: "200px",
                            background: "white",
                            borderRadius: "10px",
                            boxShadow: "0px 0px 10px black",
                        }}>
                            <table className='table' style={{
                            }}>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Rp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {createTopPlayer(players)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

function createTopPlayer(players: string[]) {
    const result = players.map((v, i) => {
        const arr = v.split(" ");

        return <tr key={i}>
            <th>{i + 1}</th>
            <td>{arr[0]}</td>
            <td>{arr[1]}</td>
        </tr>
    });

    return result;
}

function fetchPlayer(clb: (result: string[]) => void) {
    PlayerService.GetTopPlayers(20, (result) => {
        if (result) clb(result);
    })
}

export default MainPage