import * as React from "react";
import "./SignUp.css";
import SignUpForm, { SignUpInfo } from "../components/SignUpForm";
import background from "../../resources/backgrounds/chessBackground.bmp";
import AuthenticationService from "../services/AuthenticationService";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { RequestService } from "../services/RequestService";

export interface ISignInProps {}

export default function SignIn(props: ISignInProps) {
  const [error, setError] = React.useState("");
  const [isError, setIsError] = React.useState(false);
  let navigate = useNavigate();
  let info: SignUpInfo;

  return (
    <div
      className="d-flex background-wrapper align-content-center h-100"
      style={{ backgroundImage: `url(${background})`, backgroundSize: "cover" }}
    >
      <div className="form-wrapper row w-100 justify-content-center">
        <SignUpForm
          text={error}
          isError={isError}
          tittle={"Sign in"}
          buttonText="Sign in"
          linkText="Haven't sign up?"
          isSignIn={true}
          linkUrl={"/sign-up"}
          onRender={(c) => (info = c)}
          onSubmit={() => login(info, navigate, (err) => {
            setError(err);
            setIsError(true);
          })}
          onForgotPassword={() => {
            {
              setError("Email sent, please check your mail box!");
              setIsError(false);
              RequestService.RequestPasswordChange(info.username, (err) => {
                if (err) {
                  setError(err.response!.data.message);
                  setIsError(true);
                }
            })}
          }}
        />
      </div>
    </div>
  );
}

function login(info: SignUpInfo, nav: NavigateFunction, errClb: (err: string) => void) {
  AuthenticationService.Login(info.username, info.password, function(err, data) {
    if (err) {
      errClb(err.response!.data.message);
      return;
    }

    nav("/");
  });
}
