//import { RoomPhase, Participant, Prompt, RoomTimer } from "../../../shared/room.types"
import type { PlayerDto } from "src/websocket/dtos/player.dto"

export class Room {
	public id: number
    public round: number//0 before start
	public turn: number//0 before start
    public maxPlayers: number
	public word: string | null//null outside of turn
	public drawer: number//userid
	public word_length: number//-1 outsie of turn
	public players: PlayerDto[] = [];
}