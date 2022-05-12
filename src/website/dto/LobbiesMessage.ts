import { LobbyDto } from "./LobbyDto";

export enum LobbiesMessageType {
  CREATE = "CREATE",
  REMOVE = "REMOVE"
}

export class LobbiesMessage {
  constructor(
    public readonly lobby: LobbyDto,
    public readonly type: LobbiesMessageType,
    public readonly player: string) {}
}
