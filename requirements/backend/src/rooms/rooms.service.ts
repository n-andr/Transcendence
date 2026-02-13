import { map } from "rxjs"
import { Room } from "./room.class"
import { Injectable } from "@nestjs/common";
import { Participant } from "../../../shared/room.types";

@Injectable()
export class RoomService {
    private rooms = new Map<number, Room>()
	private userToRoom = new Map<number, number>()

	// methods below
    getRoom(roomId: number) {
        return this.rooms.get(roomId)
    }

	// for lobby functionality
	getAllRooms(): Room[] {
		return [...this.rooms.values()]
	}

    createRoom(roomId: number, maxPlayers: number): Room {
        const room = new Room(roomId, maxPlayers);
		this.rooms.set(roomId, room)
		return room;
    }

	joinRoom(roomId: number, playerId: number, name: string): Room {
		const room = this.rooms.get(roomId)

		if (!room)
			throw new Error("Room not found")
		if (this.userToRoom.has(playerId)) // can immediately acces the right room without searching
			throw new Error("User already in room")
		
		
		const participant: Participant = {
				id: playerId,
				name: name,
				score: 0,
				role: "drawer",
				status: "connected",
			};

		//add player to Room class
		room.addParticipant(participant)

		// save user in usertoRoom map
		this.userToRoom.set(playerId, roomId)

		return room;
	}

}

// removeParticipant(userId: string, roomId: string) --> CLASS METHOD
	// receives player ID that wants to leave from the client
	// the updated room, so the frontend sees that the player left.
