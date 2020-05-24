
import { MessageBase } from "../../../Abstracts/MessageBase";

export class SetHost extends MessageBase {

    

    serialize(): Buffer {
        throw new Error("Method not implemented.");
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
