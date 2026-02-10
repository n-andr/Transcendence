import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { ConnectionRegistry } from './websocket.service';

@Module({
	providers: [WebsocketGateway, ConnectionRegistry],
	exports: [ConnectionRegistry],
})
export class WebsocketModule {}