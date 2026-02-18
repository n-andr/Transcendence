//import { RoomPhase, Participant, Prompt, RoomTimer } from "../../../shared/room.types"

export class Room {
	public id: number
    public round: number
	public turn: number
    public maxPlayers: number
    /*private drawerId: number | null
    private participants: Participant[]
    private prompt: Prompt | null
    private roomTimer: RoomTimer | null
    
    public id: number
    public phase: RoomPhase
    public round: number
    public maxPlayers: number

    constructor(id: number, maxPlayers: number) {
        this.id = id
        this.maxPlayers = maxPlayers

        this.phase = "waiting"
        this.round = 1

        this.drawerId = null
        this.participants = []
        this.prompt = null
        this.roomTimer = null
    }

    getParticipants(): Participant[] {
	    return [...this.participants]; //return copy of original
    }
    
    addParticipant(participant: Participant) {
        if (this.participants.length >= this.maxPlayers)
			throw new Error("Room is full")
        this.participants.push(participant);
    }*/


}