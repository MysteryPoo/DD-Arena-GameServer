
import { ISocket } from "./ISocket";
import { IConnectionManager } from "./IConnectionManager";

export interface IClient extends ISocket {
    uid : string;
    authenticated : boolean;
    readonly connectionManager : IConnectionManager;

    ValidateMessageId(identifier : number) : boolean;
}
