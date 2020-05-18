
import { config } from "dotenv";
import { GameServer } from "./GameServer";
import { LobbyConnectionManager } from "./LobbyConnectionManager";

config();
const gameServerPort : number = Number(process.env.PORT);

let lobbyConnMgr : LobbyConnectionManager = new LobbyConnectionManager();

const gameServer : GameServer = new GameServer(lobbyConnMgr);
console.debug(gameServerPort);
gameServer.start(gameServerPort);
