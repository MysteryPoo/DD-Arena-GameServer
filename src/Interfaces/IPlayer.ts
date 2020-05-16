
import { CARD } from "../GameServer";

export interface IPlayer {
    // Public properties
    name : string;
    isAI : boolean;
    controlledBy : number;
    armySize : number;
    card : CARD;
    inOrbit : boolean;
    isTargetable : boolean;
    // Server properties
    token : number;
    id : string;
    // Trophies Earned
    trophyList : Array<number>;
}
