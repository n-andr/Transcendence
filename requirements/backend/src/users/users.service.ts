import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { User } from "src/generated/client"


@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	createUser(nickname: string, email: string, password: string): Promise<User> {
		console.log(`I would be creating a user: ${nickname}, ${email}`);
		//call database
		//return {nickname, email, password };
		return this.prisma.user.create({
			data: { nickname, email, password },
		});
	}
	getUser(nickname: string): Promise<User | null> {
		console.log(`I would be fetching User data for: ${nickname}`);
		//call database
		//return {nickname, email: 'Dummy@example.com', password: 'secret' };
		return this.prisma.user.findUnique({
			where: { nickname },
		});
	}
}