
import { ISocket } from "./ISocket";

export interface IMessageHandler {

    readonly messageId : number;
    handle(buffer : Buffer, mySocket: ISocket) : boolean;

}
