
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class SyncPosition extends MessageBase {

    public objectID! : number;
    public x! : number;
    public y! : number;

    serialize(): Buffer {
        let bufferSize : number = 10;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt8(bufferSize);

        helper.writeUInt32LE(this.objectID);
        helper.writeUInt16LE(this.x);
        helper.writeUInt16LE(this.y);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        try {
            let helper : BufferHelper = new BufferHelper(buffer);

            this.validate(buffer, 8);

            this.objectID = helper.readUInt32LE();
            this.x = helper.readUInt16LE();
            this.y = helper.readUInt16LE();

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }

}
