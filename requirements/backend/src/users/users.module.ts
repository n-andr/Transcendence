import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DatabaseModule } from "src/database/database.module";
import { PrismaModule } from "src/database/prisma.module";

@Module({
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
	imports: [DatabaseModule, PrismaModule],
})
export class UsersModule {}