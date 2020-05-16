
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class Handshake extends MessageBase {

    public gameVersion!: number;
    public gameServerPassword!: string;
    public playerIdList!: Array<string>;

    serialize(): Buffer {
        let gameServerPasswordLength : number = Buffer.byteLength(this.gameServerPassword, 'utf-8');
        let playerIdsLength : number = 0;
        for (let playerId of this.playerIdList) {
            playerIdsLength += Buffer.byteLength(playerId, 'utf-8');
        }
        let bufferSize : number = 8 + gameServerPasswordLength + this.playerIdList.length + playerIdsLength;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        helper.writeUInt8(this.gameVersion);
        helper.writeUInt8(gameServerPasswordLength);
        helper.writeString(this.gameServerPassword);
        helper.writeUInt8(this.playerIdList.length);
        for (let playerId of this.playerIdList) {
            let idLength : number = Buffer.byteLength(playerId, 'utf-8');
            helper.writeUInt8(idLength);
            helper.writeString(playerId);
        }

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
