export class LobbyDto {
  constructor(
    public readonly id: string,

    public readonly player1: string,
    public readonly player2: string,
  
    public readonly blackPlayer: string,
    public readonly redPlayer: string
  ) {}
}
