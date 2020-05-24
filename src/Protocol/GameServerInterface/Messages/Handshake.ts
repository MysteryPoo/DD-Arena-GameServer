
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class Handshake extends MessageBase {

    error! : number;

    protocolVersion! : number;
    token! : number;


    serialize(): Buffer {
        let bufferSize : number = 3;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt8(bufferSize);
        helper.writeUInt8(this.error);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        try {
            let helper : BufferHelper = new BufferHelper(buffer);

            this.validate(buffer, 3);

            this.protocolVersion = helper.readUInt8();
            this.token = helper.readUInt16LE();

            this.valid = true;

        } catch (e) {
            this.valid = false;
        }
    }

}
