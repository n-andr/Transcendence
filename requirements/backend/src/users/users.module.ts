import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DatabaseModule } from "src/database/database.module";
import { PrismaModule } from "src/database/prisma.module";
import { PrismaService } from "src/database/prisma.service";

@Module({
	controllers: [UsersController],
	providers: [UsersService, PrismaService],
	exports: [UsersService],
	imports: [DatabaseModule, PrismaModule],
})
export class UsersModule {}