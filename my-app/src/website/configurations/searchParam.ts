import { Location } from "react-router-dom";
import { URLSearchParams } from "url";

export class SearchParam {
  private urlParams: URLSearchParams;

  public get successful() {
    return this.getBool("successful");
  }

  public getBool(key: string) {
    return this.urlParams.get(key) === "true";
  }

  public getInt(key: string) {
    let value = this.urlParams.get(key);
    return !value ? -1 : Number.parseInt(value);
  }

  public getFloat(key: string) {
    let value = this.urlParams.get(key);
    return !value ? -1 : Number.parseFloat(value);
  }

  constructor(searchPath: string) {
    this.urlParams = new URLSearchParams(searchPath);
  }
}