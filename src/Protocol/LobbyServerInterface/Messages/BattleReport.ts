
import { MessageBase } from "../../../Abstracts/MessageBase";
import { BufferHelper } from "../../../BufferHelper";

class PlayerData {
    constructor(public id : string, public score : number, public trophyList : Array<number>) {

    }
}

export class BattleReport extends MessageBase {

    public winnerId! : string;
    public playerList! : Array<PlayerData>;

    serialize(): Buffer {
        let dynamicLength : number = 2; // winnerIdLength + playerListLength
        dynamicLength += Buffer.byteLength(this.winnerId, 'utf-8');
        for (let player of this.playerList) {
            dynamicLength += 1; // idLength
            dynamicLength += Buffer.byteLength(player.id, 'utf-8'); // id
            dynamicLength += 4; // score
            dynamicLength += 1; // trophyListLength
            dynamicLength += player.trophyList.length; // 1 byte per trophy
        }

        let bufferSize : number = 5 + dynamicLength;
        let helper : BufferHelper = new BufferHelper(Buffer.allocUnsafe(bufferSize));

        helper.writeUInt8(this.messageId);
        helper.writeUInt32LE(bufferSize);
        helper.writeUInt8(Buffer.byteLength(this.winnerId, 'utf-8'));
        helper.writeString(this.winnerId);
        helper.writeUInt8(this.playerList.length);
        for (let player of this.playerList) {
            helper.writeUInt8(Buffer.byteLength(player.id, 'utf-8'));
            helper.writeString(player.id);
            helper.writeUInt32LE(player.score);
            helper.writeUInt8(player.trophyList.length);
            for (let trophy of player.trophyList) {
                helper.writeUInt8(trophy);
            }
        }

        return helper.buffer;
    }

    deserialize(buffer: Buffer): void {
        throw new Error("Method not implemented.");
    }

}
