import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectionRegistry } from './websocket.service';
import type { GuessPayload, GuessUpdatePayload, JoinRoomPayload, TurnInfoPayload } from './dtos/ws.payloads';
import { WS_EVENTS } from './dtos/ws.events';
import { RoomsService } from 'src/rooms/rooms.service';
import { GameService } from 'src/game/game.service';

@WebSocketGateway()
export class WebsocketGateway {
	//more flexible emit
	@WebSocketServer()
	server: Server;

	constructor( 
		private readonly registry: ConnectionRegistry,
		private readonly roomService: RoomsService,
		private readonly gameService: GameService
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
		this.roomService.removePlayer(userId);
		this.registry.removeConnection(userId, client);
		console.log(`Client ${client.id} with user id ${client.data.userId} disconnected`);
	}

	//events from here on downwards
	@SubscribeMessage('identify') //play
	async handleIdentify(
		@MessageBody() data: { userId: number },
		@ConnectedSocket() socket: Socket,
	) {
		socket.data.userId = data.userId;
		clearTimeout(socket.data.identifyTimer);
		this.registry.addConnection(data.userId, socket);
		console.log(`Socket ${socket.id} identified as user ${data.userId}`);
		socket.emit('identified'); // roomstate
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
		const room = await this.roomService.addPlayerToFirstAvailableRoom(payload.user_id);
		if (room.id === -1) {
			client.emit(WS_EVENTS.ROOM_FULL);
			return;
		}

		const socketRoom = `room-${room.id}`;//add user to socket room for the game room
		await client.join(socketRoom);

		const response: TurnInfoPayload = {
			room_id: room.id,
			drawer: room.drawer,
			word: room.word,
			word_length: room.word_length,
			round: room.round,
			turn: room.turn,
			players: room.players,
			time_to_display: 0,//no timer
		};
		this.server.to(socketRoom).emit(WS_EVENTS.TURN_INFO, response);
		if (room.players.length === 3) {
			//room.active = true;
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

}