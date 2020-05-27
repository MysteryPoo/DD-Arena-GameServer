
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { Handshake } from "../Messages/Handshake";
import { IClient } from "../../../Interfaces/IClient";
import { GameServer, ClientController, Player } from "../../../GameServer";
import { GameStateWaiting } from "../../../GameState";
import { LobbyClient } from "../../../LobbyClient";

export class HandshakeHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : Handshake = new Handshake(this.messageId, buffer);
        
        if (message.valid && !myClient.authenticated) {
            let gameServer : GameServer = myClient.connectionManager as GameServer;
            let lobby : LobbyClient | undefined = gameServer.getLobbyConnectionManager().getLobby();
            if (lobby) {
                let index = lobby.playerTokenList.findIndex( (element) => {
                    return element === message.token;
                });
                if (index >= 0) {
                    gameServer.authenticateClient(lobby.playerIdList[index], myClient);
                    let key : number = gameServer.newPlayer(myClient.uid, message.token);
                    let player : Player | undefined = gameServer.playerMap.get(key);
                    if (player) {
                        let controller : ClientController | undefined = gameServer.controllerMap.get(player.controllerKey);
                        if (controller) {
                            controller.setClient(myClient);
                        }
                    }
                }
            }
            // TODO : Verify version and token are valid
            
            let response : Handshake = new Handshake(this.messageId);
            response.error = 0;

            
            myClient.write(response.serialize());

            // Override provided token if in Independent Server Mode
            if (message.token === 0 && !gameServer.isMatchmakingEnabled) {
                message.token = 1000 + gameServer.getAllSockets().size - 1;

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
            }

            console.debug(`Requested Token: ${message.token}`);

            // Restart the waiting state
            gameServer.gameState = new GameStateWaiting(gameServer);

            return true;
        } else {
            return false;
        }
    }

}
