
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { AuthenticationChallenge } from "../Messages/Challenge";
import { LobbyClient } from "../../../LobbyClient";
import { Handshake } from "../Messages/Handshake";
import { MESSAGE_ID } from "../../../LobbyConnectionManager";

export class ChallengeHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: LobbyClient): boolean {
        let message : AuthenticationChallenge = new AuthenticationChallenge(this.messageId, buffer);

        if (message.valid) {
            let response : Handshake = new Handshake(MESSAGE_ID.Handshake);
            response.gameVersion = 0;
            response.gameServerPassword = myClient.gameServerPassword;
            response.playerIdList = [myClient.hostId];
            myClient.write(response.serialize());
            return true;
        } else {
            return false;
        }
    }

}
