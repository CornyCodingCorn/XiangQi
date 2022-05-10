export class LobbyDto {
  constructor(
    public readonly id: string,

    public readonly player1: string,
    public readonly player2: string,
  
    public readonly player1Ready: boolean,
    public readonly player2Ready: boolean,

    public readonly blackPlayer: string,
    public readonly redPlayer: string,

    public readonly board: string,
  ) {}
}
