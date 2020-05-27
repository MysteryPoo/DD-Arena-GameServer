
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { AuthenticationChallenge } from "../Messages/Challenge";
import { LobbyClient } from "../../../LobbyClient";
import { Handshake } from "../Messages/Handshake";
import { MESSAGE_ID, LobbyConnectionManager } from "../../../LobbyConnectionManager";

export class ChallengeHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: LobbyClient): boolean {
        let message : AuthenticationChallenge = new AuthenticationChallenge(this.messageId, buffer);

        if (message.valid) {
            let connectionManager : LobbyConnectionManager = myClient.connectionManager as LobbyConnectionManager;
            let response : Handshake = new Handshake(MESSAGE_ID.Handshake);
            response.gameVersion = connectionManager.matchMakingProtocolVersion;
            response.gameServerPassword = myClient.gameServerPassword;
            response.playerIdList = [myClient.hostId];
            myClient.write(response.serialize());
            return true;
        } else {
            return false;
        }
    }

}
