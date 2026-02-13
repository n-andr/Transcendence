import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],  // Export so other modules can use it
})
export class RoomsModule {}