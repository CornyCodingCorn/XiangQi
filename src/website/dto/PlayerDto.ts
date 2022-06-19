export default class PlayerDto {
  public constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly profile: number,
    public readonly winLostRatio: number,
    public readonly totalMatches: number,
    public readonly rank: number,
    public readonly email: string
  ) {}
}
