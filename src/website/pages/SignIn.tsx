import * as React from "react";
import "./SignUp.css";
import SignUpForm, { SignUpInfo } from "../components/SignUpForm";
import background from "../../resources/backgrounds/chessBackground.bmp";
import AuthenticationService from "../services/AuthenticationService";
import { NavigateFunction, useNavigate } from "react-router-dom";

export interface ISignInProps {}

export default function SignIn(props: ISignInProps) {
  let navigate = useNavigate();
  let info: SignUpInfo;

  return (
    <div
      className="d-flex background-wrapper align-content-center h-100"
      style={{ backgroundImage: `url(${background})`, backgroundSize: "cover" }}
    >
      <div className="form-wrapper row w-100 justify-content-center">
        <SignUpForm
          tittle={"Sign in"}
          buttonText="Sign in"
          linkText="Haven't sign up?"
          isSignIn={true}
          linkUrl={"/sign-up"}
          onRender={(c) => (info = c)}
          onSubmit={() => login(info, navigate)}
        />
      </div>
    </div>
  );
}

function login(info: SignUpInfo, nav: NavigateFunction) {
  AuthenticationService.Login(info.username, info.password, function(err, data) {
    if (err) return;

    nav("/");
  });
}