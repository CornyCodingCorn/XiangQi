import { DefaultUser } from "../for-ui";
import {default as Coconut} from "./coconut.png";
import {default as Galaxy} from "./galaxy.png";
import {default as Hat} from "./hat.png";
import {default as Lily} from "./lilies.png";
import {default as Lotus} from "./lotus.png";
import {default as Mind} from "./mindfulness.png";
import {default as SpaceShip} from "./space-ship.png";

export enum ProfilesType {
    Coconut,
    Galaxy,
    Hat,
    Lily,
    Lotus,
    Mind,
    SpaceShip
}
export const Profiles = [Coconut, Galaxy, Hat, Lily, Lotus, Mind, SpaceShip];
export function  GetPlayerProfile(profileIndex: number) {
    var profile = Profiles[profileIndex];
    return profile ? profile : DefaultUser;
}