//import { RoomPhase, Participant, Prompt, RoomTimer } from "../../../shared/room.types"
import type { PlayerDto } from "src/websocket/dtos/player.dto"
import type { Stroke } from "src/websocket/dtos/ws.payloads"

/*Where all room related variables are stored. This was purely used to store data.
No thought has been put into weither things shoudl be public or whatever.*/
export class Room {
	public id: number
    public round: number//0 before start
	public maxRounds: number
	public turn: number//0 before start
    public maxPlayers: number
	public word: string | null//null outside of turn
	public drawer: number//userid
	public word_length: number//-1 outsie of turn
	public players: PlayerDto[] = [];
	public strokes: Stroke[] = [];
	correctGuesses: Set<number> = new Set();//user ids that guessed correctly
	timeout?: NodeJS.Timeout;
	//public active: boolean;
}