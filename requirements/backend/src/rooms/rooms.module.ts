import { Module } from "@nestjs/common";
import { RoomsService } from "./rooms.service";

@Module({
  providers: [RoomsService],
  exports: [RoomsService], // allows other modules to use it
})
export class RoomsModule {}