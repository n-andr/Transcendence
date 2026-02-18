import { Injectable, Logger } from '@nestjs/common';
import { Room } from 'src/rooms/room.class';
//import { RoomsService } from 'src/rooms/rooms.service';
import { GuessPayload, GuessUpdatePayload } from 'src/websocket/dtos/ws.payloads';

@Injectable()
export class GameService {
	private readonly logger = new Logger(GameService.name);
	/*constructor(
		private readonly roomsService: RoomsService
	) {}*/
	startTurn(room: Room): void {
		room.word = "example_word";
		room.word_length = room.word!.length;
		room.drawer = room.players[room.turn-1].userId;
		//start turn (choose word, drawer)
		this.logger.log(`Room ${room.id} round.turn ${room.round}.${room.turn}, drawerId: ${room.drawer} draws ${room.word}`);
	}

	increaseTurn(room: Room): void {
		if (room.turn === room.players.length) {
			this.increaseRound(room);
			return;
		}
		room.turn += 1;
		this.startTurn(room);
	}

	increaseRound(room: Room): void {
		room.round+= 1;
		if (room.round > room.maxRounds) {
			console.log('send final results');
			return;
		}
		room.turn = 1;
		this.logger.log(`Room ${room.id} started round ${room.round}`);
		this.startTurn(room);
		return;
	}

	guessValidation(payload: GuessPayload, room: Room): GuessUpdatePayload | null {
		//const room = this.roomsService.getRoom(payload.room_id);
		if (!room) return null;
		const player = room.players.find(p => p.userId === payload.guesser_id);
		if (!player) return null;//guesser not in room
		if (room.correctGuesses.has(player.userId)) return null;//already guessed correctly
		if (player.userId == room.drawer) return null;//drawers do not guess
		const iscorrect = (payload.guess === room.word);

		if (iscorrect === true) {
			player.score += 1;
			room.correctGuesses.add(player.userId);
			if (room.correctGuesses.size >= room.players.length -1) console.log('All guessed correctly');//trigger results
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
}