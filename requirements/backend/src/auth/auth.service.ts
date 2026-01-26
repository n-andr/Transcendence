import { Injectable } from '@nestjs/common';

//NB: Required for main to work. Marc completes logic here.

@Injectable()
export class AuthService {
	signup(email: string, password: string, username: string) {
		return { message: 'signup called' };
	}

	login(email: string, password: string) {
		return { message: 'login called' };
	}
}
