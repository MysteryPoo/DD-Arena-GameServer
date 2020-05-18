
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class Controller extends MessageBase {

    public index! : number;
    public isLeft! : boolean;
    public isRight! : boolean;
    public isUp! : boolean;
    public isDown! : boolean;
    public isPrimaryAction! : boolean;
    public isSecondaryAction! : boolean;
    public pointerX! : number;
    public pointerY! : number;

    serialize(): Buffer {
        let bufferSize = 8;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt8(bufferSize);

        helper.writeUInt8(this.index);
        
        let buttonFlags : number = 0;
        buttonFlags |= this.isLeft ? 0b10000000 : 0;
        buttonFlags |= this.isRight ? 0b01000000 : 0;
        buttonFlags |= this.isUp ? 0b00100000 : 0;
        buttonFlags |= this.isDown ? 0b00010000 : 0;
        buttonFlags |= this.isPrimaryAction ? 0b00001000 : 0;
        buttonFlags |= this.isSecondaryAction ? 0b00000100 : 0;
        helper.writeUInt8(buttonFlags);

        helper.writeUInt16LE(this.pointerX);
        helper.writeUInt16LE(this.pointerY);

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        try {
            let helper : BufferHelper = new BufferHelper(buffer);

            this.validate(buffer, 5);

            let buttonFlags : number = helper.readUInt8();
            this.isLeft = buttonFlags & 0b10000000 ? true : false;
            this.isRight = buttonFlags & 0b01000000 ? true : false;
            this.isUp = buttonFlags & 0b00100000 ? true : false;
            this.isDown = buttonFlags & 0b00010000 ? true : false;
            this.isPrimaryAction = buttonFlags & 0b00001000 ? true : false;
            this.isSecondaryAction = buttonFlags & 0b00000100 ? true : false;
            this.pointerX = helper.readUInt16LE();
            this.pointerY = helper.readUInt16LE();

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }

}
