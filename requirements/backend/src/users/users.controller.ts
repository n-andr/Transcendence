import { Controller, Get, Post, Body, Param } from "@nestjs/common";
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

	@Get('test-db')
	async testDb() {
	const result = await this.databaseService.query('SELECT 1+1 AS sum');
	console.log(result.rows);
	return result.rows;
	}
	
	@Get(':nickname')
	getUser(@Param('nickname') nickname: string) {
		return this.usersService.getUser(nickname);
	}

	
}