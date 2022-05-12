import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./TopBar.css";

export interface ITopBarProps {}

export default function TopBar(props: ITopBarProps) {
  let navigate = useNavigate();

  return (
    <div className="d-none d-md-block ms-auto align-items-end">
        <button type="button" onClick={() => navigate("/sign-in")} className="btn btn-sm btn-primary fw-bold me-3">
          Sign in
        </button>
        <button type="button" onClick={() => navigate("/sign-up")} className="btn btn-sm btn-primary fw-bold">
          Sign up
        </button>
    </div>
  );
}
