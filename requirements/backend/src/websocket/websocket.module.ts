import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { ConnectionRegistry } from './websocket.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
	providers: [WebsocketGateway, ConnectionRegistry],
	exports: [ConnectionRegistry],
	imports: [RoomsModule]
})
export class WebsocketModule {}