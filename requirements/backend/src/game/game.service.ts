import { Injectable, Logger } from '@nestjs/common';
import { Room } from 'src/rooms/room.class';

@Injectable()
export class GameService {
	private readonly logger = new Logger(GameService.name);

	increaseRound(room: Room): void {
		room.round+= 1;
		room.turn = 1;
		this.logger.log(`Room ${room.id} started round.turn ${room.round}.${room.turn}`);
		//start turn (choose word, drawer)
		return;
	}
}