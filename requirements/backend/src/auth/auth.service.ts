import { Injectable } from '@nestjs/common';

//NB: Required for main to work. Marc completes logic here.

@Injectable()
export class AuthService {
	signup(email: string, password: string, username: string) {
		return 'signup called';
	}

	login(username: string, password: string) {
		return 'login called';
	}
}
