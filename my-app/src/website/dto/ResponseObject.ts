import HttpStatus from "../configurations/status";

// the object that the server will response with
export default class ResponseObject<T> extends Object {
  constructor(
    public readonly status: HttpStatus,
    public readonly statusName: string,
    public readonly message: string,
    public readonly data: T
  ) {super();}
}
