
import { IClient } from "./IClient";
import { IMessageHandler } from "./IMessageHandler";

export interface IServer {
    
    handlerList : Array<IMessageHandler>;

    removeClient(client : IClient) : void;
}
