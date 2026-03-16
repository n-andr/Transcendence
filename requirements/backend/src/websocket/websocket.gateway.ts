import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Injectable } from "@nestjs/common";
import { Server, Socket } from 'socket.io';
import { ConnectionRegistry } from './websocket.service';
import type { DrawPayload, GuessPayload, GuessUpdatePayload, JoinRoomPayload, TurnInfoPayload, StrokeAppendPayload, AddFriendPayload, FriendListPayload, RemoveFriendPayload } from './dtos/ws.payloads';
import { WS_EVENTS } from './dtos/ws.events';
import { RoomsService } from 'src/rooms/rooms.service';
import { GameService } from 'src/game/game.service';
import { UsersService } from 'src/users/users.service';
import { PlayerDto } from './dtos/player.dto';
import { User } from "@prisma/client";
import { TurnEmitService } from './turnemit.service';

@WebSocketGateway()
export class WebsocketGateway {
	//more flexible emit
	@WebSocketServer()
	server: Server;

	constructor(
		private readonly registry: ConnectionRegistry,
		private readonly roomService: RoomsService,
		private readonly gameService: GameService,
		private readonly usersService: UsersService,
		private readonly turnemitservice: TurnEmitService,
	) {}
	afterInit() { console.log('WebSocket Gateway initialized') }

	//Lifecycle hooks
	handleConnection(client: Socket) {
		console.log('Client connected: ', client.id);
		client.emit('pleaseIdentify');
		//after timeout (in ms) is up, check if condition is met)
		const timer = setTimeout(() => {
			if (!client.data.userId) {
				console.log('Identify timeout missed by client with id: ', client.id)
				client.disconnect(true);
			}
		}, 5000);
		client.data.identifyTimer = timer;
	}

	handleDisconnect(client: Socket) {
		//automatically removes socket from socket.io rooms
		const userId = client.data.userId;
		if (!userId) return;

		const roomId = client.data.roomId;
    	const room = this.roomService.getRoom(roomId);

		// if the disconnect === drawer: end turn)
		if (room && room.drawer === userId && room.state === 'playing') {
			if (room.timeout) {
				clearTimeout(room.timeout);
				room.timeout = undefined;
			}
			console.log('Drawing player disconnected: turn ended');
		    this.gameService.endOfTurn(room, this.server);
		}
		this.roomService.removeUser(userId);
		this.registry.removeConnection(userId, client);
		console.log(`Client ${client.id} with user id ${client.data.userId} disconnected`);
	}

	//events from here on downwards
	@SubscribeMessage('identify')
	async handleIdentify(
		@MessageBody() data: { userId: number },
		@ConnectedSocket() socket: Socket,
	) {
		socket.data.userId = data.userId;
		clearTimeout(socket.data.identifyTimer);
		this.registry.addConnection(data.userId, socket);
		console.log(`Socket ${socket.id} identified as user ${data.userId}`);
		socket.emit('identified');
		this.registry.printRegistry();
		await socket.join(`user-${data.userId}`);
	}

	@SubscribeMessage('whoAmI')
	handleWhoAmI(
		@MessageBody() data: any,//call with empty data {}
		@ConnectedSocket() client: Socket,
	) {
		console.log('Received whoAmI from', client.data.userId, 'with data: ', data);
		client.emit('youAre', {
			userId: client.data.userId ?? null,
		});
	}

