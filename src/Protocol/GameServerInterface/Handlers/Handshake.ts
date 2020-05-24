
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { Handshake } from "../Messages/Handshake";
import { IClient } from "../../../Interfaces/IClient";
import { GameServer, ClientController } from "../../../GameServer";

export class HandshakeHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : Handshake = new Handshake(this.messageId, buffer);
        
        if (message.valid) {
            let gameServer : GameServer = myClient.connectionManager as GameServer;
            // TODO : Verify version and token are valid
            
            let response : Handshake = new Handshake(this.messageId);
            response.error = 0;

            myClient.authenticated = true;
            myClient.write(response.serialize());

            // Override provided token if in Independent Server Mode
            if (message.token === 0 && process.env.NOMATCHMAKING) {
                message.token = 1000 + gameServer.getAllSockets().size - 1;
            }

            console.debug(`Requested Token: ${message.token}`);

            // Take control of player objects
            for (let player of gameServer.playerMap.values()) {
                if (player.metaProperties.token === message.token) {
                    player.ownedBy = myClient.uid;
                    let controller : ClientController | undefined = gameServer.controllerMap.get(player.controllerKey);
                    if (controller) {
                        controller.setClient(myClient);
                    }
                }
            }

            // TODO : Do this when all players are connected unless NOMATCHMAKING
            gameServer.startGame();
            return true;
        } else {
            return false;
        }
    }

}
