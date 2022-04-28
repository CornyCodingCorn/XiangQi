import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import "./SignUp.css";
import background from "../../resources/backgrounds/chessBackground.bmp";
import { SearchParam } from "../configurations/searchParam";
import SignUpForm, { SignUpInfo } from "../components/SignUpForm";

export interface ISignUpProps {}

export default function SignUp(props: ISignUpProps) {
  const location = useLocation();
  const [successful, setSuccessful] = React.useState(false);

  let info: SignUpInfo;

  React.useEffect(() => {
    const searchParam = new SearchParam(location.search);
    setSuccessful(searchParam.successful);
  }, [location])


  return (
    <div
      className="d-flex align-content-center h-100"
      style={{ backgroundImage: `url(${background})`, backgroundSize: "cover" }}
    >
      <div className="form-wrapper row w-100 justify-content-center">
        {successful ? (
          <form className="signUpForm ms-4 col-xl-6 col-lg-8 col-10 align-self-center">
            <div className="card card-body rounded-3 shadow fw-bold">
              Register successfully :D
            </div>
          </form>
        ) : (
          <SignUpForm
            buttonText="Sign up"
            linkText="Already have an account?"
            isSignIn={false}
            linkUrl={"/sign-in"}
            onRender={(c) => (info = c)}
            onSubmit={() => register(info)}
          />
        )}
      </div>
    </div>
  );
}

function register(info: SignUpInfo) {
  console.log(info.username);
  // Check if password is correct
}
