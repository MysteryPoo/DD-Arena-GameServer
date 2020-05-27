
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { Handshake } from "../Messages/Handshake";
import { LobbyClient } from "../../../LobbyClient";

export class HandshakeHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: LobbyClient): boolean {
        let message : Handshake = new Handshake(this.messageId, buffer);

        if (message.valid) {
            myClient.playerIdList = message.playerIdList;
            myClient.playerTokenList = message.playerTokenList;
            return true;
        } else {
            return false;
        }
    }

}
