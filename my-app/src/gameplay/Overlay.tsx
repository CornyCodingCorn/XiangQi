import * as React from "react";

export interface IOverlayProps {}

export interface IOverlayStates {}

// Valid path: xy/xy/xy split then render.
export default class Overlay extends React.Component<
  IOverlayProps,
  IOverlayStates
> {
  public render() {
    return <div></div>;
  }
}
