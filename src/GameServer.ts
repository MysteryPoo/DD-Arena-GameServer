
import { ServerBase } from "./Abstracts/ServerBase";
import { IClient } from "./Interfaces/IClient";
import { Socket } from "net";
import { IServer } from "./Interfaces/IServer";
import { UserClient } from "./UserClient";
import { IConnectionManager } from "./Interfaces/IConnectionManager";
import { LobbyConnectionManager } from "./LobbyConnectionManager";
import { Challenge } from "./Protocol/GameServerInterface/Messages/Challenge";
import { HandshakeHandler } from "./Protocol/GameServerInterface/Handlers/Handshake";
import { PingHandler } from "./Protocol/GameServerInterface/Handlers/Ping";
import { ControllerHandler } from "./Protocol/GameServerInterface/Handlers/Controller";
import { SyncPositionHandler } from "./Protocol/GameServerInterface/Handlers/SyncPosition";

export enum MESSAGE_ID {
    FIRST,
    CHALLENGE = FIRST,
	HANDSHAKE,
	PING,
    PLAYERDATA,
    CONTROLLER,
    SYNCPOSITION,
	GAMEOVER,
	SETVOIP,
	VOIPDATA,
    INVALID,
    LAST = INVALID
};

export class ClientController {
    public isLeft : boolean = false;
    public isRight : boolean = false;
    public isUp : boolean = false;
    public isDown : boolean = false;
    public isPrimaryAction : boolean = false;
    public isSecondaryAction : boolean = false;
    public pointerX : number = 0;
    public pointerY : number = 0;

    constructor(private client : IClient) {}

    public setClient(client : IClient) : void {
        this.client = client;
    }

    public isMe(client : IClient) : boolean {
        return client === this.client;
    }
}

export class GameServer extends ServerBase implements IServer, IConnectionManager {

    public playerList : ClientController[] = [];
    private isGameRunning : boolean = false;

    constructor(private lobbyConnMgr : LobbyConnectionManager) {
        super();
        this.registerHandler<HandshakeHandler>(MESSAGE_ID.HANDSHAKE, HandshakeHandler);
        this.registerHandler<PingHandler>(MESSAGE_ID.PING, PingHandler);
        this.registerHandler<ControllerHandler>(MESSAGE_ID.CONTROLLER, ControllerHandler);
        this.registerHandler<SyncPositionHandler>(MESSAGE_ID.SYNCPOSITION, SyncPositionHandler);

        this.on('connection', this.onConnection);
        this.on('close', () => {
            this.socketMap.clear();
            console.log("Server no longer listening...");
        });
        this.on('listening', () => {
            console.log("Listening on port: " + this.port);
        });
    }

    getAllSockets() : Map<string, IClient> {
        return this.socketMap;
    }

    createPlayer(client : IClient) : number {
        this.playerList.push(new ClientController(client));
        return this.playerList.length - 1;
    }

    startGame() : void {
        this.isGameRunning = true;
    }

    handleDisconnect(client: IClient): void {
        this.removeClient(client);

        if (this.socketMap.size === 0) {
            console.debug("Shutting down... No users connected.");
            this.lobbyConnMgr.destroy();
            this.close();
            this.unref();
        }
    }

    removeClient(client: IClient): void {
        this.socketMap.delete(client.uid);
        client.destroy();
    }

    private onConnection(rawSocket : Socket) {
        const client = new UserClient(rawSocket, this.handlerList, this);
        this.socketMap.set(client.uid, client);

        console.debug(`Client connected.`);

        let message : Challenge = new Challenge(MESSAGE_ID.CHALLENGE);
        client.write(message.serialize());
    }

    public async start(port: number = 8080): Promise<boolean> {
        console.log("Server starting...");
        return new Promise<boolean>( (resolve, reject) => {
            this.port = port;
            this.listen( {port: port, host: "0.0.0.0"}, () => {
                if (process.env.NOMATCHMAKING === "0") {
                    setTimeout( () => {
                        this.getConnections( (err, count : number) => {
                            if (count === 0) {
                                console.debug("Shutting down... No one has connected before the timeout.");
                                this.close();
                                this.unref();
                                this.lobbyConnMgr.destroy();
                            }
                        });
                    }, 5000);
                }
                resolve(true);
            });
        });
    }

}
