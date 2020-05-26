
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";
import { GAMESTATE } from "../../../GameState";

export class GameState extends MessageBase {

    public gameState! : GAMESTATE;
    public metaData! : number;

    serialize(): Buffer {
        let bufferSize : number = 4;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt8(bufferSize);

        helper.writeUInt8(this.gameState);
        helper.writeUInt8(this.metaData);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
