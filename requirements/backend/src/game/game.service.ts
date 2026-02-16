import { Injectable } from "@nestjs/common";
import { RoomState } from "../../../shared/room.types"
import { RoomsService } from "src/rooms/rooms.service";

@Injectable()
export class GameService {
    constructor(private readonly roomsService: RoomsService) {}

    //startgame
    startGame(roomId: number): RoomState {
        const room = this.roomsService.getRoom(roomId);
            if (!room) 
                throw new Error("Room not found");

        // maybe the room class should just own the roomstate?
        const updatedRoomState: RoomState = {
            roomId: roomId,
            phase: "starting",
            round: 1,
            turn: 1,
            timer: null, // TO BE UPDATED
            prompt: null, // TO BE UPDATED
            participants: room.getParticipants(),
        };
        return updatedRoomState;

    };
}