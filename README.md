# Dungeons and Dwarves: Arena Game Server

A gameserver application launchable through Docker for on-demand hosting. Lobby servers are responsible for launching and maintaining the containers.

# Running
## With Docker
The easiest way is to simply use Docker and pull the image from https://hub.docker.com/r/victordavion/ddags
Example run command:
docker run -d -p 40002:9000 --name ddags --restart unless-stopped -e PORT=9000 -e NOMATCHMAKING=1 victordavion/ddags
## Without Docker
One can also run without docker, but Node JS will be required. Being written in TypeScript, modify the tsconfig.json to match the transpiled JS version required for whatever version of Node you're targetting. (Tested on v12.13.0). Once Node is installed on the system, do the following:
* At the root of the project, create a '.env' file to fill with desired Environment Variable values (see below).
* npm install
* npm run build
* npm start

## Ports
The Game Server listens on port 9000 by default or the PORT enviornment variable.

## Environment Variables
| Variable Name | Usage | Expected Values |
| --- | --- | --- |
| PORT | Local port to listen (Useful when hosting outside of Docker) | A number 1-65535 |
| AUTHIP | IP Address of the Matchmaking Server | An IP or hostname |
| AUTHPORT | Port of the Matchmaking Server | A number 1-65535 |
| HOST | The UID of the client marked as Host for their lobby |
| PASSWORD | Secret string to authorize on the Matchmaking Server | A String |
| PLAYERCOUNT | Number of players for this session | A number |
| BOTCOUNT | Number of bots to introduce | A number |
| NOMATCHMAKING | If matchmaking is enabled, the server will shutdown if no one is connected. | 0 or 1 |
