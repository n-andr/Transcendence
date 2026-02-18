import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { User } from "src/generated/client"


@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	createUser(nickname: string, email: string, password: string): Promise<User> {
		console.log(`I am creating a user: ${nickname}, ${email}`);
		//call database
		//return {nickname, email, password };
		return this.prisma.user.create({
			data: { nickname, email, password },
		});
	}
	getUser(email: string): Promise<User | null> {
		console.log(`I am fetching User data by email: ${email}`);
		//call database
		//return {nickname, email: 'Dummy@example.com', password: 'secret' };
		return this.prisma.user.findUnique({
			where: { email },
		});
	}
	async getUserById(id: number): Promise<User | null> {
		console.log(`I am fetching User data by ID: ${id}`);
		return this.prisma.user.findUnique({
			where: { id },
		});
	}
}