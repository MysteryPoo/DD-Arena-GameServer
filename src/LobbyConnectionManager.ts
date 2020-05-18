
import { IConnectionManager } from "./Interfaces/IConnectionManager";
import { LobbyClient } from "./LobbyClient";
import { ISocket } from "./Interfaces/ISocket";
import { Socket } from "net";
import { IMessageHandler } from "./Interfaces/IMessageHandler";
import { BattleReport } from "./Protocol/LobbyServerInterface/Messages/BattleReport";

export enum MESSAGE_ID {
    FIRST,
    "Challenge" = FIRST,
	"Handshake",
	"Ping",
	"NotifyState",
    "BattleReport",
    INVALID,
    LAST = INVALID
};

export class LobbyConnectionManager implements IConnectionManager {

    public handlerList : IMessageHandler[] = [];
    private lobbyInterface : LobbyClient | undefined;

    constructor() {
        this.reconnect();
    }

    // TODO : Implement correctly
    reportGame(/* GameState */) : void {
        if (this.lobbyInterface) {
            console.debug("Reporting game.");
            let report : BattleReport = new BattleReport(MESSAGE_ID.BattleReport);
            report.winnerId = this.lobbyInterface.hostId;
            report.playerList = [{id : this.lobbyInterface.hostId, score : 100, trophyList : [
                1,4,10,0,0,2,0,0,0,0,1,4,10,0,0,2,0,0,0,0
            ]}];

            this.lobbyInterface.write(report.serialize());
        }
    }

    destroy() : void {
        if (this.lobbyInterface) {
            this.lobbyInterface.destroy();
        }
    }

    handleDisconnect(client: ISocket): void {
        if (client === this.lobbyInterface) {
            console.debug("Connection to lobby disrupted.");
            this.lobbyInterface.destroy();
        }
    }

    private reconnect() : void {
        if (process.env.NOMATCHMAKING === "0") {
            if (this.lobbyInterface) {
                console.debug(this.lobbyInterface.lastConnectionError);
                this.lobbyInterface.destroy();
            }
            this.lobbyInterface = new LobbyClient(new Socket(), [], this, process.env.PASSWORD!, process.env.HOST!, {port : Number(process.env.AUTHPORT!), host : process.env.AUTHIP});
        }
    }

    getLobby() : LobbyClient | undefined {
        return this.lobbyInterface;
    }

}
