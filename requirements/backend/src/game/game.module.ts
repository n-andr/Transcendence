import { Module } from "@nestjs/common";
import { GameService } from "./game.service";

@Module({
  controllers: [],
  providers: [GameService],
  exports: [],
})
export class GameModule {}

