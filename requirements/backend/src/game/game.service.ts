import { ConsoleLogger, Injectable, Logger } from '@nestjs/common';
import { Room } from 'src/rooms/room.class';
import { FriendListPayload, GuessPayload, GuessUpdatePayload, ResultsPayload, TurnInfoPayload } from 'src/websocket/dtos/ws.payloads';
import { Server, Socket } from 'socket.io'//server allows emiting from anyhwere
import { WS_EVENTS } from 'src/websocket/dtos/ws.events';
import { WordsService } from 'src/words/words.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { PlayerDto } from 'src/websocket/dtos/player.dto';
import { UsersService } from 'src/users/users.service';
import { TurnEmitService } from 'src/websocket/turnemit.service';
import { TURN_DURATION, RESULTS_DURATION } from './game.constants';

const MAX_GUESS_LENGTH = 100;
const POPUP_DISPLAY_MS = 3000; // Countdown popup duration

@Injectable()
export class GameService {
	private readonly logger = new Logger(GameService.name);
	constructor(
	private readonly wordsService: WordsService,
	private readonly roomsService: RoomsService,
	private readonly usersService: UsersService,
	private readonly turnEmitService: TurnEmitService
	) {}

	async startTurn(room: Room, server: Server) {
		console.log(`Room ${room.id} at start of turn ${room.turn}: players ${room.players.map(p => p.userId)}, spectators ${room.spectators.map(s => s.userId)}`);

		if (room.players.length < 2) {
			this.gameOver(room, server, true);
			return;
		}
		//clear drawing board for new turn
		this.roomsService.clearStrokes(room.id);
		room.turnStartTime = Date.now();
		server.to(`room-${room.id}`).emit(WS_EVENTS.INIT_DRAWING, {
			room_id: room.id,
			strokes: [],
    	});

		if (room.round === 0) this.increaseRound(room);
		else this.increaseTurn(room);

		console.log("USING WORD SERVICE NOW");
		const wordEntity = await this.wordsService.getRandomWord(room.usedWordIds);

		room.word = wordEntity.text;
		room.word_length = room.word!.length;
		room.usedWordIds.push(wordEntity.id);
		console.log("usedWordIds:", room.usedWordIds);
		room.drawer = room.players[(room.turn-1) % room.players.length].userId; //modulo to always pick an existing player index even when others disconnect.
		room.turnStartTime = Date.now();

		// Calculate turn duration: base turn time + popup duration for non-spectators
		const turnDurationWithPopup = TURN_DURATION + POPUP_DISPLAY_MS;

		this.turnEmitService.emitTurnInfo(room, server, turnDurationWithPopup);

		this.logger.log(`Room ${room.id} round.turn ${room.round}.${room.turn}, drawerId: ${room.drawer} draws ${room.word}`);
		this.sendFriendsToAll(room, server);
		
		// Timeout should use the base duration only (popup happens during this time)
		room.timeout = setTimeout(() => {
			room.timeout = undefined;
			this.endOfTurn(room, server);
		}, TURN_DURATION);
	}

	async sendFriendsToAll(room: Room, server: Server) {
		const players = room.players;

		for (const p of players) {
			const friendsInRoom = await this.getFriends(p.userId, room);
			const payload: FriendListPayload = {
				room_id: room.id,
				friends: friendsInRoom,
			}
			console.log(`[sendFriendsToAll] [GameService] Sending friend list to user ${p.userId} in room ${room.id}:`, friendsInRoom);
			server.to(`user-${p.userId}`).emit(WS_EVENTS.FRIEND_LIST, payload);
		}

		// const idToNickname = new Map<number, string>();
		// for (const p of players) {
		// 	idToNickname.set(p.userId, p.nickname);
		// }

		// for (const p of players) {
		// 	const friendsIds: number[] = (p.friends ?? []);
		// 	friendsIds.filter((friendId: number) => idToNickname.has(friendId));
		// 	const friendsInRoom: string[] =
		// 	friendsIds.map((friendId) => idToNickname.get(friendId)!);

		// 	const payload: FriendListPayload = {
		// 		room_id: room.id,
		// 		friends: friendsInRoom,
		// 	}
		// 	console.log(`[sendFriendsToAll] [GameService] Sending friend list to user ${p.userId} in room ${room.id}:`, friendsInRoom);
		// 	server.to(p.userId.toString()).emit(WS_EVENTS.FRIEND_LIST, payload);
		// }
	}

