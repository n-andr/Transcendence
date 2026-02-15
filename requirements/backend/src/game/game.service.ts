import { Injectable } from "@nestjs/common";
import { RoomState } from "../../../shared/room.types"
import { RoomsService } from "src/rooms/rooms.service";

@Injectable()
export class GameService {
    constructor(private readonly roomsService: RoomsService) {}

    //startgame
    startGame(roomId: number): RoomState {
        const updatedRoomState: RoomState = {
            roomId: roomId,
            phase: "starting",
            round: 1,
            timer: null, // TO BE UPDATED
            prompt: null,
            participants: this.roomsService.getRoom(roomId).getParticipants(),
            me: 
        };
        return updatedRoomState;

    };
    //update game

}