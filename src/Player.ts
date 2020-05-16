import { IPlayer } from "./Interfaces/IPlayer";
import { CARD } from "./GameServer";

export class Player implements IPlayer {

    controlledBy: number = -1;
    armySize: number = 0;
    card: CARD = CARD.NONE;
    inOrbit: boolean = false;
    isTargetable: boolean = true;
    trophyList: number[] = new Array<number>(20);

	constructor (public id : string, public name : string, public isAI : boolean, public token : number) {
        
    }
    
}
