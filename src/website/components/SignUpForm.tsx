import * as React from "react";
import { Link } from "react-router-dom";
import "./SignUpForm.css";

export interface ISignUpFormProps {
  linkUrl: String;
  isSignIn: boolean;
  linkText: String;
  buttonText: String;
  tittle: String;
  onRender: (info: SignUpInfo) => void;
  onSubmit: () => void;
}

interface ISignUpInfo {
  usernameInput: HTMLInputElement | null;
  passwordInput: HTMLInputElement | null;
  emailInput: HTMLInputElement | null;
  passwordConfirmInput: HTMLInputElement | null;
}

export class SignUpInfo {
  private info: ISignUpInfo;

  constructor(info: ISignUpInfo) {
    this.info = info;
  }

  public get username() {
    return this.info.usernameInput!.value;
  }
  public get email() {
    return this.info.emailInput!.value;
  }
  public get password() {
    return this.info.passwordInput!.value;
  }
  public get passwordConfirm() {
    return this.info.passwordConfirmInput!.value;
  }
}

function constructInfo(
  info: ISignUpInfo,
  signIn: boolean,
  callback: (info: SignUpInfo) => void
) {
  if (
    !info.usernameInput ||
    !info.passwordInput ||
    (!signIn && (!info.emailInput || !info.passwordConfirmInput))
  )
    return;

  callback(new SignUpInfo(info));
}

export default function SignUpForm(props: ISignUpFormProps) {
  let info: ISignUpInfo = {
    usernameInput: null,
    emailInput: null,
    passwordConfirmInput: null,
    passwordInput: null,
  };

  return (
    <form className="signUpForm ms-4 col-xl-6 col-lg-8 col-10 align-self-center">
      <div className="card card-rounded card-body shadow px-5 py-5">
        <span className="fw-bold text-center fs-3 mb-5 text-uppercase">{props.tittle}</span>
        <div className="row mb-3">
          <label className="col-md-2 col-form-label fw-bold text-nowrap">
            Username
          </label>
          <div className="col-md-10">
            <input
              type="text"
              placeholder="Username"
              className="form-control"
              ref={(c) => {
                info.usernameInput = c;
                constructInfo(info, props.isSignIn, props.onRender);
              }}
            />
          </div>
        </div>
        {props.isSignIn ? undefined : (
          <div className="row mb-3">
            <label className="col-md-2 col-form-label fw-bold text-nowrap">
              Email
            </label>
            <div className="col-md-10">
              <input
                type="email"
                placeholder="Email"
                className="form-control"
                ref={(c) => {
                  info.emailInput = c;
                  constructInfo(info, props.isSignIn, props.onRender);
                }}
              />
            </div>
          </div>
        )}
        <div className="row mb-3">
          <label className="col-md-2 col-form-label fw-bold text-nowrap">
            Password
          </label>
          <div className="col-md-10">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              ref={(c) => {
                info.passwordInput = c;
                constructInfo(info, props.isSignIn, props.onRender);
              }}
            />
          </div>
        </div>
        {props.isSignIn ? undefined : (
          <div className="row mb-3">
            <label className="col-md-2 col-form-label fw-bold text-nowrap">
              Password
            </label>
            <div className="col-md-10">
              <input
                type="password"
                placeholder="Confirm password"
                className="form-control"
                ref={(c) => {
                  info.passwordConfirmInput = c;
                  constructInfo(info, props.isSignIn, props.onRender);
                }}
              />
            </div>
          </div>
        )}
        <div className="row mt-4 mt-md-5">
          <div className="col-0 col-md-7 col-lg-8 text-center text-md-start text-primary fw-bold">
            <Link to={props.linkUrl.toString()}>{props.linkText}</Link>
          </div>
          <div className="col-12 col-md-5 col-lg-4 mt-2 mt-md-0">
            <button
              type="button"
              onClick={props.onSubmit}
              className="btn btn-primary w-100 fw-bold"
            >
              {props.buttonText}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
