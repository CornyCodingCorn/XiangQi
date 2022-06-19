export class LobbySetting {
  constructor(
    public readonly minPerTurn: number,
    public readonly totalMin: number,
  
    public readonly vsBot: boolean,
    public readonly privateLobby: boolean,
  ) {}
}
