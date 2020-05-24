
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class PlayerData extends MessageBase {

    public playerKey! : number;
    public controllerKey! : number;
    public ownerId! : string;
    public name! : string;
    public isAI! : boolean;
    public isMine! : boolean;

    serialize(): Buffer {
        let ownerIdLength : number = Buffer.byteLength(this.ownerId, 'utf-8');
        let nameLength : number = Buffer.byteLength(this.name, 'utf-8');

        let bufferSize : number = 8 + ownerIdLength + nameLength;

        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt8(bufferSize);

        helper.writeUInt8(this.playerKey);
        helper.writeUInt8(this.controllerKey);
        helper.writeUInt8(ownerIdLength);
        helper.writeString(this.ownerId);
        helper.writeUInt8(nameLength);
        helper.writeString(this.name);
        helper.writeUInt8(this.isAI ? 1 : 0); // TODO : Compress into flag mask
        helper.writeUInt8(this.isMine ? 1 : 0);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
