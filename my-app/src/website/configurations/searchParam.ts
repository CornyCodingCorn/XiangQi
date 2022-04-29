export class SearchParam extends Object {
  private urlParams: URLSearchParams;

  public get successful() {
    return this.getBool("successful");
  }
  public set successful(value) {
    this.urlParams.set("successful", value ? "true" : "false");
  }

  public getBool(key: string) {
    let value = this.urlParams.get(key);
    return value === "true";
  }

  public setBool(key: string, value: boolean) {
    this.urlParams.set(key, value ? "true" : "false");
    return value;
  }

  public getInt(key: string) {
    let value = this.urlParams.get(key);
    return !value ? -1 : Number.parseInt(value);
  }

  public setInt(key: string, value: number) {
    let valueStr = Math.round(value).toString();
    this.urlParams.set(key, valueStr);
    return value;
  }

  public getFloat(key: string) {
    let value = this.urlParams.get(key);
    return !value ? -1 : Number.parseFloat(value);
  }
  public setFloat(key: string, value: number) {
    let valueStr = value.toString();
    this.urlParams.set(key, valueStr);
    return value;
  }

  constructor()
  constructor(searchPath: string)
  constructor(searchPath?: string) {
    super();
    this.urlParams = new URLSearchParams(searchPath);
  }

  override toString() {
    return this.urlParams.toString();
  }
}