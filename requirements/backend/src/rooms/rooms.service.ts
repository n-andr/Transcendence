import { map } from "rxjs"
import { Room } from "./room.class"
import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import type { PlayerDto } from "src/websocket/dtos/player.dto";
import type { Stroke } from "src/websocket/dtos/ws.payloads"
import { UsersService } from "src/users/users.service";
import { UserScalarFieldEnum } from "src/generated/internal/prismaNamespace";


@Injectable()
export class RoomsService {
	private readonly logger = new Logger(RoomsService.name);
	private rooms = new Map<number, Room>();
	private userToRoom = new Map<number, number>();//userid -> roomid
	private nextId = 0;

	constructor(private readonly usersService: UsersService) {}
 
	onModuleInit() {
		this.logger.log("Initializing RoomsService ...");
		const room = this.createRoom(5);
		console.log("Default room created");
		this.logger.log(`Room created on startup: id=${room.id}, maxPlayers=${room.maxPlayers}`);
        this.logger.log(`Total rooms after startup: ${this.rooms.size}`);
	}

	createRoom(maxPlayers: number): Room {
        const room = new Room();
		room.state = "lobby";
		room.id = this.nextId++;
		room.round = 0;
		room.turn = 0;
		room.maxRounds = 2;//2 for testing
		room.maxPlayers = maxPlayers;
		this.rooms.set(room.id, room);//add room to map
		this.logger.log(`Room created: id=${room.id}`);
		return room;
    }
	// methods below
    getRoom(roomId: number): Room | undefined {
        return this.rooms.get(roomId);
    }

	// for lobby functionality
	getAllRooms(): Room[] {
		return Array.from(this.rooms.values());
	}

	deleteRoom(roomId: number): void {
		this.rooms.delete(roomId);
		this.logger.log(`Room deleted: id=${roomId}`);
	}

	async findAvailableRoom(newUserId: number): Promise<Room> {
		//keep users from joining when already in any room
		if (this.userToRoom.has(newUserId)) {
			const existingRoomId = this.userToRoom.get(newUserId)!;
			return this.rooms.get(existingRoomId)!;
		}

		for (const room of this.rooms.values()) {
			if (room.players.length < room.maxPlayers) {
				return room;
			}
		}
	    // no room exists → create one automatically
		const newRoom = this.createRoom(5);
		this.logger.log('Created new room because none available');
		return newRoom;
	}

	async addUser(newUserId: number, roomId: number, state: string) {
		const user = await this.usersService.getUserById(newUserId);
		if (!user) {
			throw new Error("User not found");
		}

		// Double-check after async call to avoid races from duplicate join requests.
		if (this.userToRoom.has(newUserId)) {
			throw new Error("User denied! (Expected behavior in React dev mode)");
		}

		const room = this.getRoom(roomId);
		if (!room) return;
		const player: PlayerDto = {
			userId: newUserId,
			nickname: user.nickname,
			score: 0,
			friends: [],
		}
		if (state === 'player' && room.players.length < room.maxPlayers)
			room.players.push(player);
		else
			room.spectators.push(player);
		this.userToRoom.set(newUserId, room.id);
		console.log(`User ${player.userId} ${player.nickname} joined room ${room.id} as ${state}`);
	}
	
	// NB Remove player adjusted to remove user, so that it handles both removing players and spectators
	removeUser(userId: number) {
		const roomId = this.userToRoom.get(userId);
		if (roomId === undefined) return;
		const room = this.rooms.get(roomId);
		if (!room) return;
		room.players = room.players.filter(p => p.userId !== userId);
		room.spectators = room.spectators.filter( p => p.userId !== userId);
		this.userToRoom.delete(userId);
		console.log('User', userId, 'removed from Room', roomId);
	}

	admitSpectators(roomId: number) {
		const room = this.getRoom(roomId);
		if (!room)
			return;
		while (room.spectators.length > 0 && room.players.length < room.maxPlayers)
		{
			const spectator = room.spectators.shift()!;
			room.players.push(spectator);
		}
		if (room.spectators.length > 0) //debug
			console.log('Players filled, number of spectators: ', room.spectators.length); //debug
		else //debug
			console.log('All spectators have joined'); //debug
	}

	removeAllUsers(roomId: number) {
		console.log('remove all players from room ', roomId);
		const room = this.rooms.get(roomId);
		if (!room) return;
		// remove user → room mappings
		for (const player of room.players) {
			this.userToRoom.delete(player.userId);
		}
		for (const spectator of room.spectators) {
			this.userToRoom.delete(spectator.userId);
		}
		// clear players array (keep reference)
		room.players.length = 0;
		console.log('all players removed from room', roomId);
	}

	appendStrokes(strokes: Stroke[], roomId: number) {
        const room = this.getRoom(roomId);
        if (!room)
            return;
        room.strokes.push(...strokes);
    }

    getStrokes(roomId: number) : Stroke[] {
		const room = this.getRoom(roomId);
        if (!room)
            throw new Error('Room not found');
        return room.strokes;
	}

    clearStrokes(roomId: number) {
        const room = this.getRoom(roomId);
        if (!room)
            return;
        room.strokes.length = 0;
    }

    popStroke(roomId: number) {
        const room = this.getRoom(roomId);
		if (!room)
			return;
		room.strokes.pop();
    }

	isUserInRoom(userId: number, roomId: number): boolean {
    return this.userToRoom.get(userId) === roomId;
}

}

