
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { Handshake } from "../Messages/Handshake";
import { IClient } from "../../../Interfaces/IClient";
import { GameServer } from "../../../GameServer";

export class HandshakeHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : Handshake = new Handshake(this.messageId, buffer);

        if (message.valid) {
            let gameServer : GameServer = myClient.connectionManager as GameServer;
            let indexOnServer : number = gameServer.createPlayer(myClient);
            let response : Handshake = new Handshake(this.messageId);
            response.error = 0;
            response.playerIndexOnServer = indexOnServer;

            myClient.authenticated = true;
            myClient.write(response.serialize());

            gameServer.startGame();
            return true;
        } else {
            return false;
        }
    }

}
