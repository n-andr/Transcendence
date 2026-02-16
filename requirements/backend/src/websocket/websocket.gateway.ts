import {
	WebSocketGateway,
	OnGatewayInit,
	OnGatewayConnection,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ConnectionRegistry } from './websocket.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { GameService } from 'src/game/game.service';

@WebSocketGateway()
export class WebsocketGateway {
	constructor( 
		private readonly registry: ConnectionRegistry,
		private readonly roomsService: RoomsService,
		private readonly gameService: GameService,
	) {}
	afterInit() { console.log('WebSocket Gateway initialized') }

	//Lifecycle hooks
	handleConnection(client: Socket) {
		console.log('Client connected: ', client.id);
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
	@SubscribeMessage('identify') //play
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

	@SubscribeMessage('create_room')
	handleCreateRoom(
  		@MessageBody() data: { roomId: number; maxPlayers: number },
  		@ConnectedSocket() socket: Socket,
		) {
  		const room = this.roomsService.createRoom(data.roomId, data.maxPlayers);
  		socket.emit('room_created', { roomId: room.id });
	}


	@SubscribeMessage('join_room')
	handleJoinRoom(
		@MessageBody() data: { roomId: number; name: string },
		@ConnectedSocket() socket: Socket,
	) {
		const userId = socket.data.userId;
		if (!userId)
			throw new Error('User not identified');
		const { roomId, name } = data;

		// call the RoomsService :)
		const room = this.roomsService.joinRoom(roomId, userId, name);

		// setup a new roomstate
		const roomState = {
			roomId: room.id,
			participants: room.getParticipants(),
			round: room.round,
			turn: -1,
			me: room.getParticipants().find(p => p.id === userId)
		}
 
		// emit the new roomstate to client
		socket.emit('room_state', roomState);
	}

	@SubscribeMessage('start_game')
	handleStartGame(
		@MessageBody() data: { roomId: number },
		@ConnectedSocket() socket: Socket,
	) {
		this.gameService.startGame(data.roomId);
		socket.emit('gameStarted');
	}

	@SubscribeMessage('lobby_state')
	handleLobbyState(
		@MessageBody() data: { roomId: number },
		@ConnectedSocket() socket: Socket,
	) {
		const names = this.roomsService.listParticipants(data.roomId);
		socket.emit('lobby_state_response', names);
	}
}
