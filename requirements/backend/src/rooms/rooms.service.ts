import { map } from "rxjs"
import { Room } from "./room.class"

export class RoomService {
    private rooms = new Map<string, Room>();

    getRoom(roomId: string) {
        return this.rooms.get(roomId)
    }

    createRoom(roomId: string, maxPlayers: number) {
        return new Room(roomId, maxPlayers);
    }
}


// addParticipant(userId: string) --> CLASS METHOD

// removeParticipant(userId: string, roomId: string) --> CLASS METHOD
	// receives player ID that wants to leave from the client
	// the updated room, so the frontend sees that the player left.

/* 
AddParticipant(number playerid, number roomid)
	receives player ID that wants to join from the client
		-> if (!playerID)
			-> error;
	room ID to join
		-> if player ID is not in room ID
			-> error;
		--> if n_players > max_player
			--> error;
		--> if player is already in room;
			--> error;
	if (!drawing)
		-> do not return the currentWord
	returns the updated room that was joined (so frontend sees the new player in the list)
