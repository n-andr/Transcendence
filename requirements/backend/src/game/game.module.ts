import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
	providers: [GameService],
	exports: [GameService],
	//imports: [RoomsModule],
})
export class GameModule {}