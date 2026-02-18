import { Module } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { UsersModule } from "src/users/users.module";
import { GameModule } from "src/game/game.module";

@Module({
  providers: [RoomsService],
  exports: [RoomsService], // allows other modules to use it
  imports: [UsersModule, GameModule],
})
export class RoomsModule {}