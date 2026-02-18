import { map } from "rxjs"
import { Room } from "./room.class"
import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import type { PlayerDto } from "src/websocket/dtos/player.dto";
import { UsersService } from "src/users/users.service";
import { UserScalarFieldEnum } from "src/generated/internal/prismaNamespace";


@Injectable()
export class RoomsService {
	private readonly logger = new Logger(RoomsService.name);
	constructor (
		private readonly usersService: UsersService,
	) {}
	
    private rooms = new Map<number, Room>();
	private userToRoom = new Map<number, number>();//userid -> roomid
	private nextId = 0;

	onModuleInit() {
		this.logger.log("Initializing RoomsService ...");
		const noRoom = this.createRoom(0);
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

	async addPlayerToFirstAvailableRoom(newuserId: number): Promise<Room> {
		//keep users from joining when already in any room
		if (this.userToRoom.has(newuserId)) {
			const existingRoomId = this.userToRoom.get(newuserId)!;
			return this.rooms.get(existingRoomId)!;
		}

		const user = await this.usersService.getUserById(newuserId);
		if (!user) {
			throw new Error("User not found");
		}
		const player: PlayerDto = {
			userId: newuserId,
			nickname: user.nickname,
			score: 0,
		}
		for (const room of this.rooms.values()) {
			if (room.players.length < room.maxPlayers) {
				room.players.push(player);
				this.userToRoom.set(newuserId, room.id);
				console.log(`User ${player.userId} ${player.nickname} joined room ${room.id}`);
				//check if enough players to play
				//if enough players, increase round (because this does round ++ and turn = 1 and gets a word and player ...)
				return room;
			}
		}
		//no room available
		console.log('NO room available');
		const dummyRoom = new Room();
		dummyRoom.id = -1;
		dummyRoom.round = 0;
		dummyRoom.turn = 0;
		dummyRoom.maxPlayers = 0;
		dummyRoom.word = null;
		dummyRoom.drawer = -1;
		dummyRoom.word_length = -1;
		dummyRoom.players = [];
		return dummyRoom;
	}

	removePlayer(userId: number) {
		console.log('remove Player', userId);
		const roomId = this.userToRoom.get(userId);
		if (!roomId) return;
		const room = this.rooms.get(roomId);
		console.log('from room', roomId);
		if (!room) return;
		room.players = room.players.filter(p => p.userId !== userId);
		this.userToRoom.delete(userId);
		console.log('player', userId, 'removed from Room', roomId);
	}

}
// removeParticipant(userId: string, roomId: string) --> CLASS METHOD
	// receives player ID that wants to leave from the client
	// the updated room, so the frontend sees that the player left.
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