	@SubscribeMessage(WS_EVENTS.JOIN_ROOM) 
	async handleJoinRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: JoinRoomPayload,
	) {
		console.log('[recv] JoinRoom', payload);

		// add user to available room in the backend
		const room = await this.roomService.findAvailableRoom(payload.user_id);

		try {
			if (room.state === 'lobby' && room.players.length < room.maxPlayers)
				await this.roomService.addUser(payload.user_id, room.id, 'player')
			else if (room.state == 'playing')
				await this.roomService.addUser(payload.user_id, room.id, 'spectator');
		} catch (e) {
			console.log(`[JoinRoom] ${e.message}`); 
		}

		if (room.id === -1) {
			client.emit(WS_EVENTS.ROOM_FULL);
			return;
		}
		// add user to the socket.io room
		const socketRoom = `room-${room.id}`;
		await client.join(socketRoom);
		client.data.roomId = room.id;

		// build and emit payload for every player & spectator individually.
		this.turnemitservice.emitTurnInfo(room, this.server);

		// emit drawing state to everybody
		this.emitFullDrawingState(room.id, client);
		if (room.players.length === 3 && room.state === 'lobby') {
			this.gameService.startTurn(room, this.server);
		}
	}

	@SubscribeMessage(WS_EVENTS.GUESS)
	handleGuess(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: GuessPayload,
	) {
		console.log('[recv] Guess', payload);
		const socketRoom = `room-${payload.room_id}`;
		const room = this.roomService.getRoom(payload.room_id);
		if (room === undefined) return;
		const response: any = this.gameService.guessValidation(payload, room);
		if (!response) return;
		this.server.to(socketRoom).emit(WS_EVENTS.GUESS_UPDATE, response);
		this.gameService.checkEndOfTurn(room, this.server);
	}

	@SubscribeMessage(WS_EVENTS.STROKE_START)
	handleStrokeStart(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: DrawPayload,
	) {
		console.log('[recv] stroke:start'); 
		const socketRoom = 'room-' + payload.room_id;
		const room = this.roomService.getRoom(payload.room_id);
		if (!room) return;
		if (client.data.userId != room.drawer) return;
		// emit batch payload to the rooms clients
		console.log('[send] stroke:start');
		client.to(socketRoom).emit(WS_EVENTS.STROKE_START, payload);

		// add draw payload to the server?
		this.roomService.appendStrokes(payload.strokes, payload.room_id);
	}
	
	@SubscribeMessage(WS_EVENTS.STROKE_APPEND)
	handleStrokeAppend(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: StrokeAppendPayload,
	) {
		const room = this.roomService.getRoom(client.data.roomId);
		if (!room) return;
		const roomId = payload.room_id;
		if (client.data.userId !== room.drawer) return;
		const strokes = this.roomService.getStrokes(roomId);
		const s = strokes.find((x: any) => x.id === payload.id);
		if (s) s.points.push(...payload.points);

		client.to(`room-${payload.room_id}`).emit(WS_EVENTS.STROKE_APPEND, payload);
	}

	@SubscribeMessage(WS_EVENTS.CANVAS_CLEAR)
	handleCanvasClear(
		@ConnectedSocket() client: Socket,
	) {
		const room = this.roomService.getRoom(client.data.roomId);
			if (!room) return;
		if (client.data.userId !== room.drawer) return;
		this.roomService.clearStrokes(client.data.roomId);
		this.emitFullDrawingState(client.data.roomId);
	}

	@SubscribeMessage(WS_EVENTS.CANVAS_UNDO)
	handleCanvasUndo(
		@ConnectedSocket() client: Socket,
	) {
		const room = this.roomService.getRoom(client.data.roomId);
			if (!room) return;
		if (client.data.userId !== room.drawer) return;
		this.roomService.popStroke(client.data.roomId);
		this.emitFullDrawingState(client.data.roomId);
	}

	@SubscribeMessage('test:setDrawer')
	handleTestSetDrawer(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: { room_id: number; drawer_id: number },
	) {
		console.log('[test] Setting drawer to', payload.drawer_id, 'in room', payload.room_id);

		const room = this.roomService.getRoom(payload.room_id);
		if (!room) {
			client.emit('error', 'Room not found');
			return;
		}
		//this.gameService.startTurn(room, this.server); // reset turn state, timers, etc. like normal turn start would
		// Update room state
		this.roomService.clearStrokes(room.id);
		console.log('[test] Cleared strokes for room', room.id);
		// server.to(socketRoom).emit(WS_EVENTS.CANVAS_CLEAR);
		this.emitFullDrawingState(room.id);
		console.log('[test] Emitted full drawing state for room', room.id);
		room.drawer = payload.drawer_id;
		room.turn = 1;
		room.round = 1;
		room.word = 'testword';
		room.word_length = 8;

		// Send to all players in room
		const socketRoom = `room-${payload.room_id}`;
		const response: TurnInfoPayload = {
			room_id: room.id,
			drawer: payload.drawer_id,
			word: room.word,
			word_length: room.word_length,
			round: room.round,
			turn: room.turn,
			players: room.players,
			time_to_display: 60_000,
		};

		this.server.to(socketRoom).emit(WS_EVENTS.TURN_INFO, response);
		console.log('[test] Sent TURN_INFO with drawer:', payload.drawer_id);
	}

	// SERVER -> CLIENT HELPERS
	private emitFullDrawingState(roomId: number, client?: Socket) {
		const strokes = this.roomService.getStrokes(roomId);
		const payload = {
			room_id: roomId,
			strokes: strokes,
		}
		if (client)
			client.emit(WS_EVENTS.INIT_DRAWING, payload);
		else
			this.server.to('room-' + roomId).emit(WS_EVENTS.INIT_DRAWING, payload);
	}

	@SubscribeMessage(WS_EVENTS.ADD_FRIEND)
	async handleAddFriend(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: AddFriendPayload,

	) {
		console.log(`[handleAddFriend][recv] AddFriend`, payload);
		const newFriend: User | null = await this.usersService.getUserByNickname(payload.newFriend);
		if (!newFriend) {
			throw new Error("User not found");
		}
		await this.usersService.addFriend(payload.player, newFriend.id);
		const room = this.roomService.getRoom(payload.room_id);
		if (!room) {
			throw new Error("Room not found");
		}

		const friendList: FriendListPayload = {
			room_id: payload.room_id,
			friends: await this.gameService.getFriends(payload.player, room),
		}
		client.emit(WS_EVENTS.FRIEND_LIST, friendList);
	}

	@SubscribeMessage(WS_EVENTS.REMOVE_FRIEND)
	async handleRemoveFriend(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: RemoveFriendPayload,
	) {
		const friendToRemove: User | null = await this.usersService.getUserByNickname(payload.removeFriend);
		if (!friendToRemove) {
			throw new Error("User not found");
		}
		this.usersService.removeFriend(payload.player, friendToRemove.id);
		const room = this.roomService.getRoom(payload.room_id);
		if (!room) {
			throw new Error("Room not found");
		}

		const friendList: FriendListPayload = {
			room_id: payload.room_id,
			friends: await this.gameService.getFriends(payload.player, room),
		}
		client.emit(WS_EVENTS.FRIEND_LIST, friendList);
	}
}
