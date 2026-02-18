import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayInit,
	OnGatewayConnection,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { ConnectionRegistry } from './websocket.service';
import { GameService } from '../game/game.service';

@WebSocketGateway()
export class WebsocketGateway {
	@WebSocketServer()
	server: Server;
	constructor(
		private readonly registry: ConnectionRegistry,
		private readonly gameService: GameService,
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
		const userId = client.data.userId;
		if (!userId) return;
		this.registry.removeConnection(userId, client);
		console.log(`Client ${client.id} with user id ${client.data.userId} disconnected`);
	}

	//events from here on downwards
	@SubscribeMessage('identify')
	handleIdentify(
		@MessageBody() data: { userId: number },
		@ConnectedSocket() socket: Socket,
	) {
		socket.data.userId = data.userId;
		clearTimeout(socket.data.identifyTimer);
		this.registry.addConnection(data.userId, socket);
		console.log(`Socket ${socket.id} identified as user ${data.userId}`);
		socket.emit('identified');
		this.registry.printRegistry();
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

	@SubscribeMessage('drawing_move_made')
	handleDrawingMove(
		@MessageBody() data: any,
		@ConnectedSocket() client: Socket,
	) {
		if (client.id != this.gameService.getNextDrawer(data.room_id)) {
			throw new Error(`Client is not the drawer of roomId=${data.room_id}`);
		}
		this.server.to(data.room_id).emit('drawing_broadcast', data);
	}

	// internal events from here on downwards
	@OnEvent('trigger_results')
	sendResults(evt: { roomID: string; payload: any }) {
		this.server.to(evt.roomID).emit('game_results', evt.payload);
	}

	@OnEvent('start_turn')
	sendTurnInfo(evt: { roomID: string; turn_info: any}) {
		this.server.to(evt.roomID).emit('turn_info', evt.turn_info);
	}



	//start of the mock data
	//replace with real handlers

	@SubscribeMessage('play')
	join_room(
	@MessageBody() data: { userId: number },
	@ConnectedSocket() client: Socket,
	) {
	console.log('Received play from', data?.userId, 'socket userId:', client.data.userId);

	// (optional) basic guard: make sure identify happened
	if (!client.data.userId) {
		// Socket.IO ACK: return an error to the client callback
		return { ok: false, message: 'Not identified yet' };
	}

	// 1) Immediately send "room_state" (waiting state)
	client.emit('room_state', {
		members: [
		{ Nickname: 'Nata', User_ID: client.data.userId, Score: 0 },
		{ Nickname: 'Bot', User_ID: 999, Score: 0 },
		],
		round: -1,
		turn: -1,
	});

	// 2) After 2 seconds send "start_game"
	setTimeout(() => {
		client.emit('start_game', {
		members: [
			{ Nickname: 'Nata', User_ID: client.data.userId, Score: 0 },
			{ Nickname: 'Bot', User_ID: 999, Score: 0 },
		],
		round: 1,
		turn: 1,
		});
	}, 2000);

	// ACK success (this is the "ack" object your FE callback receives)
	return { ok: true, message: 'Mocked play accepted' };
	}

}
