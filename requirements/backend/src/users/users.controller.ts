import { Controller, Get, Post, Body, Param, ParseIntPipe } from "@nestjs/common";
import { UsersService } from "./users.service";
import { DatabaseService } from "../database/database.service";

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly databaseService: DatabaseService,
	) {}

	@Post('create')
	createUser(
		@Body('nickname') nickname: string,
		@Body('email') email: string,
		@Body('password') password: string,
	) {
		return this.usersService.createUser(nickname, email, password);
	}

	@Get('email/:email')
	getUser(@Param('email') email: string) {
		return this.usersService.getUser(email);
	}

	@Get('id/:id')
	getUserById(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.getUserById(id);
	}

	@Get('nickname/:nickname')
	getUserByNickname(@Param('nickname') nickname: string) {
		return this.usersService.getUserByNickname(nickname);
	}

	@Get('me')
	getUserProfile(@Body() userId: number) {
		return this.usersService.getUserById(userId);
	}
}
