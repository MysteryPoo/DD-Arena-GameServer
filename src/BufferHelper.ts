
export class BufferHelper {

    private tell : number = 0;

    constructor(public buffer : Buffer) {

    }

    public writeUInt8(value : number) : void {
        this.buffer.writeUInt8(value, this.tell);
        this.tell += 1;
    }

    public writeUInt16LE(value : number) : void {
        this.buffer.writeUInt16LE(value, this.tell);
        this.tell += 2;
    }

    public writeUInt32LE(value : number) : void {
        this.buffer.writeUInt32LE(value, this.tell);
        this.tell += 4;
    }

    public writeBigUInt64LE(value : bigint) : void {
        this.buffer.writeBigUInt64LE(value, this.tell);
        this.tell += 8;
    }

    public writeString(data : string) : void {
        let length = Buffer.byteLength(data, 'utf-8');
        this.buffer.write(data, this.tell, length, 'utf-8');
        this.tell += length;
    }

    public readUInt8() : number {
        let returnValue : number = this.buffer.readUInt8(this.tell);
        this.tell += 1;
        return returnValue;
    }

    public readUInt16LE() : number {
        let returnValue : number = this.buffer.readUInt16LE(this.tell);
        this.tell += 2;
        return returnValue;
    }

    public readUInt32LE() : number {
        let returnValue : number = this.buffer.readUInt32LE(this.tell);
        this.tell += 4;
        return returnValue;
    }

    public readBigUInt64LE() : bigint {
        let returnValue : bigint = this.buffer.readBigInt64LE(this.tell);
        this.tell += 8;
        return returnValue;
    }

    public readString(length : number) : string {
        let returnValue : string = this.buffer.toString('utf-8', this.tell, this.tell + length);
        this.tell += length;
        return returnValue;
    }
}
