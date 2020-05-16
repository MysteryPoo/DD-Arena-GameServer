
export interface IMessageBase {

    valid : boolean;
    serialize() : Buffer;
    deserialize(buffer : Buffer) : void;
    
}
