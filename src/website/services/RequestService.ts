import { AxiosError } from "axios";
import urlJoin from "url-join";
import { AppAxios } from "../configurations/axiosConfig";
import { SERVER_URL } from "../configurations/serverUrl";
import ResponseObject from "../dto/ResponseObject";

const REQUEST_URL = urlJoin(SERVER_URL, "api/request");
const EMAIL_URL = urlJoin(REQUEST_URL, "verify-email");
const PASS_URL = urlJoin(REQUEST_URL, "change-password");

export class RequestService {
    public static VerifyEmail(token: string, clb: (err?: Error) => void) {
        const param = new URLSearchParams();
        param.append("token", token);

        const url = `${EMAIL_URL}?${param.toString()}`;
        AppAxios.put(url)
        .then(() => {
            clb();
        })
        .catch(clb)
    }
    public static ChangePassword(token: string, password: string, clb: (err?: Error) => void) {
        const param = new URLSearchParams();
        param.append("token", token);
        param.append("password", password);

        const url = `${PASS_URL}?${param.toString()}`;
        AppAxios.put(url)
        .then(() => {
            clb();
        })
        .catch(clb)
    }
    public static RequestPasswordChange(username: string, clb: (err?: AxiosError<ResponseObject<any>>) => void) {
        const param = new URLSearchParams();
        param.append("username", username);

        const url = `${PASS_URL}?${param.toString()}`;
        AppAxios.post(url)
        .then(() => {
            clb();
        })
        .catch(clb);
    }
}