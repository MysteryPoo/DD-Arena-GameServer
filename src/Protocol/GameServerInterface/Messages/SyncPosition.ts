
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class SyncPosition extends MessageBase {

    public key! : number;
    public x! : number;
    public y! : number;
    public hitPoints! : number;

    serialize(): Buffer {
        let bufferSize : number = 8;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt8(bufferSize);

        helper.writeUInt8(this.key);
        helper.writeUInt16LE(this.x);
        helper.writeUInt16LE(this.y);
        helper.writeUInt8(this.hitPoints);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        try {
            let helper : BufferHelper = new BufferHelper(buffer);

            this.validate(buffer, 6);

            this.key = helper.readUInt8();
            this.x = helper.readUInt16LE();
            this.y = helper.readUInt16LE();
            this.hitPoints = helper.readUInt8();

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }

}
