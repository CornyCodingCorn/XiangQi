import { LobbyDto } from "./LobbyDto";

export enum LobbyMessageType {
  JOIN = "JOIN",
  DISCONNECT = "DISCONNECT",
  CHANGE_READY = "CHANGE_READY",
  MOVE = "MOVE",
  START = "START",
  END = "END",
}

export enum LobbyMessageEndType {
  WIN = "WIN",
  DRAW = "DRAW",
}

export class LobbyMessage {
  constructor(
    public readonly player: string,
    public readonly type: LobbyMessageType,
    public readonly data?: string,
    public readonly lobby?: LobbyDto
    ) {}
}
