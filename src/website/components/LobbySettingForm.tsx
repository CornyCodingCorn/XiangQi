import * as React from "react";
import "./LobbySettingForm.css";

export interface ILobbySettingFormProps {
  isDisable: boolean;
  onRender: (info: LobbySettingInfo) => void;
  onChange: () => void;
}

interface ILobbySettingInfo {
  minPerTurnInput: HTMLInputElement | null;
  totalMinInput: HTMLInputElement | null;
  isVsBotInput: HTMLInputElement | null;
  isPrivateInput: HTMLSelectElement | null;
}

export class LobbySettingInfo {
  private info: ILobbySettingInfo;

  constructor(info: ILobbySettingInfo) {
    this.info = info;
  }

  public get minPerTurn() {
    return this.info.minPerTurnInput!;
  }
  public get totalMin() {
    return this.info.totalMinInput!;
  }
  public get isVsBot() {
    return this.info.isVsBotInput!;
  }
  public get isPrivate() {
    return this.info.isPrivateInput!;
  }
}

function constructSetting(
  info: ILobbySettingInfo,
  callback: (info: LobbySettingInfo) => void
) {
  if (
    !info.minPerTurnInput ||
    !info.totalMinInput ||
    !info.isVsBotInput || 
    !info.isPrivateInput)
    return;

  callback(new LobbySettingInfo(info));
}

export default function LobbySettingForm(props: ILobbySettingFormProps) {
  let info: ILobbySettingInfo = {
    minPerTurnInput: null,
    totalMinInput: null,
    isVsBotInput: null,
    isPrivateInput: null,
  };

  return (
    <form>
    <div>
      <span>Minutes per turn: </span>
      <input 
        type="number"
        onChange={props.onChange}
        ref={(c) => {
          info.minPerTurnInput = c;
          constructSetting(info, props.onRender);
        }}>
      </input>
    </div>
    <div>
      <span>Total minutes: </span>
      <input 
        type="number"
        onChange={props.onChange}
        ref={(c) => {
          info.totalMinInput = c;
          constructSetting(info, props.onRender);
        }}>
      </input>
    </div>
    <div>
      <span>Play with bot: </span>
      <input 
        type="checkbox"
        onChange={props.onChange}
        ref={(c) => {
          info.isVsBotInput = c;
          constructSetting(info, props.onRender);
        }}>
      </input>
    </div>
    <div>
      <span>Room: </span>
      <select         
        onChange={props.onChange}
        ref={(c) => {
          info.isPrivateInput = c;
          constructSetting(info, props.onRender);
        }}>
        <option>Private</option>
        <option>Public</option>
      </select>
    </div>
    </form>
  );
}