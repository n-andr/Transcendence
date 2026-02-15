import { Participant } from "./room.types";

export type GuessRequest = {
    guesser : Participant
    guess : string
    Room_id : number
}

export type GuessResponse = {
    correct : boolean
    guesser : Participant
    guess : string
    score : number
}

