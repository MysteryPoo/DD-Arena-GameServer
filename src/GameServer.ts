
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
import { PlayerData } from "./Protocol/GameServerInterface/Messages/PlayerData";

export enum MESSAGE_ID {
    FIRST,
    CHALLENGE = FIRST,
	HANDSHAKE,
	PING,
    PLAYERDATA,
    CONTROLLERDATA,
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

    private controlledBy : clientUID = "";

    public setClient(client : IClient) : void {
        this.controlledBy = client.uid;
    }

    public isMe(client : IClient) : boolean {
        return client.uid === this.controlledBy;
    }
}

export class MetaProperties {
    constructor(public name : string, public token : number) {}
}

type clientUID = string;

export class Player {

    public ownedBy : clientUID | undefined;
    public isAI : boolean = false;

    constructor(public metaProperties : MetaProperties, public controllerKey : number) {}
}

export class GameServer extends ServerBase implements IServer, IConnectionManager {

    public playerMap : Map<number, Player> = new Map();
    public controllerMap : Map<number, ClientController> = new Map();
    private nextControllerId : number = 0;
    private nextPlayerId : number = 0;
    private hostId : clientUID = "";
    private isGameRunning : boolean = false;

    constructor(private lobbyConnMgr : LobbyConnectionManager) {
        super();
        this.registerHandler<HandshakeHandler>(MESSAGE_ID.HANDSHAKE, HandshakeHandler);
        this.registerHandler<PingHandler>(MESSAGE_ID.PING, PingHandler);
        this.registerHandler<ControllerHandler>(MESSAGE_ID.CONTROLLERDATA, ControllerHandler);
        this.registerHandler<SyncPositionHandler>(MESSAGE_ID.SYNCPOSITION, SyncPositionHandler);

        this.on('connection', this.onConnection);
        this.on('close', () => {
            this.socketMap.clear();
            console.log("Server no longer listening...");
        });
        this.on('listening', () => {
            console.log("Listening on port: " + this.port);
        });

        // Independent Server Mode
        if (process.env.NOMATCHMAKING) {
            for (let p = 0; p < 4; ++p) {
                this.playerMap.set(p, new Player(new MetaProperties(`Player${p + 1}`, 1000 + p), this.newController()));
            }
        }
    }

    private newController() : number {
        let controller : ClientController = new ClientController();
        let controllerKey : number = this.nextControllerId++;
        this.controllerMap.set(controllerKey, controller);

        return controllerKey;
    }

    getAllSockets() : Map<string, IClient> {
        return this.socketMap;
    }

    getHost() : string {
        if (this.hostId === "") this.findNewHost();
        return this.hostId;
    }

    getControllerOfPlayer(player : Player) : ClientController | undefined {
        return this.controllerMap.get(player.controllerKey);
    }

    startGame() : void {
        this.isGameRunning = true;
        
        for (let [key, player] of this.playerMap) {
            for (let client of this.socketMap.values()) {
                let message : PlayerData = new PlayerData(MESSAGE_ID.PLAYERDATA);
                message.playerKey = key;
                message.controllerKey = player.controllerKey;
                message.isAI = player.isAI;
                message.name = player.metaProperties.name;
                message.ownerId = player.ownedBy ? player.ownedBy : "none";
                message.isMine = player.ownedBy ? (player.ownedBy === client.uid ? true : false) : false;
                client.write(message.serialize());
            }
        }
    }

    handleDisconnect(client: IClient): void {
        console.debug(`client ${client.uid} has disconnected`);
        console.debug(`hostId: ${this.hostId}`);
        if (this.hostId === client.uid) {
            console.debug(`Host ${client.uid} left... Migrating host...`);
            this.hostId = this.findNewHost();
            // let newHost : IClient | undefined = this.socketMap.get(this.hostId);
            // if( newHost ) {
            //     newHost.write
            // }
        }

        this.removeClient(client);

        if (this.socketMap.size === 0) {
            console.debug("Shutting down... No users connected.");
            this.lobbyConnMgr.destroy();
            this.close();
            this.unref();
        }
    }

    private findNewHost() : string {
        let newHostId : string = "";
        for (let client of this.socketMap.values()) {
            if (client.uid !== this.hostId) {
                this.hostId = client.uid;
                newHostId = client.uid;
                console.debug(`New host id: ${newHostId}`);
                break;
            }
        }
        return newHostId;
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
