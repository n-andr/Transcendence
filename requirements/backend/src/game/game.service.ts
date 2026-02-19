import { Injectable, Logger } from '@nestjs/common';
import { Room } from 'src/rooms/room.class';
//import { RoomsService } from 'src/rooms/rooms.service';
import { GuessPayload, GuessUpdatePayload, ResultsPayload, TurnInfoPayload } from 'src/websocket/dtos/ws.payloads';
import { Server } from 'socket.io'//server allows emiting from anyhwere
import { WS_EVENTS } from 'src/websocket/dtos/ws.events';

@Injectable()
export class GameService {
	private readonly logger = new Logger(GameService.name);//for writing backend logs that are this green formated thingy
	
	startTurn(room: Room, server: Server): void {
		if (room.round === 0) this.increaseRound(room);
		else this.increaseTurn(room);
		room.word = "example_word";
		room.word_length = room.word!.length;
		room.drawer = room.players[room.turn-1].userId;
		const socketRoom = `room-${room.id}`;
		const payload: TurnInfoPayload = {
			room_id: room.id,
			drawer: room.drawer,
			word: room.word,
			word_length: room.word_length,
			round: room.round,
			turn: room.turn,
			players: room.players,
			time_to_display: 10_000,//10s for console test
		}
		server.to(socketRoom).emit(WS_EVENTS.TURN_INFO, payload);
		this.logger.log(`Room ${room.id} round.turn ${room.round}.${room.turn}, drawerId: ${room.drawer} draws ${room.word}`);
		room.timeout = setTimeout(() => {
			room.timeout = undefined;
			this.endOfTurn(room, server);
		}, payload.time_to_display);
	}

	increaseTurn(room: Room): void {
		if (room.turn === room.players.length) {
			this.increaseRound(room);
			return;
		}
		room.turn += 1;
		//this.startTurn(room);
	}

	increaseRound(room: Room): void {
		room.round+= 1;
		if (room.round > room.maxRounds) {
			console.log('send final results');
			return;
		}
		room.turn = 1;
		this.logger.log(`Room ${room.id} started round ${room.round}`);
		//this.startTurn(room);
		return;
	}

	guessValidation(payload: GuessPayload, room: Room): GuessUpdatePayload | null {
		if (!room) return null;
		const player = room.players.find(p => p.userId === payload.guesser_id);
		if (!player) return null;//guesser not in room
		if (room.correctGuesses.has(player.userId)) return null;//already guessed correctly
		if (player.userId == room.drawer) return null;//drawers do not guess
		const iscorrect = (payload.guess === room.word);

		if (iscorrect === true) {
			player.score += 1;//dummy for point gaining logic
			room.correctGuesses.add(player.userId);
		}
		
		const response: GuessUpdatePayload = {
			guesser_id: payload.guesser_id,
			guess: iscorrect ? null : payload.guess,//only send wrong guesses
			room_id: room.id,
			score: player.score,
			correct: iscorrect,
		};
		return response;
	}

	endOfTurn(room: Room, server: Server) {
		//update drawer score
		const drawer = room.players.find(p => p.userId === room.drawer);
		if (drawer) drawer.score += room.correctGuesses.size;//dummy for points logic for drawer
		room.correctGuesses.clear();//prep for next turn
		let isFinal = false;
		if (room.round === room.maxRounds && room.turn === room.players.length) isFinal = true;
		const response: ResultsPayload = {
			final: isFinal,
			solution: room.word!,
			time_to_display: 1_000,//1s for quick testing
		};
		const socketRoom = `room-${room.id}`;
		server.to(socketRoom).emit(WS_EVENTS.RESULTS, response);
		room.timeout = setTimeout(() => {
			if (!isFinal) {
				//start next turn after timeout
				room.timeout = undefined;
				this.startTurn(room, server);
			}
		}, response.time_to_display);
	}

	checkEndOfTurn(room: Room, server: Server) {
		if (room.correctGuesses.size < room.players.length -1) return;
		console.log('All guessed correctly');
		if (room.timeout) {
			clearTimeout(room.timeout);
			room.timeout = undefined;
		}
		this.endOfTurn(room, server);
	}
}