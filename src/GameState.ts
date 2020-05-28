
import { IGameState } from "./Interfaces/IGameState";
import { GameServer, MESSAGE_ID } from "./GameServer";
import { GameState } from "./Protocol/GameServerInterface/Messages/GameState";

export enum GAMESTATE {
    FIRST,
    WAITING = FIRST,
    COUNTDOWN,
    GAMEPLAY,
    END,
    INVALID,
    LAST = INVALID
};

export abstract class GameStateBase implements IGameState {

    constructor(protected gameServer : GameServer) {}

    protected notifyClients(metaData : number) : void {
        let message : GameState = new GameState(MESSAGE_ID.GAMESTATE);
        message.gameState = this.getType();
        message.metaData = metaData;

        for (let [uid, client] of this.gameServer.getAllSockets()) {
            client.write(message.serialize());
        }
    }

    abstract update(): void;
    abstract getName() : string;
    abstract getType() : GAMESTATE;

}

export class GameStateWaiting extends GameStateBase {

    private timer : number = 10;
    private playerCount : number = this.gameServer.getNumberOfPlayers();

    update(): void {
        let playerCount = 0;
        for (let [uid, client] of this.gameServer.getAllSockets()) {
            if (client.authenticated) {
                playerCount += 1;
            }
        }

        if (playerCount + this.gameServer.getNumberOfBots() >= this.playerCount) {
            this.gameServer.gameState = new GameStateCountdown(this.gameServer);
        }

        if (this.timer-- < 0) {
            this.gameServer.shutdown("Game State : Waiting timed out.");
        }

        this.notifyClients(Math.max(0, this.timer));
    }

    getName() : string {
        return "Waiting";
    }

    getType() : GAMESTATE {
        return GAMESTATE.WAITING;
    }

}

export class GameStateCountdown extends GameStateBase {

    private timer : number = 3;

    update(): void {
        this.notifyClients(Math.max(0, this.timer));

        if (this.timer-- < 0) {
            this.gameServer.gameState = new GameStateGamePlay(this.gameServer);
            this.gameServer.startGame();
        }
    }

    getName(): string {
        return "Countdown";
    }

    getType(): GAMESTATE {
        return GAMESTATE.COUNTDOWN;
    }

}

export class GameStateGamePlay extends GameStateBase {

    private timer : number = 30;

    update(): void {
        this.notifyClients(this.timer);

        let numberOfPlayersAlive = 0;
        for (let player of this.gameServer.playerMap.values()) {
            if (player.hitPoints > 0) {
                numberOfPlayersAlive += 1;
            }
        }

        if (numberOfPlayersAlive === 0) {
            this.gameServer.gameState = new GameStateEnd(this.gameServer);
        }
    }

    getName(): string {
        return "Gameplay";
    }

    getType(): GAMESTATE {
        return GAMESTATE.GAMEPLAY;
    }

}

export class GameStateEnd extends GameStateBase {

    update(): void {
        this.notifyClients(0);
    }

    getName(): string {
        return "End";
    }

    getType(): GAMESTATE {
        return GAMESTATE.END;
    }

}
