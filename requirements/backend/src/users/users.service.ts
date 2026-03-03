import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { User } from "@prisma/client"


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
	async getUserByNickname(nickname: string): Promise<User | null> {
		console.log(`I am fetching User data by nickname: ${nickname}`);
		return this.prisma.user.findUnique({
			where: { nickname },
		});
	}
	async addFriend(userID: number, friendID: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userID },
			select: { friends: true },
		});

		if (!user) {
			throw new Error("User not found");
		}

		const friends = user.friends ?? [];

		if (!friends.includes(friendID)) {
			await this.prisma.user.update({
				where: { id: userID },
				data: { friends: [...friends, friendID] },
			});
		}
	}
	async removeFriend(userID: number, friendID: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userID },
			select: { friends: true },
		});

		if (!user) {
			throw new Error("User not found");
		}

		const friends = user.friends ?? [];

		if (friends.includes(friendID)) {
			await this.prisma.user.update({
				where: { id: userID },
				data: { friends: friends.filter((id: number) => id !== friendID) },
			});
		}
	}
}
