
import { IClient } from "./IClient";
import { IMessageHandler } from "./IMessageHandler";

export interface IConnectionManager {

    handlerList : Array<IMessageHandler>;
    handleDisconnect(client : IClient) : void;

}
