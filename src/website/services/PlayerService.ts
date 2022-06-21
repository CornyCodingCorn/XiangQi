import urlJoin from "url-join";
import { AppAxios } from "../configurations/axiosConfig";
import { SERVER_URL } from "../configurations/serverUrl";
import { Match } from "../dto/Match";
import PlayerDto from "../dto/PlayerDto";
import ResponseObject from "../dto/ResponseObject";
import AuthenticationService from "./AuthenticationService";

const PLAYER_URL = urlJoin(SERVER_URL, "api/player");
const PROFILE_URL = urlJoin(PLAYER_URL, "profile");
const HISTORY_URL = urlJoin(PLAYER_URL, "history");
const RANK_URL = urlJoin(PLAYER_URL, "rank");

export class PlayerService {
    public static GetPlayer(username: String, clb: (result?: PlayerDto, err?: Error) => void): void {
        AppAxios.get(`${PLAYER_URL}?username=${username}`).then((res) => {
            let resObj = res.data as ResponseObject<PlayerDto>;
            clb(resObj.data);
        })
        .catch((err) => {
            clb(undefined, err);
        });
    }

    public static ChangePlayerProfile(profile: number, clb: (result?: PlayerDto, err?: Error) => void) {
        let param = new URLSearchParams();
        param.append("username", AuthenticationService.playerInfo!.username);
        param.append("profile", profile.toString());

        const url = `${PROFILE_URL}?${param.toString()}`;
        AppAxios.put(url).then((res) => {
            let resObj = res.data as ResponseObject<PlayerDto>;
            clb(resObj.data);
        })
        .catch((err) => {
            clb(undefined, err);
        });
    }

    public static GetPlayerMatches(clb: (result?: Match[], err?: Error) => void) {
        let param = new URLSearchParams();
        param.append("username", AuthenticationService.playerInfo!.username);
        
        const url = `${HISTORY_URL}?${param.toString()}`;
        AppAxios.get(url).then((res) => {
            let resObj = res.data as ResponseObject<Match[]>;
            clb(resObj.data);
        })
        .catch((err) => {
            clb(undefined, err);
        });
    }

    public static GetTopPlayers(count: number, clb: (result?: string[], err?: Error) => void) {
        let param = new URLSearchParams();
        param.append("count", count.toString());

        const url = `${RANK_URL}?${param.toString()}`;
        AppAxios.get(url).then((res) => {
            let resObj = res.data as ResponseObject<string[]>;
            clb(resObj.data);
        })
        .catch((err) => {
            clb(undefined, err);
        });
    }
}