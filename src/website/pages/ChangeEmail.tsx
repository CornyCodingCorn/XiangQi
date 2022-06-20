import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { bgChess2 } from '../../resources/backgrounds/bgIndex';
import { RequestService } from '../services/RequestService';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppAxiosHeaders } from '../configurations/axiosConfig';

export interface IChangeEmailProps {

}

let confirmPass = "";
let pass = "";

const ChangeEmail = (props: IChangeEmailProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState("");
    const param = new URLSearchParams(location.search);

    useEffect(() => {
        confirmPass = "";
        pass = "";
    }, []);



    return (
        <div style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${bgChess2})`,
            backgroundSize: "cover",
            display: "grid",
            justifyContent: "center",
            alignContent: "center"
        }}>
            <div style={{
                width: "400px",
                borderRadius: "10px",
                height: "250px",
                display: "flex",
                backgroundColor: "white",
                flexDirection: "column",
                boxShadow: "0px 0px 20px rgba(38, 38, 38, 0.5)"
            }}>
                <div style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "25px",
                    marginTop: "15px"
                }}>Change password</div>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: "20px",
                }}>
                    <span style={{ marginRight: "15px", width: "140px" }}>New password</span>
                    <input type="password" onChange={e => { pass = e.target.value }}></input>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: "20px",
                }}>
                    <span style={{ marginRight: "15px", width: "140px" }}>Confirm password</span>
                    <input type="password" onChange={e => { confirmPass = e.target.value }}></input>
                </div>

                <div style={{ color: "red", textAlign: "center", marginTop: "10px" }}>{error}</div>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: error ? "10px" : "20px",
                }}>
                    <button className='btn btn-primary fw-bold' style={{ width: "170px" }} onClick={() => {
                        if (pass !== confirmPass) {
                            setError("Password must be the same");
                        } else {
                            var token = param.get("token");
                            if (token) {
                                RequestService.ChangePassword(token, pass, (err) => {
                                    if (err) {
                                        setError(err.message);
                                        return;
                                    }

                                    localStorage[AppAxiosHeaders.JWT] = undefined;
                                    navigate("/sign-in");
                                })
                            }
                        }
                    }}>Change password</button>
                </div>
            </div>
        </div>
    )
}

ChangeEmail.propTypes = {}

export default ChangeEmail