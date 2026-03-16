import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { RoomsModule } from 'src/rooms/rooms.module';
import { WordsModule } from 'src/words/words.module';
import { UsersModule } from 'src/users/users.module';
import { TurnEmitService } from 'src/websocket/turnemit.service';

@Module({
	providers: [GameService, TurnEmitService],
	exports: [GameService],
	imports: [RoomsModule, WordsModule, UsersModule],
})
export class GameModule {}