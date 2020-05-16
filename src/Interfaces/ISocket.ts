
export interface ISocket {
    isConnected : boolean;
    write(buffer : Buffer) : boolean;
    destroy() : void;
}
