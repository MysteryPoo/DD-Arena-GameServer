
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { IClient } from "../../../Interfaces/IClient";
import { SyncPosition } from "../Messages/SyncPosition";
import { GameServer, Player } from "../../../GameServer";

export class SyncPositionHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : SyncPosition = new SyncPosition(this.messageId, buffer);

        if (message.valid && myClient.authenticated) {
            let gameServer : GameServer = myClient.connectionManager as GameServer;

            if (gameServer.getHost() === myClient.uid) {
                let player : Player | undefined = gameServer.playerMap.get(message.key);
                if (player) {
                    // Capture data
                    player.networkX = message.x;
                    player.networkY = message.y;
                    player.hitPoints = message.hitPoints;
                    // Repeat message to clients
                    for (let [id, client] of gameServer.getAllSockets()) {
                        // Filter out host
                        if (client.uid !== myClient.uid) {
                            client.write(message.serialize());
                        }
                    }
                }
            }
            return true;
        } else {
            return false;
        }
    }

}
