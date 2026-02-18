import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WebsocketGateway } from './websocket.gateway';
import { ConnectionRegistry } from './websocket.service';
import { GameService } from '../game/game.service';

@Module({
	imports: [EventEmitterModule.forRoot() , GameService],
	providers: [WebsocketGateway, ConnectionRegistry],
	exports: [ConnectionRegistry],
})
export class WebsocketModule {}
