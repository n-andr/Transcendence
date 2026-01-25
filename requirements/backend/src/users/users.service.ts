import { Injectable } from "@nestjs/common";


@Injectable()
export class UsersService {
	createUser(nickname: string, email: string, password: string) {
		console.log('I would be creating a user: ${nickname}, ${email}');
		//call database
		return {nickname, email, password };
	}
	getUser(nickname: string) {
		console.log('I would be fetching User data for: ${nickname}');
		//call database
		return {nickname, email: 'Dummy@example.com', password: 'secret' };
	}
}