import * as React from "react";
import "./SignUp.css";
import SignUpForm, { SignUpInfo } from "../components/SignUpForm";
import background from "../../resources/backgrounds/chessBackground.bmp";

export interface ISignInProps {}

export default function SignIn(props: ISignInProps) {
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
          onSubmit={() => login(info)}
        />
      </div>
    </div>
  );
}

function login(info: SignUpInfo) {}
