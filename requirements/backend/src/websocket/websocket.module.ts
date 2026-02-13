import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { ConnectionRegistry } from './websocket.service';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
	imports: [RoomsModule],
	providers: [WebsocketGateway, ConnectionRegistry],
	exports: [ConnectionRegistry],
})
export class WebsocketModule {}