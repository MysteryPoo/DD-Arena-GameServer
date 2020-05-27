
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

export class Handshake extends MessageBase {

    public gameVersion!: number;
    public gameServerPassword!: string;
    public playerIdList!: Array<string>;
    public playerTokenList!: Array<number>;

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
        try {
            this.playerIdList = [];
            this.playerTokenList = [];

            let helper : BufferHelper = new BufferHelper(buffer);

            let playerCount : number = helper.readUInt8();
            for (let index = 0; index < playerCount; ++index) {
                let idLength : number = helper.readUInt8();
                let id : string = helper.readString(idLength);
                this.playerIdList.push(id);
            }
            for (let index = 0; index < playerCount; ++index) {
                let token : number = helper.readUInt16LE();
                this.playerTokenList.push(token);
            }

            this.valid = true;
        } catch (e) {
            this.valid = false;
        }
    }

}
