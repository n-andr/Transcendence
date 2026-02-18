import { map } from "rxjs"
import { Room } from "./room.class"
import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
//import { Participant } from "../../../shared/room.types";

//temporarily copied from shared folder to silence problems
/*export interface Participant {
  id: number;
  name: string;
  avatarUrl?: string;

  role: "drawer" | "guesser"; //| "spectator"
  status: "connected" | "disconnected"; // guessed correctly 

  score: number;
}*/

@Injectable()
export class RoomsService {
	private readonly logger = new Logger(RoomsService.name);
    private rooms = new Map<number, Room>();
	private nextId = 1;

	onModuleInit() {
		this.logger.log("Initializing RoomsService ...");
		const room = this.createRoom(5);
		console.log("Default room created");
		this.logger.log(`Room created on startup: id=${room.id}, maxPlayers=${room.maxPlayers}`);
        this.logger.log(`Total rooms after startup: ${this.rooms.size}`);
	}

	//private userToRoom = new Map<number, number>()
	createRoom(maxPlayers: number): Room {
        const room = new Room();
		room.id = this.nextId++;
		room.round = 0;
		room.turn = 0;
		room.maxPlayers = maxPlayers;
		this.rooms.set(room.id, room);//add room to map
		this.logger.log(`Room created: id=${room.id}`);
		return room;
    }
	// methods below
    getRoom(roomId: number): Room | undefined {
        return this.rooms.get(roomId)
    }

	// for lobby functionality
	getAllRooms(): Room[] {
		return Array.from(this.rooms.values());
	}
	//unnecessary?
	deleteRoom(roomId: number): void {
		this.rooms.delete(roomId);
		this.logger.log(`Room deleted: id=${roomId}`);
	}
}
// removeParticipant(userId: string, roomId: string) --> CLASS METHOD
	// receives player ID that wants to leave from the client
	// the updated room, so the frontend sees that the player left.
