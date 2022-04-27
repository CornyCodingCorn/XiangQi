export default class Vector2 {
  public x = 0;
  public y = 0;

  private constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static create(x: number, y: number) {
    return new Vector2(x, y);
  }

  public isEqual(other: Vector2) {
    return this.x === other.x && this.y === other.y;
  }

  public equal(other: Vector2) {
    this.x = other.x;
    this.y = other.y;
  }
}