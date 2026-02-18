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
import type { JoinRoomPayload, TurnInfoPayload } from './dtos/ws.payloads';
import { WS_EVENTS } from './dtos/ws.events';
import { RoomsService } from 'src/rooms/rooms.service';

@WebSocketGateway()
export class WebsocketGateway {
	//enables sending from anywhere in gateway
	@WebSocketServer()
	server: Server;

	constructor( 
		private readonly registry: ConnectionRegistry,
		private readonly roomService: RoomsService
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
		this.roomService.removePlayer(userId);
		this.registry.removeConnection(userId, client);
		console.log(`Client ${client.id} with user id ${client.data.userId} disconnected`);
	}

	//events from here on downwards
	@SubscribeMessage('identify') //play
	handleIdentify(
		@MessageBody() data: { userId: number },
		@ConnectedSocket() socket: Socket,
	) {
		socket.data.userId = data.userId;
		clearTimeout(socket.data.identifyTimer);
		this.registry.addConnection(data.userId, socket);
		console.log(`Socket ${socket.id} identified as user ${data.userId}`);
		socket.emit('identified'); // roomstate
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

	@SubscribeMessage(WS_EVENTS.JOIN_ROOM) 
	async handleJoinRoom(
		@ConnectedSocket() client: Socket,
		@MessageBody() payload: JoinRoomPayload,
	) {
		console.log('[recv] JoinRoom', payload);
		const room = await this.roomService.addPlayerToFirstAvailableRoom(payload.user_id);
		const response: TurnInfoPayload = {
			roomd_id: room.id,
			drawer: room.drawer,
			word: room.word,
			word_length: room.word_length,
			round: room.round,
			turn: room.turn,
			players: room.players,
		};

		client.emit(WS_EVENTS.TURN_INFO, response);
	}

	/*@SubscribeMessage('JoinRoom')
	handleJoinRoom(
		@MessageBody() data: { roomId: number; name: string },
		@ConnectedSocket() socket: Socket,
	) {
		const userId = socket.data.userId;
		if (!userId)
			return; //DEBUG return error?
		const { roomId, name } = data;
		console.log('JoinRoom');*/

		// call the roomservice :)
		/*const room = this.roomService.joinRoom(roomId, userId, name);

		// setup a new roomstate
		const roomState = {
			roomId: room.id,
			participants: room.getParticipants(),
			round: room.round,
			// turn:
			me: room.getParticipants().find(p => p.id === userId)
		}
 
		// emit the new roomstate to client
		socket.emit('room_state', roomState);*/
	//}

}