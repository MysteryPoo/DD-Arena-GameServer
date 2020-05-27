
import { IMessageHandler } from "./Interfaces/IMessageHandler";
import { ClientBase } from "./Abstracts/ClientBase";
import { Socket, SocketConnectOpts } from "net";
import { ChallengeHandler } from "./Protocol/LobbyServerInterface/Handlers/Challenge";
import { Ping } from "./Protocol/LobbyServerInterface/Messages/Ping";
import { PingHandler } from "./Protocol/LobbyServerInterface/Handlers/Ping";
import { IConnectionManager } from "./Interfaces/IConnectionManager";
import { MESSAGE_ID } from "./LobbyConnectionManager";
import { HandshakeHandler } from "./Protocol/LobbyServerInterface/Handlers/Handshake";

export class LobbyClient extends ClientBase {

    public playerIdList : Array<string> = [];
    public playerTokenList : Array<number> = [];

    private pingTimer = setInterval( () => {
        let ping : Ping = new Ping(MESSAGE_ID.Ping);
        ping.time = BigInt(Date.now());

        console.debug(`Sending ping: ${ping.time}`);
        if (!this.write(ping.serialize())) {
            
        }
    }, 10000);

    constructor(
        socket : Socket,
        handlerList : IMessageHandler[],
        connectionManager : IConnectionManager,
        readonly gameServerPassword : string,
        readonly hostId : string,
        connectionOptions? : SocketConnectOpts, 
        onConnectCallback? : () => void
        ) {
        super(socket, handlerList, connectionManager, connectionOptions, onConnectCallback);

        this.registerHandler<ChallengeHandler>(MESSAGE_ID.Challenge, ChallengeHandler);
        this.registerHandler<PingHandler>(MESSAGE_ID.Ping, PingHandler);
        this.registerHandler<HandshakeHandler>(MESSAGE_ID.Handshake, HandshakeHandler);
    }

    public destroy() : void {
        clearInterval(this.pingTimer);
        this.pingTimer.unref();
        super.destroy();
    }

    GetMessageTypeString(identifier: number): string {
        return MESSAGE_ID[identifier];
    }
    
    ValidateMessageId(identifier : number): boolean {
        return identifier >= MESSAGE_ID.FIRST && identifier <= MESSAGE_ID.LAST;
    }

    // TODO : Probably need to refactor this into a class/interface "Network" since both clients and servers need this
    protected registerHandler<T extends IMessageHandler>(messageId : number, handler : {new(messageId : number) : T; }) {
        this.handlerList[messageId] = new handler(messageId);
    }

    public getPlayerIdList() : Array<string> {
        return this.playerIdList;
    }

    public getPlayerTokenList() : Array<number> {
        return this.playerTokenList;
    }
}
