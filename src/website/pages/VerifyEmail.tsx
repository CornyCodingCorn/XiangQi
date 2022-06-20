import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useNavigate } from 'react-router-dom';
import { RequestService } from '../services/RequestService';
import { bgChess1, gameplayBgRed } from '../../resources/backgrounds/bgIndex';

export interface IVerifyEmailProps {

}

const VerifyEmail = (props: IVerifyEmailProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const param = new URLSearchParams(location.search);
    const [text, setText] = useState("Verifying email...");

    useEffect(() => {
        const token = param.get("token");
        if (token) {
            RequestService.VerifyEmail(token, (err) => {
                setText(err ? "Verify failed" : "Verify successful")
            });
        } else {
            setText("No token provided!");
        }
    }, []);

    return (
        <div style={{
            height: "100%",
            display: "grid",
            backgroundImage: `url(${bgChess1})`,
            backgroundSize: "cover",
            justifyContent: "center",
            alignContent: "center"
        }}>
            <div style={{
                background: "white",
                borderRadius: "10px",
                width: "400px",
                height: "200px",
                border: "1px solid rgba(38, 38, 38, 0.4)",
                boxShadow: "0px 0px 20px rgba(38, 38, 38, 0.4)",
                display: "grid",
                alignContent: "center",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "20px"
            }}>
                <div>{text}</div>
                <div style={{cursor: "pointer", textDecoration: "underline", fontSize: "15px", marginTop: "15px", color: "#4296eb"}}
                onClick={() => {
                    navigate("/sign-in");
                }}>To login</div>
            </div>
        </div>
    )
}

export default VerifyEmail