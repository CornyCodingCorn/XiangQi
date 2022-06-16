export class LobbySetting {
  constructor(
    public readonly minPerTurn: number,
    public readonly totalMin: number,
  
    public readonly isVsBot: boolean,
    public readonly isPrivate: boolean,
  ) {}
}
