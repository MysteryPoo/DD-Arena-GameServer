
import { ClientBase } from "./Abstracts/ClientBase";
import { IClient } from "./Interfaces/IClient";
import { MESSAGE_ID } from "./GameServer";
import { IUserClient } from "./Interfaces/IUserClient";

export class UserClient extends ClientBase implements IClient, IUserClient {

    public isReady: boolean = false;
    public gameVersion: number = 0;

    GetMessageTypeString(identifier: number): string {
        return MESSAGE_ID[identifier];
    }
    
    ValidateMessageId(identifier : number): boolean {
        return identifier >= MESSAGE_ID.FIRST && identifier <= MESSAGE_ID.LAST;
    }

}
