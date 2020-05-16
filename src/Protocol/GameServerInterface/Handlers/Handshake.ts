
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { Handshake } from "../Messages/Handshake";
import { IClient } from "../../../Interfaces/IClient";
import { GameServer } from "../../../GameServer";

export class HandshakeHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : Handshake = new Handshake(this.messageId, buffer);

        if (message.valid) {
            // TODO : Do this ...
            let response : Handshake = new Handshake(this.messageId);
            response.error = 0;
            response.playerIndexOnServer = 0;

            myClient.write(response.serialize());

            (myClient.connectionManager as GameServer).startGame();
            return true;
        } else {
            return false;
        }
    }

}
