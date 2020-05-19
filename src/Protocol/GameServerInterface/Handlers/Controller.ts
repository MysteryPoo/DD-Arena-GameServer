
import { MessageHandlerBase } from "../../../Abstracts/MessageHandlerBase";
import { Controller } from "../Messages/Controller";
import { GameServer, ClientController } from "../../../GameServer";
import { IClient } from "../../../Interfaces/IClient";

export class ControllerHandler extends MessageHandlerBase {

    handle(buffer: Buffer, myClient: IClient): boolean {
        let message : Controller = new Controller(this.messageId, buffer);

        if (message.valid) {
            let gameServer : GameServer = myClient.connectionManager as GameServer;
            // Update all controllers controlled by myClient
            for (let controllerIndex in gameServer.playerList) {
                let controller : ClientController = gameServer.playerList[Number(controllerIndex)];
                if (controller.isMe(myClient)) {
                    message.index = Number(controllerIndex);
                    controller.isUp = message.isUp;
                    controller.isDown = message.isDown;
                    controller.isLeft = message.isLeft;
                    controller.isRight = message.isRight;
                    controller.isPrimaryAction = message.isPrimaryAction;
                    controller.isSecondaryAction = message.isSecondaryAction;
                    controller.pointerX = message.pointerX;
                    controller.pointerY = message.pointerY;

                    // Update everyone of the changes
                    for (let [uid, client] of gameServer.getAllSockets()) {
                        if(!client.write(message.serialize())) {
                            console.debug("Failed to send message.");
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
