import { Module } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { UsersModule } from "src/users/users.module";

@Module({
  providers: [RoomsService],
  exports: [RoomsService], // allows other modules to use it
  imports: [UsersModule],
})
export class RoomsModule {}