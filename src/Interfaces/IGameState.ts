import { GAMESTATE } from "../GameState";

export interface IGameState {
    update() : void;
    getName() : string;
    getType() : GAMESTATE;
}
