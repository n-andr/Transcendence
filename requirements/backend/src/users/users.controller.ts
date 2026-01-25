import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('create')
	createUser(
		@Body('nickname') nickname: string,
		@Body('email') email: string,
		@Body('password') password: string,
	) {
		return this.usersService.createUser(nickname, email, password);
	}

	@Get(':nickname')
	getUser(@Param('nickname') nickname: string) {
		return this.usersService.getUser(nickname);
	}
}