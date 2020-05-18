
import { Ping } from "../Messages/Ping";
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { ISocket } from "../../../Interfaces/ISocket";

export class PingHandler extends MessageHandlerBase {

    public handle(buffer : Buffer, myClient: ISocket) : boolean {
        let message : Ping = new Ping(this.messageId, buffer);

        if (message.valid) {
            return true;
            //return myClient.write(message.serialize());
        } else {
            return false;
        }
    }
}
