import * as React from "react";
import { useEffect, useState } from "react";
import ImagesCollection from "./resources/ImagesCollection";
import "./App.css";
import GamePlay from "./website/pages/gameplay";

export interface IAppProps {}

export default function App(props: IAppProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    ImagesCollection.init(() => {
      setInit(true);
    });
  }, []);

  return !init ? (
    <div className="container vh-100 align-items-center d-flex">
      <div className="row w-100">
        <div className="col-md-4" />
        <div className="col-md-4">
          <div className="card">
            <div className="card-body bg-dark">
              <p className="card-title text-light fs-2 text-center fw-bolder">
                Loading...
              </p>
              <p className="card-title text-light fs-6 text-center fw-bolder">
                Please wait a few second.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // If haven't init
    <div>
			<GamePlay/>
		</div>
  );
}
