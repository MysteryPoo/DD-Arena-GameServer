
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { SyncPosition } from "../Messages/SyncPosition";
import { GameServer } from "../../../GameServer";

export class SyncPositionHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : SyncPosition = new SyncPosition(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            let gameServer : GameServer = myClient.connectionManager as GameServer;

            for (let [id, client] of gameServer.getAllSockets()) {
                client.write(message.serialize());
            }
            return true;
        } else {
            return false;
        }
    }

}
