import * as React from "react";
import { useEffect } from "react";
import ImagesCollection from "./resources/ImagesCollection";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./website/pages/Home";
import SignIn from "./website/pages/SignIn";
import SignUp from "./website/pages/SignUp";
import AuthenticationService from "./website/services/AuthenticationService";

export interface IAppProps {}

export default function App(props: IAppProps) {
  useEffect(() => {
    ImagesCollection.init();
    AuthenticationService.Init();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