	async getFriends(userID: number, room: Room): Promise<string[]> {
		const user = await this.usersService.getUserById(userID);
		if (!user) {
			throw new Error("Player not found");
		}

		const players = room.players;
		const idToNickname = new Map<number, string>();
		for (const p of players) {
			idToNickname.set(p.userId, p.nickname);
		}

		const friendsIds: number[] = (user.friends ?? []);
		friendsIds.filter((friendId: number) => idToNickname.has(friendId));
		const friendsInRoom: string[] =
		friendsIds.map((friendId) => idToNickname.get(friendId)!);
		return friendsInRoom;
	}

	increaseTurn(room: Room): void {
		if (room.turn >= room.players.length) {
			this.increaseRound(room);
			return;
		}
		room.turn += 1;
	}

	increaseRound(room: Room): void {
		room.round+= 1;
		if (room.round > room.maxRounds) {
			console.log('send final results');
			return;
		}
		room.turn = 1;
		room.state = "playing";
		this.logger.log(`Room ${room.id} started round ${room.round}`);
		return;
	}

	guessValidation(payload: GuessPayload, room: Room): GuessUpdatePayload | null {
		if (!room) return null;
		const player = room.players.find(p => p.userId === payload.guesser_id);
		if (!player) return null;//guesser not in room
		if (room.correctGuesses.has(player.userId)) return null;//already guessed correctly
		if (player.userId == room.drawer) return null;//drawers do not guess

		const typedGuess = payload.guess.trim();
		if (typedGuess.length === 0 || typedGuess.length > MAX_GUESS_LENGTH) return null;
		const normalizedGuess = typedGuess.toLowerCase();
		const normalizedWord = (room.word ?? "").toLowerCase();
		const iscorrect = normalizedGuess === normalizedWord;

		if (iscorrect === true) {
			// Calculate guesser score based on time remaining
			const elapsed = room.turnStartTime ? Date.now() - room.turnStartTime : 0;
			const timeRemaining = Math.max(0, TURN_DURATION - elapsed);
			let guesserPoints = 20;
			if (timeRemaining > 10_000) {
				guesserPoints = 50;
			} else if (timeRemaining > 5_000) {
				guesserPoints = 30;
			}
			player.score += guesserPoints;
			room.correctGuesses.add(player.userId);
		
			// Drawer gets 30 points per correct guess
			const drawer = room.players.find(p => p.userId === room.drawer);
			if (drawer) drawer.score += 30;
		}

		const response: GuessUpdatePayload = {
			guesser_id: payload.guesser_id,
			guess: iscorrect ? null : typedGuess,//only send wrong guesses
			room_id: room.id,
			score: player.score,
			correct: iscorrect,
		};
		return response;
	}

	endOfTurn(room: Room, server: Server) {
		//update drawer score
		/* const drawer = room.players.find(p => p.userId === room.drawer);
		if (drawer) drawer.score += room.correctGuesses.size;//dummy for points logic for drawer*/
		room.correctGuesses.clear();//prep for next turn

		// admit spectators if there are any
		this.roomsService.admitSpectators(room.id);

		// check if there are enough players to continue
		if (room.players.length < 2) {
    		console.log(`Room ${room.id} has to little players, aborting startTurn`);
			this.gameOver(room, server, true);
		}
		else if (room.round === room.maxRounds && room.turn >= room.players.length) {
			console.log(`Room ${room.id} finished the game`);
			this.gameOver(room, server, true);
		}
		else {
			console.log(`Room ${room.id} finished a turn`);
			this.gameOver(room, server, false);
		}
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

	gameOver(room: Room, server: Server, endgame: boolean) {
		const response: ResultsPayload = {
			final: endgame,
			solution: room.word!,
			time_to_display: RESULTS_DURATION,
			players: room.players,
		};
		const socketRoom = `room-${room.id}`;
		server.to(socketRoom).emit(WS_EVENTS.RESULTS, response);

		if (endgame) {
			this.roomsService.removeAllUsers(room.id);
				room.usedWordIds.length = 0;
				room.round = 0;
				room.turn = 0;
				room.state = 'lobby';
		}
		else {
			room.timeout = setTimeout(() => {
				room.timeout = undefined;
				this.startTurn(room, server);
			}, response.time_to_display);
		}
	}
}
