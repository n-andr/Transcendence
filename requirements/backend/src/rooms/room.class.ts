import { RoomPhase, Participant, Prompt, RoomTimer } from "../../../shared/room.types"

export class Room {
    public id: string
    public phase: RoomPhase
    public round: number
    public maxPlayers: number

    private DrawerId: string | null
    private Participants: Participant[]
    private Prompt: Prompt | null
    private RoomTimer: RoomTimer | null

    constructor(id: string, maxPlayers: number) {
        this.id = id
        this.maxPlayers = maxPlayers

        this.phase = "waiting"
        this.round = 1

        this.DrawerId = null
        this.Participants = []
        this.Prompt = null
        this.RoomTimer = null
    }
}