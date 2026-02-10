// src/game/game.module.ts
import { Module } from '@nestjs/common';
import { WebsocketModule } from '../websocket/websocket.module';
import { timeoutProvider } from 'rxjs/internal/scheduler/timeoutProvider';
import { TmpController } from './tmp.controller';

@Module({
  imports: [WebsocketModule],  // to inject ConnectionRegistry
  controllers: [TmpController],
})
export class TmpModule {}
//copy and paste for testing