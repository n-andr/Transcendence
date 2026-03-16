import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { ConnectionRegistry } from './websocket.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { RoomsModule } from 'src/rooms/rooms.module';
import { GameModule } from 'src/game/game.module';
import { TurnEmitService } from './turnemit.service';
import { UsersModule } from 'src/users/users.module';

@Module({
	providers: [WebsocketGateway, ConnectionRegistry, TurnEmitService],
	exports: [ConnectionRegistry, TurnEmitService],
	imports: [RoomsModule, GameModule, UsersModule]
})
export class WebsocketModule {}
