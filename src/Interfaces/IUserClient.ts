
import { IClient } from "./IClient";

export interface IUserClient extends IClient {

    isReady: boolean;
    gameVersion: number;
    
}
